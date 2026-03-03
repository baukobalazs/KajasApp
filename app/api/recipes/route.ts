import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { recipes, recipeIngredients } from '@/db/schema';
import { authOptions } from '@/lib/auth';

const ingredientSchema = z.object({
    foodId: z.string().uuid(),
    amountG: z.number().positive(),
});

const recipeSchema = z.object({
    name: z.string().min(1, 'A recept neve kötelező'),
    description: z.string().optional(),
    ingredients: z.array(ingredientSchema).min(1, 'Legalább egy hozzávaló szükséges'),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const result = await db.query.recipes.findMany({
            where: eq(recipes.userId, session.user.id),
            with: { ingredients: { with: { food: true } } },
            orderBy: (recipes, { desc }) => [desc(recipes.createdAt)],
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Recipes GET hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const body = await req.json();
        const parsed = recipeSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const { name, description, ingredients } = parsed.data;

        const [newRecipe] = await db.insert(recipes).values({
            userId: session.user.id,
            name,
            description: description || null,
        }).returning();

        await db.insert(recipeIngredients).values(
            ingredients.map((i) => ({
                recipeId: newRecipe.id,
                foodId: i.foodId,
                amountG: String(i.amountG),
            }))
        );

        return NextResponse.json(newRecipe, { status: 201 });
    } catch (error) {
        console.error('Recipes POST hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}