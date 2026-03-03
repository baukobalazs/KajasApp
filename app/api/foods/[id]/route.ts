import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { foods } from '@/db/schema';
import { authOptions } from '@/lib/auth';

const updateFoodSchema = z.object({
    name: z.string().min(1).optional(),
    caloriesPer100g: z.number().positive().optional(),
    proteinPer100g: z.number().min(0).optional(),
    carbsPer100g: z.number().min(0).optional(),
    fatPer100g: z.number().min(0).optional(),
});

// PUT /api/foods/[id] — élelmiszer szerkesztése (csak admin)
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });
        if (session.user.role !== 'admin') return NextResponse.json({ error: 'Csak admin szerkeszthet' }, { status: 403 });

        const body = await req.json();
        const parsed = updateFoodSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
        }

        const updateData: Record<string, string> = {};
        if (parsed.data.name) updateData.name = parsed.data.name;
        if (parsed.data.caloriesPer100g) updateData.caloriesPer100g = String(parsed.data.caloriesPer100g);
        if (parsed.data.proteinPer100g) updateData.proteinPer100g = String(parsed.data.proteinPer100g);
        if (parsed.data.carbsPer100g) updateData.carbsPer100g = String(parsed.data.carbsPer100g);
        if (parsed.data.fatPer100g) updateData.fatPer100g = String(parsed.data.fatPer100g);

        const [updated] = await db
            .update(foods)
            .set(updateData)
            .where(eq(foods.id, id))
            .returning();

        if (!updated) return NextResponse.json({ error: 'Élelmiszer nem található' }, { status: 404 });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Foods PUT hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}

// DELETE /api/foods/[id] — élelmiszer törlése (csak admin)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });
        if (session.user.role !== 'admin') return NextResponse.json({ error: 'Csak admin törölhet' }, { status: 403 });

        const [deleted] = await db
            .delete(foods)
            .where(eq(foods.id, id))
            .returning();

        if (!deleted) return NextResponse.json({ error: 'Élelmiszer nem található' }, { status: 404 });

        return NextResponse.json({ message: 'Sikeresen törölve' });
    } catch (error) {
        console.error('Foods DELETE hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}