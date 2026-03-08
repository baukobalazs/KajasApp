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

## 2. mérföldkő — Backend és adatok

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

**Döntés: Elfogadva ✅**  
A `drizzle-kit` nem olvassa automatikusan a `.env.local` fájlt. Az AI javasolta a `dotenv-cli` telepítését és a package.json scripts módosítását:
```json
"db:migrate": "dotenv -e .env.local -- drizzle-kit migrate"
```

Ez megoldotta a problémát. Az AI helyesen diagnosztizálta a hibát és működő megoldást adott.

**Tanulság:** A `.env.local` Next.js-specifikus — más eszközök (drizzle-kit) nem olvassák automatikusan. Ezt érdemes tudni hasonló projekteknél.

---

### #7 — Zod v4 breaking change

**Fázis:** Implementáció (register API route)  
**Prompt (összefoglalva):** Zod validáció a regisztrációs API route-ban.

**AI válasz összefoglalva:**  
Az AI a következő szintaxist generálta:
```ts
parsed.error.errors[0].message
```

**Hiba:** Runtime error — `errors` property nem létezik.

**Döntés: Módosítva ✏️**  
Zod v4-ben az `errors` property neve `issues`-re változott. Helyes szintaxis:
```ts
parsed.error.issues[0].message
```

**Tanulság:** Az AI Zod v3 szintaxist generált, a v4 breaking change-t nem ismerte.

---

### #8 — Next.js 15 params Promise wrapper

**Fázis:** Implementáció (API routes)  
**Prompt (összefoglalva):** Dinamikus API route-ok `[id]` paraméterrel.

**AI válasz összefoglalva:**  
Az AI közvetlen destructuringot generált:
```ts
{ params }: { params: { id: string } }
```

**Hiba:** TypeScript error — params nem destructurálható közvetlenül.

**Döntés: Módosítva ✏️**  
Next.js 15-ben a params Promise-ba van csomagolva:
```ts
{ params }: { params: Promise<{ id: string }> }
const { id } = await params;
```

**Tanulság:** Az AI Next.js 14 szintaxist generált, a v15 breaking change-t nem ismerte.

---

### #9 — MUI component={Link} prerender hiba Vercelen

**Fázis:** Deploy  
**Prompt (összefoglalva):** Vercel deploy futtatása.

**Hiba:**
```
Functions cannot be passed directly to Client Components
```

**Döntés: Módosítva ✏️**  
Két lépéses megoldás:
- `export const dynamic = 'force-dynamic'` hozzáadva az `(app)/layout.tsx` és `(auth)/layout.tsx` fájlokhoz
- `component={Link}` prop helyett `<Link><Button>` wrapper használata

**Tanulság:** Az AI nem jelezte előre a szerver/kliens határon átmenő Next.js prerender problémát.

---

### #10 — OpenFoodFacts API URL

**Fázis:** Implementáció (élelmiszer keresés)  
**Prompt (összefoglalva):** OpenFoodFacts API integráció élelmiszer kereséshez.

**AI válasz összefoglalva:**  
Az AI a `.org` domain-t ajánlotta az API dokumentáció alapján.

**Döntés: Módosítva ✏️**  
Saját tesztelés alapján a `.net` domain gyorsabban válaszol. Mindkét környezetben (dev + prod) a `.net` változat lett használva.

**Tanulság:** Az AI a hivatalos dokumentációt követte, de a gyakorlati teljesítményt csak saját teszteléssel lehetett megállapítani.

---

## 3. mérföldkő — Biztonság és tesztelés

---

### #11 — React 19 + MUI + Jest inkompatibilitás

**Fázis:** Tesztelés  
**Prompt (összefoglalva):** Komponens unit tesztek írása React Testing Library-vel.

**AI válasz összefoglalva:**  
Az AI MUI komponenseket közvetlenül tesztelt RTL `render()`-rel, ThemeProvider wrapperrel.

**Hiba:** MUI komponensek nem renderelnek semmit tesztben — a DOM `<body><div /></body>` marad, `act()` wrapperrel sem javul.

**Döntés: Elutasítva, logika tesztekre váltva ❌**  
Komponens tesztek helyett tiszta logika teszteket írtunk: `calcMacros`, kalória számítás, makró validáció. Ezek MUI-tól függetlenek és stabilan futnak.

**Tanulság:** React 19 + MUI + Jest kombináció jelenleg nem támogatott. Az AI nem jelezte előre ezt az inkompatibilitást.

---

### #12 — Jest konfigurációs kulcsnév: setupFilesAfterEnv

**Fázis:** Tesztelés  
**Prompt (összefoglalva):** Jest konfiguráció beállítása TypeScript projektben.

**AI válasz összefoglalva:**  
Az AI háromszor egymás után rossz kulcsnevet írt a jest.config.ts-be:
- `setupFilesAfterFramework` (1. próba)
- `setupFilesAfterEach` (2. próba)
- `setupFilesAfterEnv` (3. próba — helyes)

**Döntés: Módosítva ✏️**  
A helyes kulcsnevet (`setupFilesAfterEnv`) a TypeScript compiler adta meg, nem az AI.

**Tanulság:** Konfigurációs kulcsneveknél érdemes a TypeScript compiler autocomplete-jére támaszkodni, nem csak az AI javaslatára.

---

### #13 — calcMacros teszt számítási hiba

**Fázis:** Tesztelés  
**Prompt (összefoglalva):** Unit teszt írása a calcMacros függvényhez.

**AI válasz összefoglalva:**  
Az AI a következő tesztértéket generálta:
```ts
expect(kcalFromMacros(150, 225, 56)).toBe(2104);
```

**Hiba:** A teszt elbukott — a helyes érték 2004, nem 2104.  
Számítás: `150×4 + 225×4 + 56×9 = 600 + 900 + 504 = 2004`

**Döntés: Módosítva ✏️**  
Az elvárt értéket 2004-re javítottam. A hibát maga a tesztfuttatás fedte fel.

**Tanulság:** Az AI egyszerű aritmetikai hibát vétett. A tesztek önmaguk is tesztelik az AI által generált értékek helyességét — ez a TDD egyik értéke.

---

### #14 — Hydration hiba: `<p>` nem tartalmazhat `<div>`-t

**Fázis:** Implementáció (FoodSearchDialog)  
**Prompt (összefoglalva):** FoodSearchDialog hydration hiba javítása.

**AI válasz összefoglalva:**  
Az AI `ListItemText` `secondary` prop-ba `<Box>` + `<Chip>` elemeket rakott, amelyek `<div>`-ként renderelnek.

**Hiba:**
```
In HTML, <div> cannot be a descendant of <p>.
```

**Döntés: Módosítva ✏️**  
A `ListItemText`-hez hozzáadva `secondaryTypographyProps={{ component: 'span' }}`, és a `<Box>`-ra `component="span"` — így minden `<span>`-ba kerül, nem `<p>`-be.

**Tanulság:** Az AI nem vette figyelembe hogy az MUI `ListItemText` secondary prop-ja alapértelmezetten `<p>` tagbe renderel. HTML szabály: `<p>` nem tartalmazhat block-level elemet.

---

### #15 — React event bubbling: RecipeCard kártya + Link gomb

**Fázis:** Implementáció (RecipeCard)  
**Prompt (összefoglalva):** Kártyára kattintáskor navigálás, szerkesztés gombra kattintáskor szerkesztő oldal.

**AI válasz összefoglalva:**  
Az AI a kártyára `onClick` router.push-t rakott, a szerkesztés gombra `<Link>`-et — de nem jelezte hogy a kattintás bubblingolni fog.

**Hiba:** Szerkesztés gombra kattintva mindkét handler elsült — a Link navigált, majd a Card onClick is.

**Döntés: Módosítva ✏️**  
A `<Link>`-re hozzáadva `onClick={(e) => e.stopPropagation()}`.

**Tanulság:** Az AI nem figyelmeztetett az event bubbling problémára nested kattintható elemeknél. Mindig `stopPropagation()` kell ha kattintható elemen belül van másik kattintható elem.

---

### #16 — Recept gramm kalkuláció hibás

**Fázis:** Implementáció (AddRecipeToMealDialog)  
**Prompt (összefoglalva):** Recept hozzáadása étkezéshez gramm módban.

**AI válasz összefoglalva:**  
Az AI a következő kalkulációt generálta:
```ts
Math.round(recipe.totalCalories * grams / 100)
```

**Hiba:** 400g összsúlyú recept (1000 kcal) esetén 100g-ra 1000 kcal-t számolt — nyilván helytelen.

**Döntés: Módosítva ✏️**  
A helyes kalkuláció `totalWeight` alapján:
```ts
Math.round(recipe.totalCalories * grams / recipe.totalWeight)
```
A `totalWeight`-et az összes hozzávaló grammsúlyának összegeként kell kiszámolni.

**Tanulság:** Az AI a `/100` konvenciót alkalmazta (mint az ételek esetén), de recepteknél a referencia az összsúly, nem 100g.

---

### #17 — Playwright e2e label eltérések

**Fázis:** Tesztelés (e2e)  
**Prompt (összefoglalva):** E2e teszt írása étel hozzáadásához.

**AI válasz összefoglalva:**  
Az AI a következő selectorokat generálta:
```ts
page.getByLabel('Email')
page.getByLabel('Mennyiség grammban')
```

**Hiba:** Mindkét selector timeout-olt — a label szövegek nem egyeztek a tényleges UI-val.

**Döntés: Módosítva ✏️**  
- `getByLabel('Email')` → `getByLabel('E-mail cím')` (a TextField label szövege)
- `getByLabel('Mennyiség grammban')` → `getByRole('spinbutton')` (type="number" input Playwright-ban spinbutton role-t kap)

**Tanulság:** Az AI nem ismerte a pontos label szövegeket. E2e teszteknél mindig ellenőrizni kell a tényleges DOM-ot, nem az AI által feltételezett selector neveket.

---

## Összefoglalás

| # | Mérföldkő | Téma | Döntés | AI hibázott? |
|---|-----------|------|--------|--------------|
| 1 | M1 | Stack döntés | Módosítva — Next.js + Neon választva Firebase helyett | Nem hibázott, de nem ismerte a kontextust |
| 2 | M1 | Adatmodell | Bővítve — Recipe entitás hozzáadva | Nem hibázott, minimális megoldást adott |
| 3 | M1 | Docs struktúra | Elutasítva — 3 külön fájl kellett 1 helyett | Igen — nem tudott a követelményről |
| 4 | M1 | MUI Grid v7 | Módosítva — új size prop szintaxis | Igen — elavult API-t használt |
| 5 | M1 | TypeScript alias | Módosítva — tsconfig javítás szükséges volt | Igen — feltételezte a konfigurációt |
| 6 | M2 | Drizzle migrate | Elfogadva — dotenv-cli megoldás működött | Nem hibázott |
| 7 | M2 | Zod v4 breaking change | Módosítva — errors → issues | Igen — elavult szintaxist használt |
| 8 | M2 | Next.js 15 params | Módosítva — Promise wrapper szükséges | Igen — v14 szintaxist generált |
| 9 | M2 | Vercel prerender hiba | Módosítva — force-dynamic + Link wrapper | Igen — nem jelezte előre |
| 10 | M2 | OpenFoodFacts URL | Módosítva — .net gyorsabb mint .org | Nem hibázott, docs-t követte |
| 11 | M3 | React 19 + MUI + Jest | Elutasítva — logika tesztekre váltva | Igen — inkompatibilitást nem jelezte |
| 12 | M3 | setupFilesAfterEnv | Módosítva — háromszor rossz kulcsnév | Igen — konfigurációs hiba |
| 13 | M3 | calcMacros teszt érték | Módosítva — 2104 → 2004 | Igen — számítási hiba |
| 14 | M3 | Hydration: p > div tiltott | Módosítva — component="span" + secondaryTypographyProps | Igen — HTML szabályt nem vette figyelembe |
| 15 | M3 | Event bubbling RecipeCard | Módosítva — stopPropagation hozzáadva | Igen — nem jelezte előre |
| 16 | M3 | Recept gramm kalkuláció | Módosítva — totalWeight alapú számítás | Igen — rossz referencia értéket használt |
| 17 | M3 | Playwright label eltérések | Módosítva — spinbutton role + helyes label | Igen — nem ismerte a tényleges UI szövegeket |