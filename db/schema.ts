import {
    pgTable,
    uuid,
    text,
    timestamp,
    integer,
    decimal,
    date,
    check,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';

// ── 1. users ──────────────────────────────────────────────────
export const users = pgTable('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: text('email').unique().notNull(),
    name: text('name'),
    passwordHash: text('password_hash'),
    role: text('role').default('user').notNull(), // 'user' | 'admin'
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── 2. user_profiles ──────────────────────────────────────────
export const userProfiles = pgTable('user_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    heightCm: integer('height_cm'),
    weightKg: decimal('weight_kg', { precision: 5, scale: 1 }),
    age: integer('age'),
    goal: text('goal').default('maintain'), // 'loss' | 'maintain' | 'gain'
    dailyCalorieGoal: integer('daily_calorie_goal').default(2000),
    proteinGoalG: integer('protein_goal_g').default(150),
    carbGoalG: integer('carb_goal_g').default(200),
    fatGoalG: integer('fat_goal_g').default(65),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ── 3. foods ──────────────────────────────────────────────────
export const foods = pgTable('foods', {
    id: uuid('id').primaryKey().defaultRandom(),
    openfoodfactsId: text('openfoodfacts_id').unique(), // null ha manuálisan adták hozzá
    name: text('name').notNull(),
    caloriesPer100g: decimal('calories_per_100g', { precision: 7, scale: 2 }).notNull(),
    proteinPer100g: decimal('protein_per_100g', { precision: 6, scale: 2 }),
    carbsPer100g: decimal('carbs_per_100g', { precision: 6, scale: 2 }),
    fatPer100g: decimal('fat_per_100g', { precision: 6, scale: 2 }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── 4. recipes ────────────────────────────────────────────────
export const recipes = pgTable('recipes', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    name: text('name').notNull(),
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

// ── 5. recipe_ingredients ─────────────────────────────────────
export const recipeIngredients = pgTable('recipe_ingredients', {
    id: uuid('id').primaryKey().defaultRandom(),
    recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'cascade' }).notNull(),
    foodId: uuid('food_id').references(() => foods.id, { onDelete: 'restrict' }).notNull(),
    amountG: decimal('amount_g', { precision: 7, scale: 1 }).notNull(),
});

// ── 6. meals ──────────────────────────────────────────────────
export const meals = pgTable('meals', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
    date: date('date').notNull(),
    type: text('type').notNull(), // 'breakfast' | 'lunch' | 'dinner' | 'snack'
});

// ── 7. meal_entries ───────────────────────────────────────────
export const mealEntries = pgTable(
    'meal_entries',
    {
        id: uuid('id').primaryKey().defaultRandom(),
        mealId: uuid('meal_id').references(() => meals.id, { onDelete: 'cascade' }).notNull(),
        foodId: uuid('food_id').references(() => foods.id, { onDelete: 'restrict' }),
        recipeId: uuid('recipe_id').references(() => recipes.id, { onDelete: 'restrict' }),
        amountG: decimal('amount_g', { precision: 7, scale: 1 }).notNull(),
    },
    (table) => ({
        // Pontosan az egyik kell: food_id VAGY recipe_id
        foodOrRecipeCheck: check(
            'food_or_recipe_check',
            sql`(${table.foodId} IS NOT NULL AND ${table.recipeId} IS NULL) OR (${table.foodId} IS NULL AND ${table.recipeId} IS NOT NULL)`
        ),
    })
);

// ── Relációk ──────────────────────────────────────────────────

export const usersRelations = relations(users, ({ one, many }) => ({
    profile: one(userProfiles, { fields: [users.id], references: [userProfiles.userId] }),
    meals: many(meals),
    recipes: many(recipes),
}));

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
    user: one(users, { fields: [userProfiles.userId], references: [users.id] }),
}));

export const foodsRelations = relations(foods, ({ many }) => ({
    mealEntries: many(mealEntries),
    recipeIngredients: many(recipeIngredients),
}));

export const recipesRelations = relations(recipes, ({ one, many }) => ({
    user: one(users, { fields: [recipes.userId], references: [users.id] }),
    ingredients: many(recipeIngredients),
    mealEntries: many(mealEntries),
}));

export const recipeIngredientsRelations = relations(recipeIngredients, ({ one }) => ({
    recipe: one(recipes, { fields: [recipeIngredients.recipeId], references: [recipes.id] }),
    food: one(foods, { fields: [recipeIngredients.foodId], references: [foods.id] }),
}));

export const mealsRelations = relations(meals, ({ one, many }) => ({
    user: one(users, { fields: [meals.userId], references: [users.id] }),
    entries: many(mealEntries),
}));

export const mealEntriesRelations = relations(mealEntries, ({ one }) => ({
    meal: one(meals, { fields: [mealEntries.mealId], references: [meals.id] }),
    food: one(foods, { fields: [mealEntries.foodId], references: [foods.id] }),
    recipe: one(recipes, { fields: [mealEntries.recipeId], references: [recipes.id] }),
}));

// ── Típusok exportálása ───────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Food = typeof foods.$inferSelect;
export type NewFood = typeof foods.$inferInsert;
export type Recipe = typeof recipes.$inferSelect;
export type NewRecipe = typeof recipes.$inferInsert;
export type RecipeIngredient = typeof recipeIngredients.$inferSelect;
export type Meal = typeof meals.$inferSelect;
export type NewMeal = typeof meals.$inferInsert;
export type MealEntry = typeof mealEntries.$inferSelect;
export type NewMealEntry = typeof mealEntries.$inferInsert;