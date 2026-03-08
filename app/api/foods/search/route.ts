import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/db';
import { foods } from '@/db/schema';
import { eq } from 'drizzle-orm';

// GET /api/foods/search?q=csirkemell — OpenFoodFacts keresés
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const query = req.nextUrl.searchParams.get('q');
        if (!query || query.length < 2) {
            return NextResponse.json({ error: 'Legalább 2 karakter szükséges' }, { status: 400 });
        }

        const response = await fetch(
            `${process.env.OPENFOODFACTS_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page_size=25&fields=id,product_name,nutriments`, { next: { revalidate: 3600 } }
        );

        if (!response.ok) {
            return NextResponse.json({ error: 'OpenFoodFacts hiba' }, { status: 502 });
        }

        const data = await response.json();

        // Csak az értelmes találatokat adjuk vissza
        const results = (data.products || [])
            .filter((p: any) => p.product_name && p.nutriments?.['energy-kcal_100g'])
            .map((p: any) => ({
                openfoodfactsId: p.id || p._id,
                name: p.product_name,
                caloriesPer100g: Math.round(p.nutriments['energy-kcal_100g'] || 0),
                proteinPer100g: Math.round((p.nutriments['proteins_100g'] || 0) * 10) / 10,
                carbsPer100g: Math.round((p.nutriments['carbohydrates_100g'] || 0) * 10) / 10,
                fatPer100g: Math.round((p.nutriments['fat_100g'] || 0) * 10) / 10,
            }));

        return NextResponse.json(results);
    } catch (error) {
        console.error('OpenFoodFacts keresés hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}

// POST /api/foods/search — étel mentése az adatbázisba
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const body = await req.json();
        const { openfoodfactsId, name, caloriesPer100g, proteinPer100g, carbsPer100g, fatPer100g } = body;

        if (!name || !caloriesPer100g) {
            return NextResponse.json({ error: 'Hiányzó mezők' }, { status: 400 });
        }

        // Ha már létezik az adatbázisban, visszaadjuk azt
        if (openfoodfactsId) {
            const existing = await db.query.foods.findFirst({
                where: eq(foods.openfoodfactsId, openfoodfactsId),
            });
            if (existing) return NextResponse.json(existing);
        }

        // Új étel mentése
        const [newFood] = await db.insert(foods).values({
            openfoodfactsId: openfoodfactsId || null,
            name,
            caloriesPer100g: String(caloriesPer100g),
            proteinPer100g: proteinPer100g ? String(proteinPer100g) : null,
            carbsPer100g: carbsPer100g ? String(carbsPer100g) : null,
            fatPer100g: fatPer100g ? String(fatPer100g) : null,
        }).returning();

        return NextResponse.json(newFood, { status: 201 });
    } catch (error) {
        console.error('Food mentés hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}