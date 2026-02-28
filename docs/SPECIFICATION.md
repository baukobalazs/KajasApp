# SPECIFICATION.md

## Projekt leírás

A **KajasApp** egy táplálkozás követő webalkalmazás, amely segít a felhasználóknak nyomon követni napi kalória- és makrotápanyag-bevitelüket. Az alkalmazás célja, hogy egyszerű, átlátható felületen lehessen naplózni az étkezéseket, kezelni a személyes táplálkozási célokat, és recepteket összeállítani.

**Kinek szól:** Bárki számára, aki tudatosan szeretné követni táplálkozását — legyen szó fogyásról, izomépítésről vagy egészséges életmód fenntartásáról.

---

## Funkcionális követelmények

### Autentikáció és profil
- Regisztráció e-mail és jelszó alapon
- Bejelentkezés és kijelentkezés
- Felhasználói profil szerkesztése (név, magasság, testsúly, kor)
- Napi kalória- és makrócélok (fehérje, szénhidrát, zsír) beállítása
- Táplálkozási cél kiválasztása (fogyás / fenntartás / tömegnövelés)

### Napi napló
- Napi étkezések naplózása (reggeli, ebéd, vacsora, snack)
- Étel hozzáadása étkezéshez gramm megadásával
- Étel eltávolítása étkezésből
- Gramm mennyiség szerkesztése
- Napi napló megtekintése dátum szerint

### Élelmiszer keresés
- Étel keresése az OpenFoodFacts külső API-ban
- Keresési eredmény megjelenítése (kalória, makrók)
- Kiválasztott étel mentése a saját adatbázisba

### Receptek
- Saját recept létrehozása hozzávalókkal
- Recept szerkesztése és törlése
- Recept hozzáadása étkezéshez

### Dashboard
- Napi kalóriabevitel összesítése és célhoz viszonyítása
- Makrotápanyag arányok vizualizálása (diagram)
- Napi étkezések áttekintése

### Admin funkciók
- Élelmiszer rekordok kezelése (létrehozás, szerkesztés, törlés)
- Felhasználók listázása

### Keresés, szűrés, rendezés
- Élelmiszer listán keresés név alapján
- Szűrés kalóriatartalom szerint
- Rendezés név és kalória szerint

---

## Nem-funkcionális követelmények

### Technológiai döntések
| Réteg | Technológia | Indoklás |
|-------|-------------|----------|
| Frontend + Backend | Next.js 14 (App Router) | Full-stack React framework, szerver komponensek, API routes egy helyen |
| Adatbázis | Neon (Serverless PostgreSQL) | Skálázható, Vercel-lel natívan integrálódik, SQL alapú |
| ORM | Drizzle ORM | Típusbiztos, lightweight, jól illeszkedik Next.js-hez |
| UI könyvtár | MUI Material | Beépített akadálymentesség, reszponzív komponensek, theme rendszer |
| Autentikáció | NextAuth.js | Next.js-hez készült, egyszerű integráció, session kezelés |
| Validáció | Zod + React Hook Form | Kliens és szerver oldali validáció megosztott sémával |
| Deploy | Vercel | Next.js natív platformja, egyszerű CI/CD |
| Tesztelés | Jest + React Testing Library + Playwright | Unit és E2E tesztek |

### Teljesítmény- és UX-elvárások
- Oldalbetöltési idő: első tartalmas megjelenés (FCP) alatt 2 másodperc
- Skeleton loading minden aszinkron adatbetöltésnél
- Felhasználóbarát hibaüzenetek toast/snackbar formában
- Üres állapot illusztrációval ahol releváns
- Mobile-first, reszponzív elrendezés legalább 3 breakpointon

---

## Felhasználói szerepkörök

### Normál felhasználó (`user`)
- Regisztrálhat és bejelentkezhet
- Saját napi naplót vezet
- Ételeket kereshet és naplózhat
- Saját recepteket hozhat létre, szerkeszthet és törölhet
- Dashboardon megtekintheti a napi összesítőt
- Profilt és célokat szerkeszthet

### Admin (`admin`)
- Mindent megtehet amit a normál felhasználó
- Az élelmiszer adatbázist kezeli (hozzáad, szerkeszt, töröl)
- Felhasználókat listázhat

---

## Képernyő-lista / Sitemap

```
/                          → Főoldal / Landing (publikus)
/auth/login                → Bejelentkezés (publikus)
/auth/register             → Regisztráció (publikus)

/dashboard                 → Napi összesítő dashboard (védett)
/log                       → Mai napló (védett, átirányít /log/[ma dátuma])
/log/[date]                → Napi étkezési napló adott dátumra (védett)
/foods                     → Élelmiszer keresés és lista (védett)
/recipes                   → Receptek listája (védett)
/recipes/new               → Új recept létrehozása (védett)
/recipes/[id]              → Recept részletei és szerkesztése (védett)
/profile                   → Profil és célok szerkesztése (védett)
/admin/foods               → Admin: élelmiszer adatbázis kezelése (csak admin)

/404                       → Nem található oldal
```

### Navigáció
- Bejelentkezett felhasználóknak: felső navbar (desktop) / alsó tab bar (mobil)
- Publikus oldalakról automatikus átirányítás a dashboardra bejelentkezés után
- Védett oldalakról átirányítás a login oldalra, ha nincs aktív session
