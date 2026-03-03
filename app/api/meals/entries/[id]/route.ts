import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { mealEntries, meals } from '@/db/schema';
import { authOptions } from '@/lib/auth';

// PUT /api/meals/entries/[id] — gramm mennyiség módosítása
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const { amountG } = await req.json();
        if (!amountG || amountG <= 0) {
            return NextResponse.json({ error: 'Érvénytelen mennyiség' }, { status: 400 });
        }

        // Ellenőrzés: a bejegyzés a bejelentkezett userhez tartozik-e
        const entry = await db.query.mealEntries.findFirst({
            where: eq(mealEntries.id, params.id),
            with: { meal: true },
        });

        if (!entry) return NextResponse.json({ error: 'Bejegyzés nem található' }, { status: 404 });
        if (entry.meal.userId !== session.user.id) {
            return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 403 });
        }

        const [updated] = await db
            .update(mealEntries)
            .set({ amountG: String(amountG) })
            .where(eq(mealEntries.id, params.id))
            .returning();

        return NextResponse.json(updated);
    } catch (error) {
        console.error('MealEntry PUT hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}

// DELETE /api/meals/entries/[id] — bejegyzés törlése
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const entry = await db.query.mealEntries.findFirst({
            where: eq(mealEntries.id, params.id),
            with: { meal: true },
        });

        if (!entry) return NextResponse.json({ error: 'Bejegyzés nem található' }, { status: 404 });
        if (entry.meal.userId !== session.user.id) {
            return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 403 });
        }

        await db.delete(mealEntries).where(eq(mealEntries.id, params.id));

        return NextResponse.json({ message: 'Sikeresen törölve' });
    } catch (error) {
        console.error('MealEntry DELETE hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}