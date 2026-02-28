# COMPONENTS.md

## Komponensfa

Az alkalmazás Next.js App Router alapú, komponens-alapú architektúrát követ. A komponensek három kategóriába sorolhatók: **oldalak** (page.tsx), **layout komponensek** és **újrafelhasználható UI komponensek**.

---

## Oldalak és komponenseik

### Publikus oldalak

#### `/auth/login` — Bejelentkezés
```
LoginPage
 └── AuthLayout
      └── LoginForm
           ├── EmailInput
           ├── PasswordInput
           └── SubmitButton
```

#### `/auth/register` — Regisztráció
```
RegisterPage
 └── AuthLayout
      └── RegisterForm
           ├── NameInput
           ├── EmailInput
           ├── PasswordInput
           └── SubmitButton
```

---

### Védett oldalak (bejelentkezés szükséges)

#### `/dashboard` — Napi összesítő
```
DashboardPage
 └── AppLayout
      ├── Navbar
      ├── DailyCalorieCard
      │    ├── CalorieProgressBar
      │    └── CalorieSummaryText
      ├── MacroProgressCard
      │    ├── MacroPieChart
      │    └── MacroProgressBar (x3: fehérje, szénhidrát, zsír)
      └── TodayMealsSummary
           └── MealTypeBadge (x4)
```

#### `/log/[date]` — Napi étkezési napló
```
LogPage
 └── AppLayout
      ├── Navbar
      ├── DateNavigator
      ├── MealSection (x4: reggeli, ebéd, vacsora, snack)
      │    ├── MealSectionHeader
      │    ├── MealEntryRow (x N)
      │    │    ├── FoodNameText
      │    │    ├── AmountInput
      │    │    ├── CalorieText
      │    │    └── DeleteButton
      │    ├── MealCalorieSummary
      │    └── AddFoodButton → FoodSearchDialog
      └── FoodSearchDialog (modal)
           ├── SearchInput
           ├── FoodSearchResultList
           │    └── FoodSearchResultItem (x N)
           └── AmountInputDialog
```

#### `/foods` — Élelmiszer keresés és lista
```
FoodsPage
 └── AppLayout
      ├── Navbar
      ├── FoodSearchBar
      ├── FoodFilterPanel
      │    ├── CalorieRangeSlider
      │    └── SortSelect
      ├── FoodList
      │    └── FoodCard (x N)
      │         ├── FoodName
      │         ├── MacroBadges
      │         └── AddToMealButton
      └── EmptyState (ha nincs találat)
```

#### `/recipes` — Receptek listája
```
RecipesPage
 └── AppLayout
      ├── Navbar
      ├── NewRecipeButton
      ├── RecipeList
      │    └── RecipeCard (x N)
      │         ├── RecipeName
      │         ├── IngredientCount
      │         ├── CalorieSummary
      │         ├── EditButton
      │         └── DeleteButton → ConfirmDialog
      └── EmptyState (ha nincs recept)
```

#### `/recipes/new` és `/recipes/[id]` — Recept szerkesztő
```
RecipeEditorPage
 └── AppLayout
      ├── Navbar
      └── RecipeBuilder
           ├── RecipeNameInput
           ├── RecipeDescriptionInput
           ├── IngredientList
           │    └── IngredientRow (x N)
           │         ├── FoodName
           │         ├── AmountInput
           │         └── RemoveButton
           ├── AddIngredientButton → FoodSearchDialog
           ├── RecipeCalorieSummary
           └── SaveButton
```

#### `/profile` — Profil és célok
```
ProfilePage
 └── AppLayout
      ├── Navbar
      └── ProfileForm
           ├── PersonalDataSection
           │    ├── NameInput
           │    ├── HeightInput
           │    ├── WeightInput
           │    └── AgeInput
           ├── GoalSelector
           │    └── GoalOption (x3: fogyás, fenntartás, tömegnövelés)
           ├── MacroGoalsSection
           │    ├── CalorieGoalInput
           │    ├── ProteinGoalInput
           │    ├── CarbGoalInput
           │    └── FatGoalInput
           └── SaveButton
```

#### `/admin/foods` — Admin élelmiszer kezelés
```
AdminFoodsPage
 └── AppLayout
      ├── Navbar
      ├── AddFoodButton → FoodFormDialog
      ├── AdminFoodTable
      │    ├── TableHeader (rendezés)
      │    ├── FoodTableRow (x N)
      │    │    ├── FoodName
      │    │    ├── MacroValues
      │    │    ├── EditButton → FoodFormDialog
      │    │    └── DeleteButton → ConfirmDialog
      │    └── TablePagination
      └── FoodFormDialog (modal: létrehozás és szerkesztés)
           ├── NameInput
           ├── CalorieInput
           ├── ProteinInput
           ├── CarbInput
           ├── FatInput
           └── SaveButton
```

---

## Megosztott / újrafelhasználható komponensek

```
components/
├── layout/
│    ├── AppLayout          — Védett oldalak közös layoutja (navbar + tartalom)
│    ├── AuthLayout         — Publikus auth oldalak layoutja
│    └── Navbar             — Felső navigációs sáv (desktop) / alsó tab bar (mobil)
├── ui/
│    ├── ConfirmDialog      — Megerősítő dialógus (törléshez)
│    ├── EmptyState         — Üres lista állapot illusztrációval
│    ├── SkeletonLoader     — Betöltési állapot skeleton
│    ├── ToastProvider      — Globális toast/snackbar értesítések
│    └── MacroBadge         — Makró értéket megjelenítő pill/badge
├── food/
│    ├── FoodSearchDialog   — OpenFoodFacts kereső modal
│    ├── FoodCard           — Élelmiszer kártya
│    └── FoodFormDialog     — Élelmiszer létrehozás/szerkesztés form (admin)
├── meal/
│    ├── MealSection        — Egy étkezési blokk a naplóban
│    ├── MealEntryRow       — Egy sor a naplóban (étel + gramm + törlés)
│    └── DateNavigator      — Dátum léptető a napló oldalon
├── recipe/
│    ├── RecipeCard         — Recept kártya
│    ├── RecipeBuilder      — Recept szerkesztő form
│    └── IngredientRow      — Egy hozzávaló sor a receptszerkesztőben
└── dashboard/
     ├── MacroProgressCard  — Makró kördiagram + progress bar-ok
     ├── CalorieProgressBar — Kalória cél progress bar
     └── TodayMealsSummary  — Mai étkezések összefoglalója
```

---

## Modulok összefoglalója

| Modul | Oldal(ak) | Fő komponensek |
|-------|-----------|----------------|
| Auth | /auth/login, /auth/register | LoginForm, RegisterForm |
| Dashboard | /dashboard | MacroProgressCard, CalorieProgressBar, TodayMealsSummary |
| Napló | /log/[date] | MealSection, MealEntryRow, FoodSearchDialog, DateNavigator |
| Élelmiszer | /foods | FoodSearchBar, FoodList, FoodCard, FoodFilterPanel |
| Receptek | /recipes, /recipes/new, /recipes/[id] | RecipeCard, RecipeBuilder, IngredientRow |
| Profil | /profile | ProfileForm, GoalSelector |
| Admin | /admin/foods | AdminFoodTable, FoodFormDialog |
