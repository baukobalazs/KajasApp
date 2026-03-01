# AI_PROMPT_LOG.md
# KajApp — AI-asszisztált fejlesztés napló

Ez a fájl dokumentálja a projekt fejlesztése során használt jelentősebb AI promptokat,
az AI válaszait, és a saját döntéseimet az elfogadás/módosítás/elutasítás kapcsán.

---

## 1. mérföldkő — Specifikáció, UI és megjelenés

---

### #1 — Projekt tervezés, stack döntés

**Fázis:** Tervezés  
**Prompt (összefoglalva):** Táplálkozás követő alkalmazást szeretnék készíteni. Milyen stack-et javasolsz? Milyen entitások kellenek?

**AI válasz összefoglalva:**
Az AI először Firebase + React kombinációt javasolt, majd Angular + REST API alternatívát mutatott be. Részletesen elmagyarázta a különbségeket: Firebase NoSQL alapú, beépített auth és hosting, de komplex lekérdezések nehézkesek. Angular strukturált, TypeScript-first, de meredekebb tanulási görbe. A Next.js + Neon kombinációt csak akkor javasolta, amikor megemlítettem hogy azt már ismerem munkából.

**Döntés: Módosítva ✏️**  
Az AI eredeti javaslata Firebase volt, én azonban a Next.js + Neon + Drizzle kombinációt választottam, mivel:
- A Next.js-t már használtam munkahelyi projektben, magabiztos vagyok benne
- SQL alapú gondolkodás közelebb áll hozzám (C# backend tapasztalat)
- A Vercel + Neon integráció egyszerűbb deploy-t tesz lehetővé
- Nem érdemes feleslegesen új technológiát tanulni ha a minőség a cél

**Tanulság:** Az AI általános javaslatokat ad, de a saját tapasztalatot és a projekt kontextusát figyelembe kell venni a stack döntésnél.

---

### #2 — Adatmodell tervezés

**Fázis:** Tervezés  
**Prompt (összefoglalva):** Milyen entitások kellenek a táplálkozás követőhöz? Legalább 5 kell a követelmények szerint.

**AI válasz összefoglalva:**
Az AI 5 entitást javasolt: User, UserProfile, Food, Meal, MealEntry. A DailyLog entitást nem javasolta külön táblába menteni, hanem lekérdezéssel számolni. Recepteket opcionálisan ajánlotta 6. entitásként.

**Döntés: Elfogadva + bővítve ✅**  
Az 5 alap entitást elfogadtam, és hozzáadtam a Recipe + RecipeIngredients entitásokat is, mert:
- Biztonságosabb ha több mint 5 entitás van (az értékelő esetleg a User+UserProfile-t 1-nek számolhatja)
- A recept funkció valódi értéket ad az alkalmazásnak
- Jól mutatja az N:M kapcsolat kezelését (recipes ↔ foods)

**Tanulság:** Az AI minimális megoldást javasolt, én tudatosan bővítettem a biztonság és a funkcionalitás érdekében.

---

### #3 — Dokumentációs fájlok struktúrája

**Fázis:** Dokumentáció  
**Prompt (összefoglalva):** Csináljunk specifikációs dokumentumot.

**AI válasz összefoglalva:**
Az AI egyetlen nagy SPECIFICATION.md fájlt generált, amely mindent tartalmazott (adatmodell, komponensek, spec egyben).

**Döntés: Elutasítva, újragenerálva ❌**  
Amikor megkaptam az értékelési szempontrendszert, észrevettem hogy az automatikus értékelő külön fájlokat keres:
- `docs/SPECIFICATION.md`
- `docs/DATAMODEL.md`
- `docs/COMPONENTS.md`

Az AI nem tudott erről a követelményről (nem volt benne a promptban), ezért az egyetlen fájlos megoldást elutasítottam és három külön fájlt generáltattam. Ez egy jó példa arra, hogy az AI csak azt tudja amit megadsz neki — a projekt-specifikus követelményeket mindig magadnak kell ellenőrizni.

**Tanulság:** Az AI kimenetet mindig a konkrét követelmények alapján kell ellenőrizni, nem elég ha "nagyjából jó".

---

### #4 — MUI Grid v7 inkompatibilitás

**Fázis:** Implementáció (Dashboard oldal)  
**Prompt (összefoglalva):** Csináld meg a Dashboard oldalt MUI komponensekkel.

**AI válasz összefoglalva:**
Az AI MUI v5/v6-os Grid szintaxist generált:
```tsx
<Grid container spacing={3}>
  <Grid item xs={12} sm={4}>
```

**Hiba:**
```
Property 'item' does not exist on type...
No overload matches this call.
```

**Döntés: Módosítva ✏️**  
Észrevettem hogy az MUI v7-ben a Grid API megváltozott — az `item` és `container` prop-ok eltűntek, helyette a `size` prop jött be. Az AI v5/v6-os tudással dolgozott, de a projektben v7 van telepítve.

A helyes szintaxis:
```tsx
<Grid container spacing={3}>
  <Grid size={{ xs: 12, sm: 4 }}>
```

Az összes Grid komponenst manuálisan javítottam az új szintaxisra.

**Tanulság:** Az AI tudása nem mindig naprakész a legújabb könyvtár verziókkal. Mindig ellenőrizni kell a generált kódot a használt verziók dokumentációjával.

---

### #5 — TypeScript path alias (@/) nem működött

**Fázis:** Implementáció (layout komponensek bekötése)  
**Prompt (összefoglalva):** Kösd be az AppLayout komponenst az (app)/layout.tsx-be.

**AI válasz összefoglalva:**
Az AI `@/` path alias-t használt az importban:
```tsx
import AppLayout from '@/components/layout/AppLayout';
```

**Hiba:** A VS Code és a Next.js nem ismerte fel az aliast, modul nem található hibát adott.

**Döntés: Módosítva ✏️**  
Relatív importra váltottam ami azonnal működött:
```tsx
import AppLayout from '../components/layout/AppLayout';
```

Utána megvizsgáltam a `tsconfig.json`-t és hozzáadtam a hiányzó paths konfigurációt:
```json
"paths": { "@/*": ["./*"] }
```

Ezután az `@/` alias is működni kezdett.

**Tanulság:** Az AI feltételezte hogy a `create-next-app` automatikusan beállítja az aliast, de a telepítéskor "No"-t választottam az import alias kérdésnél. Az AI nem vette figyelembe ezt a lehetséges eltérést.

---

### #6 — Drizzle migrate DATABASE_URL hiba

**Fázis:** Adatbázis beállítás  
**Prompt (összefoglalva):** Futtassuk a Drizzle migrációt a Neon adatbázisra.

**AI válasz összefoglalva:**
Az AI a következő parancsokat javasolta:
```bash
pnpm db:generate
pnpm db:migrate
```

**Hiba:**
```
Error: Please provide required params for Postgres driver:
  [x] url: undefined
```

**Döntés: AI megoldása elfogadva ✅**  
A `drizzle-kit` nem olvassa automatikusan a `.env.local` fájlt. Az AI javasolta a `dotenv-cli` telepítését és a package.json scripts módosítását:
```json
"db:migrate": "dotenv -e .env.local -- drizzle-kit migrate"
```

Ez megoldotta a problémát. Az AI helyesen diagnosztizálta a hibát és működő megoldást adott.

**Tanulság:** A `.env.local` Next.js-specifikus — más eszközök (drizzle-kit) nem olvassák automatikusan. Ezt érdemes tudni hasonló projekteknél.

---

## 2. mérföldkő — Backend és adatok

*[Ide kerülnek a 2. mérföldkő fejlesztése során keletkező promptok és döntések]*

---

## 3. mérföldkő — Biztonság és tesztelés

*[Ide kerülnek a 3. mérföldkő fejlesztése során keletkező promptok és döntések]*

---

## Összefoglalás (1. mérföldkő végén)

| # | Téma | Döntés | AI hibázott? |
|---|------|--------|--------------|
| 1 | Stack döntés | Módosítva — Next.js + Neon választva Firebase helyett | Nem hibázott, de nem ismerte a kontextust |
| 2 | Adatmodell | Bővítve — Recipe entitás hozzáadva | Nem hibázott, minimális megoldást adott |
| 3 | Docs struktúra | Elutasítva — 3 külön fájl kellett 1 helyett | Igen — nem tudott a követelményről |
| 4 | MUI Grid v7 | Módosítva — új size prop szintaxis | Igen — elavult API-t használt |
| 5 | TypeScript alias | Módosítva — tsconfig javítás szükséges volt | Igen — feltételezte a konfigurációt |
| 6 | Drizzle migrate | Elfogadva — dotenv-cli megoldás működött | Nem hibázott |
