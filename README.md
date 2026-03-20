# KajApp — Táplálkozás Követő

Személyes táplálkozás követő webalkalmazás, amely lehetővé teszi az étkezések naplózását, receptek kezelését és a napi kalória- valamint makrotápanyag-bevitel nyomon követését.

## Technológiai stack

- **Next.js 15** — App Router, szerver és kliens komponensek
- **TypeScript** — típusbiztos fejlesztés
- **MUI (Material UI v6)** — UI komponens könyvtár
- **Drizzle ORM** — adatbázis séma és lekérdezések
- **Neon** — PostgreSQL adatbázis (serverless)
- **NextAuth v4** — autentikáció
- **SWR** — adatbetöltés és cache
- **OpenFoodFacts API** — élelmiszer adatbázis

## Funkciók

- Regisztráció és bejelentkezés
- Napi étkezési napló (reggeli, ebéd, vacsora, snack)
- Élelmiszer keresés az OpenFoodFacts adatbázisban
- Saját élelmiszer adatbázis
- Receptek létrehozása, szerkesztése, törlése
- Makrotápanyag kalkulátor a profil oldalon
- Kalória és makró összesítők

---

## Lokális futtatás

### Előfeltételek

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- Neon adatbázis fiók ([neon.tech](https://neon.tech))

### 1. Klónozás

```bash
git clone <repo-url>
cd kajasapp
```

### 2. Függőségek telepítése

```bash
pnpm install
```

### 3. Környezeti változók beállítása

Hozz létre egy `.env.local` fájlt a projekt gyökerében:

```env
# Neon PostgreSQL
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require

# NextAuth
NEXTAUTH_SECRET=valamilyen-titkos-kulcs
NEXTAUTH_URL=http://localhost:3000

# OpenFoodFacts (opcionális, alapértelmezett: https://world.openfoodfacts.net)
OPENFOODFACTS_URL=https://world.openfoodfacts.net
```

A `NEXTAUTH_SECRET` generálásához:
```bash
openssl rand -base64 32
```

### 4. Adatbázis migráció

```bash
pnpm db:generate
pnpm db:migrate
```

### 5. Fejlesztői szerver indítása

```bash
pnpm dev
```

Az alkalmazás elérhető: [http://localhost:3000](http://localhost:3000)

---

## Elérhető parancsok

| Parancs | Leírás |
|---------|--------|
| `pnpm dev` | Fejlesztői szerver indítása |
| `pnpm build` | Produkciós build |
| `pnpm start` | Produkciós szerver indítása |
| `pnpm lint` | ESLint futtatása |
| `pnpm test` | Unit tesztek futtatása |
| `pnpm db:generate` | Drizzle migrációs fájlok generálása |
| `pnpm db:migrate` | Adatbázis migráció futtatása |
| `pnpm db:studio` | Drizzle Studio megnyitása |

---

## Projekt struktúra

```
kajasapp/
├── app/
│   ├── (app)/          # Védett oldalak (bejelentkezés szükséges)
│   │   ├── dashboard/
│   │   ├── log/[date]/
│   │   ├── foods/
│   │   ├── recipes/
│   │   └── profile/
│   ├── (auth)/         # Autentikációs oldalak
│   │   ├── login/
│   │   └── register/
│   └── api/            # API route-ok
├── components/         # React komponensek
├── db/                 # Drizzle séma és konfiguráció
├── lib/                # Utility függvények, hooks
└── docs/               # Dokumentáció
```

---

## Tesztek futtatása

```bash
# Unit tesztek
pnpm test

# Watch módban
pnpm test:watch
```

## Deploy

Publikus URL: https://kajas-app.vercel.app/

Az alkalmazás Vercelen van deployolva. A `main` branch-re pusholt változások automatikusan deployolódnak.

### Production környezeti változók

A működéshez szükséges környezeti változók Vercel Project Settings alatt vannak beállítva.

Kötelező változók:
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

További (Neon által biztosított) változók:
- `PGDATABASE`
- `PGPASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_URL_NO_SSL`
- `DATABASE_URL_UNPOOLED`
- `POSTGRES_USER`
- `PGHOST_UNPOOLED`
- `POSTGRES_PRISMA_URL`

Opcionális:
- `OPENFOODFACTS_URL`

### Production ellenorzes

Lokalisan ellenorizheto, hogy a production build sikeres:

```bash
pnpm install
pnpm build
pnpm start
```

Build + runtime ellenorzes utan az alkalmazas elerheto a publikus URL-en is.

## Biztonsagi modell (szerver oldalon)

Ez a projekt nem Firestore/Supabase Rules alapu rendszert hasznal, hanem sajat Next.js API + PostgreSQL architekturat.

- Route vedelmek: `middleware.ts` (`withAuth`) csak bejelentkezett felhasznalot enged a vedett oldalakra.
- API hitelesites: minden vedett API route `getServerSession(authOptions)` ellenorzessel indul.
- Szerepkor ellenorzes: admin endpointok `session.user.role === 'admin'` feltetelt hasznalnak.
- Tulajdonosi ellenorzes: user-specifikus eroforrasok `session.user.id` alapjan szurve vannak.
- Input validacio: API szinten Zod schema validacio (`safeParse`) fut.

Peldak:
- `middleware.ts`
- `app/api/foods/route.ts`
- `app/api/foods/[id]/route.ts`
- `app/api/meals/route.ts`
- `app/api/recipes/route.ts`