import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/db';
import { userProfiles } from '@/db/schema';
import { authOptions } from '@/lib/auth';

const profileSchema = z.object({
    heightCm: z.number().min(100).max(250).optional(),
    weightKg: z.number().min(30).max(300).optional(),
    age: z.number().min(10).max(120).optional(),
    goal: z.enum(['loss', 'maintain', 'gain']).optional(),
    dailyCalorieGoal: z.number().min(500).max(10000).optional(),
    proteinGoalG: z.number().min(0).optional(),
    carbGoalG: z.number().min(0).optional(),
    fatGoalG: z.number().min(0).optional(),
});

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const profile = await db.query.userProfiles.findFirst({
            where: eq(userProfiles.userId, session.user.id),
        });

        return NextResponse.json(profile || null);
    } catch (error) {
        console.error('Profile GET hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: 'Nincs jogosultság' }, { status: 401 });

        const body = await req.json();
        const parsed = profileSchema.safeParse(body);
        if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });

        const [updated] = await db
            .update(userProfiles)
            .set({
                ...parsed.data,
                weightKg: parsed.data.weightKg ? String(parsed.data.weightKg) : undefined,
                updatedAt: new Date(),
            })
            .where(eq(userProfiles.userId, session.user.id))
            .returning();

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Profile PUT hiba:', error);
        return NextResponse.json({ error: 'Szerver hiba' }, { status: 500 });
    }
}
