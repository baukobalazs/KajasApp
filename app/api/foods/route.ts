import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq, ilike, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { foods } from '@/db/schema';
import { authOptions } from '@/lib/auth';

const foodSchema = z.object({
    name: z.string().min(1, 'A név kötelező'),
    caloriesPer100g: z.number().positive('A kalória pozitív szám legyen'),
    proteinPer100g: z.number().min(0).optional(),
    carbsPer100g: z.number().min(0).optional(),
    fatPer100g: z.number().min(0).optional(),
    openfoodfactsId: z.string().optional(),
});

// GET /api/foods — élelmiszerek listázása (keresés, szűrés, rendezés)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });
        }

        const { searchParams } = req.nextUrl;
        const search = searchParams.get('search') || '';
        const minCal = searchParams.get('minCal');
        const maxCal = searchParams.get('maxCal');
        const sortBy = searchParams.get('sortBy') || 'name';
        const sortOrder = searchParams.get('sortOrder') || 'asc';

        const conditions = [];
        if (search) conditions.push(ilike(foods.name, `%${search}%`));
        if (minCal) conditions.push(gte(foods.caloriesPer100g, minCal));
        if (maxCal) conditions.push(lte(foods.caloriesPer100g, maxCal));

        const result = await db.query.foods.findMany({
            where: conditions.length > 0 ? and(...conditions) : undefined,
            orderBy: (foods, { asc, desc }) => {
                const order = sortOrder === 'desc' ? desc : asc;
                if (sortBy === 'calories') return [order(foods.caloriesPer100g)];
                if (sortBy === 'protein') return [order(foods.proteinPer100g)];
                return [order(foods.name)];
            },
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Foods GET hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}

// POST /api/foods — új élelmiszer hozzáadása (csak admin)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });
        }
        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Csak admin adhat hozzá élelmiszert' }, { status: 403 });
        }

        const body = await req.json();
        const parsed = foodSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const [newFood] = await db.insert(foods).values({
            name: parsed.data.name,
            caloriesPer100g: String(parsed.data.caloriesPer100g),
            proteinPer100g: parsed.data.proteinPer100g ? String(parsed.data.proteinPer100g) : null,
            carbsPer100g: parsed.data.carbsPer100g ? String(parsed.data.carbsPer100g) : null,
            fatPer100g: parsed.data.fatPer100g ? String(parsed.data.fatPer100g) : null,
            openfoodfactsId: parsed.data.openfoodfactsId || null,
        }).returning();

        return NextResponse.json(newFood, { status: 201 });
    } catch (error) {
        console.error('Foods POST hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}