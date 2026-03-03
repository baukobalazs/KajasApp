import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { recipes, recipeIngredients } from '@/db/schema';
import { authOptions } from '@/lib/auth';

const updateRecipeSchema = z.object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    ingredients: z.array(z.object({
        foodId: z.string().uuid(),
        amountG: z.number().positive(),
    })).optional(),
});

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const recipe = await db.query.recipes.findFirst({
            where: eq(recipes.id, params.id),
            with: { ingredients: { with: { food: true } } },
        });

        if (!recipe) return NextResponse.json({ error: 'Recept nem található' }, { status: 404 });
        if (recipe.userId !== session.user.id) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 403 });

        return NextResponse.json(recipe);
    } catch (error) {
        console.error('Recipe GET hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const recipe = await db.query.recipes.findFirst({ where: eq(recipes.id, params.id) });
        if (!recipe) return NextResponse.json({ error: 'Recept nem található' }, { status: 404 });
        if (recipe.userId !== session.user.id) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 403 });

        const body = await req.json();
        const parsed = updateRecipeSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

        if (parsed.data.name || parsed.data.description !== undefined) {
            await db.update(recipes).set({
                name: parsed.data.name || recipe.name,
                description: parsed.data.description || recipe.description,
            }).where(eq(recipes.id, params.id));
        }

        if (parsed.data.ingredients) {
            await db.delete(recipeIngredients).where(eq(recipeIngredients.recipeId, params.id));
            await db.insert(recipeIngredients).values(
                parsed.data.ingredients.map((i) => ({
                    recipeId: params.id,
                    foodId: i.foodId,
                    amountG: String(i.amountG),
                }))
            );
        }

        const updated = await db.query.recipes.findFirst({
            where: eq(recipes.id, params.id),
            with: { ingredients: { with: { food: true } } },
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Recipe PUT hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const recipe = await db.query.recipes.findFirst({ where: eq(recipes.id, params.id) });
        if (!recipe) return NextResponse.json({ error: 'Recept nem található' }, { status: 404 });
        if (recipe.userId !== session.user.id) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 403 });

        await db.delete(recipes).where(eq(recipes.id, params.id));

        return NextResponse.json({ message: 'Sikeresen törölve' });
    } catch (error) {
        console.error('Recipe DELETE hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}