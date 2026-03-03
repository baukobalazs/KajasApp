import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { meals, mealEntries } from '@/db/schema';
import { authOptions } from '@/lib/auth';

const mealEntrySchema = z.object({
    foodId: z.string().uuid().optional(),
    recipeId: z.string().uuid().optional(),
    amountG: z.number().positive('A gramm mennyiség pozitív szám legyen'),
}).refine(
    (data) => (data.foodId && !data.recipeId) || (!data.foodId && data.recipeId),
    { message: 'Pontosan egy food_id vagy recipe_id szükséges' }
);

// GET /api/meals?date=2026-03-01 — napi étkezések lekérése
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const date = req.nextUrl.searchParams.get('date');
        if (!date) return NextResponse.json({ error: 'A date paraméter kötelező' }, { status: 400 });

        const result = await db.query.meals.findMany({
            where: and(
                eq(meals.userId, session.user.id),
                eq(meals.date, date)
            ),
            with: {
                entries: {
                    with: {
                        food: true,
                        recipe: true,
                    },
                },
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Meals GET hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}

// POST /api/meals — étel hozzáadása étkezéshez
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const body = await req.json();
        const { date, type, entry } = body;

        if (!date || !type || !entry) {
            return NextResponse.json({ error: 'Hiányzó mezők: date, type, entry' }, { status: 400 });
        }

        const parsedEntry = mealEntrySchema.safeParse(entry);
        if (!parsedEntry.success) {
            return NextResponse.json({ error: parsedEntry.error.issues[0].message }, { status: 400 });
        }

        // Megkeressük vagy létrehozzuk az étkezést
        let meal = await db.query.meals.findFirst({
            where: and(
                eq(meals.userId, session.user.id),
                eq(meals.date, date),
                eq(meals.type, type)
            ),
        });

        if (!meal) {
            const [newMeal] = await db.insert(meals).values({
                userId: session.user.id,
                date,
                type,
            }).returning();
            meal = newMeal;
        }

        // Bejegyzés hozzáadása
        const [newEntry] = await db.insert(mealEntries).values({
            mealId: meal.id,
            foodId: parsedEntry.data.foodId || null,
            recipeId: parsedEntry.data.recipeId || null,
            amountG: String(parsedEntry.data.amountG),
        }).returning();

        return NextResponse.json(newEntry, { status: 201 });
    } catch (error) {
        console.error('Meals POST hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}