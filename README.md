# KajApp — Táplálkozás Követő

Személyes táplálkozás követő webalkalmazás, amely lehetővé teszi az étkezések naplózását, receptek kezelését és a napi kalória- valamint makrotápanyag-bevitel nyomon követését.

## Technológiai stack

- **Next.js 15** — App Router, szerver és kliens komponensek
- **TypeScript** — típusbiztos fejlesztés
- **MUI (Material UI v7)** — UI komponens könyvtár
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

Az alkalmazás Vercelen van deployolva. A `main` branch-re pusholt változások automatikusan deployolódnak.