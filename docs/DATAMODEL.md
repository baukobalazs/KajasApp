# DATAMODEL.md

## Entitások

### 1. users
A regisztrált felhasználókat tárolja. A NextAuth.js által kezelt alaptábla, kiegészítve role mezővel.

| Mező | Típus | Leírás |
|------|-------|--------|
| id | UUID (PK) | Egyedi azonosító |
| email | TEXT, UNIQUE, NOT NULL | Bejelentkezési e-mail cím |
| name | TEXT | Megjelenített név |
| password_hash | TEXT | Bcrypt-tel hash-elt jelszó |
| role | TEXT, DEFAULT 'user' | Szerepkör: `'user'` vagy `'admin'` |
| created_at | TIMESTAMP | Regisztráció időpontja |

---

### 2. user_profiles
A felhasználó személyes adatait és táplálkozási céljait tárolja. 1:1 kapcsolatban áll a users táblával.

| Mező | Típus | Leírás |
|------|-------|--------|
| id | UUID (PK) | Egyedi azonosító |
| user_id | UUID (FK → users.id) | Melyik felhasználóhoz tartozik |
| height_cm | INTEGER | Magasság centiméterben |
| weight_kg | DECIMAL | Testsúly kilogrammban |
| age | INTEGER | Kor |
| goal | TEXT | Cél: `'loss'`, `'maintain'`, `'gain'` |
| daily_calorie_goal | INTEGER | Napi kalóriacél (kcal) |
| protein_goal_g | INTEGER | Napi fehérjecél (gramm) |
| carb_goal_g | INTEGER | Napi szénhidrátcél (gramm) |
| fat_goal_g | INTEGER | Napi zsírcél (gramm) |
| updated_at | TIMESTAMP | Utolsó módosítás időpontja |

---

### 3. foods
Az élelmiszer adatbázis. Feltölthető az OpenFoodFacts API-ból (automatikus mentés) vagy admin által manuálisan.

| Mező | Típus | Leírás |
|------|-------|--------|
| id | UUID (PK) | Egyedi azonosító |
| openfoodfacts_id | TEXT, UNIQUE, NULLABLE | OpenFoodFacts azonosító (null ha manuálisan adták hozzá) |
| name | TEXT, NOT NULL | Élelmiszer neve |
| calories_per_100g | DECIMAL, NOT NULL | Kalória 100 grammra (kcal) |
| protein_per_100g | DECIMAL | Fehérje 100 grammra (g) |
| carbs_per_100g | DECIMAL | Szénhidrát 100 grammra (g) |
| fat_per_100g | DECIMAL | Zsír 100 grammra (g) |
| created_at | TIMESTAMP | Hozzáadás időpontja |

---

### 4. recipes
A felhasználók által létrehozott saját receptek.

| Mező | Típus | Leírás |
|------|-------|--------|
| id | UUID (PK) | Egyedi azonosító |
| user_id | UUID (FK → users.id) | Melyik felhasználó hozta létre |
| name | TEXT, NOT NULL | Recept neve |
| description | TEXT, NULLABLE | Recept leírása |
| created_at | TIMESTAMP | Létrehozás időpontja |

---

### 5. recipe_ingredients
Kapcsolótábla: melyik recept melyik élelmiszert tartalmazza és mennyi grammban. Ez a recipes és foods közötti N:M kapcsolatot valósítja meg.

| Mező | Típus | Leírás |
|------|-------|--------|
| id | UUID (PK) | Egyedi azonosító |
| recipe_id | UUID (FK → recipes.id) | Melyik recepthez tartozik |
| food_id | UUID (FK → foods.id) | Melyik élelmiszer |
| amount_g | DECIMAL, NOT NULL | Mennyiség grammban |

---

### 6. meals
Egy étkezési alkalom (reggeli, ebéd stb.) egy adott napon.

| Mező | Típus | Leírás |
|------|-------|--------|
| id | UUID (PK) | Egyedi azonosító |
| user_id | UUID (FK → users.id) | Melyik felhasználóhoz tartozik |
| date | DATE, NOT NULL | Az étkezés napja |
| type | TEXT, NOT NULL | Étkezés típusa: `'breakfast'`, `'lunch'`, `'dinner'`, `'snack'` |

---

### 7. meal_entries
Egy étkezésen belüli konkrét tétel — egy étel vagy recept adott gramm mennyiségben.

| Mező | Típus | Leírás |
|------|-------|--------|
| id | UUID (PK) | Egyedi azonosító |
| meal_id | UUID (FK → meals.id) | Melyik étkezéshez tartozik |
| food_id | UUID (FK → foods.id), NULLABLE | Étel (ha közvetlenül étel) |
| recipe_id | UUID (FK → recipes.id), NULLABLE | Recept (ha receptet adtak hozzá) |
| amount_g | DECIMAL, NOT NULL | Mennyiség grammban |

> **Megjegyzés:** `food_id` és `recipe_id` közül pontosan az egyik töltendő ki.

---

## Kapcsolatok

### Összefoglaló táblázat

| Kapcsolat | Típus | Leírás |
|-----------|-------|--------|
| users → user_profiles | 1:1 | Minden felhasználónak pontosan egy profilja van |
| users → meals | 1:N | Egy felhasználónak több étkezése lehet |
| users → recipes | 1:N | Egy felhasználónak több receptje lehet |
| meals → meal_entries | 1:N | Egy étkezés több tételt tartalmaz |
| foods → meal_entries | 1:N | Egy élelmiszer több étkezési tételben szerepelhet |
| recipes → meal_entries | 1:N | Egy recept több étkezési tételben szerepelhet |
| recipes → recipe_ingredients | 1:N | Egy recept több hozzávalót tartalmaz |
| foods → recipe_ingredients | 1:N | Egy élelmiszer több receptben szerepelhet |
| recipes és foods | N:M | recipe_ingredients kapcsolótáblán keresztül |

### Diagram

```
users
 ├── 1:1 ──► user_profiles
 ├── 1:N ──► meals
 │            └── 1:N ──► meal_entries ──► foods
 │                                    ──► recipes
 └── 1:N ──► recipes
              └── 1:N ──► recipe_ingredients ──► foods
```
