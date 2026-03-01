import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { db } from '@/db';
import { users, userProfiles } from '@/db/schema';

const registerSchema = z.object({
    name: z.string().min(1, 'A név kötelező'),
    email: z.string().email('Érvénytelen e-mail cím'),
    password: z.string().min(8, 'A jelszó legalább 8 karakter legyen'),
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Szerver oldali validáció
        const parsed = registerSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { error: parsed.error.issues[0].message },
                { status: 400 }
            );
        }

        const { name, email, password } = parsed.data;

        // Ellenőrzés: létezik-e már ez az email
        const existing = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Ez az e-mail cím már foglalt' },
                { status: 409 }
            );
        }

        // Jelszó hash-elés
        const passwordHash = await bcrypt.hash(password, 12);

        // Felhasználó létrehozása
        const [newUser] = await db.insert(users).values({
            name,
            email,
            passwordHash,
            role: 'user',
        }).returning();

        // Alap profil létrehozása
        await db.insert(userProfiles).values({
            userId: newUser.id,
        });

        return NextResponse.json(
            { message: 'Sikeres regisztráció' },
            { status: 201 }
        );

    } catch (error) {
        console.error('Regisztrációs hiba:', error);
        return NextResponse.json(
            { error: 'Szerver hiba, próbáld újra később' },
            { status: 500 }
        );
    }
}