import '@testing-library/jest-dom';

// ── Étel kalória számítás adagra ──────────────────────────────
function calcEntryCalories(caloriesPer100g: number, amountG: number): number {
    return Math.round((caloriesPer100g * amountG) / 100);
}

function calcEntryMacro(macroPer100g: number, amountG: number): number {
    return Math.round((macroPer100g * amountG) / 100 * 10) / 10;
}

describe('calcEntryCalories — étel kalória per adag', () => {
    test('100g-nál a per 100g értéket adja vissza', () => {
        expect(calcEntryCalories(250, 100)).toBe(250);
    });

    test('50g felezi a kalóriát', () => {
        expect(calcEntryCalories(200, 50)).toBe(100);
    });

    test('150g-nál másfélszeresét adja', () => {
        expect(calcEntryCalories(200, 150)).toBe(300);
    });

    test('0g-nál 0 kalóriát ad', () => {
        expect(calcEntryCalories(350, 0)).toBe(0);
    });

    test('nagyon kis adag (10g) kerekítés', () => {
        expect(calcEntryCalories(333, 10)).toBe(33);
    });
});

describe('calcEntryMacro — makró per adag', () => {
    test('25g fehérje/100g, 200g adag → 50g', () => {
        expect(calcEntryMacro(25, 200)).toBe(50);
    });

    test('10.5g zsír/100g, 80g adag → 8.4g', () => {
        expect(calcEntryMacro(10.5, 80)).toBe(8.4);
    });
});

// ── Recept össz-tápanyag számítás ─────────────────────────────
interface Ingredient {
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    amountG: number;
}

function calcRecipeTotals(ingredients: Ingredient[]) {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let totalWeight = 0;

    for (const ing of ingredients) {
        const factor = ing.amountG / 100;
        totalCalories += ing.caloriesPer100g * factor;
        totalProtein += ing.proteinPer100g * factor;
        totalCarbs += ing.carbsPer100g * factor;
        totalFat += ing.fatPer100g * factor;
        totalWeight += ing.amountG;
    }

    return {
        calories: Math.round(totalCalories),
        protein: Math.round(totalProtein * 10) / 10,
        carbs: Math.round(totalCarbs * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
        totalWeight: Math.round(totalWeight),
    };
}

describe('calcRecipeTotals — recept össz-tápanyag', () => {
    test('egy összetevős recept helyes összesítést ad', () => {
        const result = calcRecipeTotals([
            { caloriesPer100g: 300, proteinPer100g: 20, carbsPer100g: 40, fatPer100g: 10, amountG: 200 },
        ]);
        expect(result.calories).toBe(600);
        expect(result.protein).toBe(40);
        expect(result.carbs).toBe(80);
        expect(result.fat).toBe(20);
        expect(result.totalWeight).toBe(200);
    });

    test('több összetevős recept helyesen összegez', () => {
        const result = calcRecipeTotals([
            { caloriesPer100g: 200, proteinPer100g: 10, carbsPer100g: 30, fatPer100g: 5, amountG: 150 },
            { caloriesPer100g: 50, proteinPer100g: 2, carbsPer100g: 10, fatPer100g: 0.5, amountG: 100 },
        ]);
        expect(result.calories).toBe(350); // 300 + 50
        expect(result.protein).toBe(17);   // 15 + 2
        expect(result.totalWeight).toBe(250);
    });

    test('üres recept nullát ad', () => {
        const result = calcRecipeTotals([]);
        expect(result.calories).toBe(0);
        expect(result.protein).toBe(0);
        expect(result.totalWeight).toBe(0);
    });
});

// ── Dátum navigáció ───────────────────────────────────────────
function navigateDate(currentDate: string, direction: 'prev' | 'next'): string {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + (direction === 'next' ? 1 : -1));
    return d.toISOString().split('T')[0];
}

function formatDateHungarian(dateStr: string): string {
    const d = new Date(dateStr);
    return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, '0')}. ${String(d.getDate()).padStart(2, '0')}.`;
}

function isToday(dateStr: string): boolean {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
}

describe('navigateDate — dátum léptetés', () => {
    test('következő nap', () => {
        expect(navigateDate('2026-03-08', 'next')).toBe('2026-03-09');
    });

    test('előző nap', () => {
        expect(navigateDate('2026-03-08', 'prev')).toBe('2026-03-07');
    });

    test('hónap váltás', () => {
        expect(navigateDate('2026-03-01', 'prev')).toBe('2026-02-28');
    });

    test('év váltás', () => {
        expect(navigateDate('2026-01-01', 'prev')).toBe('2025-12-31');
    });
});

describe('formatDateHungarian — magyar dátum formázás', () => {
    test('2026-03-08 → 2026. 03. 08.', () => {
        expect(formatDateHungarian('2026-03-08')).toBe('2026. 03. 08.');
    });

    test('2026-12-25 → 2026. 12. 25.', () => {
        expect(formatDateHungarian('2026-12-25')).toBe('2026. 12. 25.');
    });
});

// ── Étkezés típus validáció ───────────────────────────────────
const VALID_MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
type MealType = typeof VALID_MEAL_TYPES[number];

function isValidMealType(type: string): type is MealType {
    return (VALID_MEAL_TYPES as readonly string[]).includes(type);
}

const MEAL_TYPE_LABELS: Record<MealType, string> = {
    breakfast: 'Reggeli',
    lunch: 'Ebéd',
    dinner: 'Vacsora',
    snack: 'Snack',
};

describe('isValidMealType — étkezés típus validáció', () => {
    test('breakfast érvényes', () => expect(isValidMealType('breakfast')).toBe(true));
    test('lunch érvényes', () => expect(isValidMealType('lunch')).toBe(true));
    test('dinner érvényes', () => expect(isValidMealType('dinner')).toBe(true));
    test('snack érvényes', () => expect(isValidMealType('snack')).toBe(true));
    test('brunch nem érvényes', () => expect(isValidMealType('brunch')).toBe(false));
    test('üres string nem érvényes', () => expect(isValidMealType('')).toBe(false));
});

describe('MEAL_TYPE_LABELS — magyar nevek', () => {
    test('minden típusnak van magyar neve', () => {
        for (const type of VALID_MEAL_TYPES) {
            expect(MEAL_TYPE_LABELS[type]).toBeDefined();
            expect(MEAL_TYPE_LABELS[type].length).toBeGreaterThan(0);
        }
    });
});

// ── Profil validáció ──────────────────────────────────────────
function isHeightValid(cm: number): boolean {
    return cm >= 100 && cm <= 250;
}

function isWeightValid(kg: number): boolean {
    return kg >= 30 && kg <= 300;
}

function isAgeValid(age: number): boolean {
    return age >= 10 && age <= 120;
}

describe('Profil validáció', () => {
    test('170cm érvényes magasság', () => expect(isHeightValid(170)).toBe(true));
    test('99cm túl alacsony', () => expect(isHeightValid(99)).toBe(false));
    test('251cm túl magas', () => expect(isHeightValid(251)).toBe(false));

    test('75kg érvényes súly', () => expect(isWeightValid(75)).toBe(true));
    test('29kg túl kevés', () => expect(isWeightValid(29)).toBe(false));
    test('301kg túl sok', () => expect(isWeightValid(301)).toBe(false));

    test('25 éves érvényes kor', () => expect(isAgeValid(25)).toBe(true));
    test('9 éves túl fiatal', () => expect(isAgeValid(9)).toBe(false));
    test('121 éves túl öreg', () => expect(isAgeValid(121)).toBe(false));
});

// ── Napi összesítő számítás ───────────────────────────────────
interface MealEntryForCalc {
    amountG: number;
    food?: { caloriesPer100g: number; proteinPer100g: number; carbsPer100g: number; fatPer100g: number } | null;
    recipe?: { totalCalories: number; totalProtein: number; totalCarbs: number; totalFat: number; totalWeight: number } | null;
}

function calcDailyTotals(entries: MealEntryForCalc[]) {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    for (const e of entries) {
        if (e.food) {
            const factor = e.amountG / 100;
            calories += Number(e.food.caloriesPer100g) * factor;
            protein += Number(e.food.proteinPer100g) * factor;
            carbs += Number(e.food.carbsPer100g) * factor;
            fat += Number(e.food.fatPer100g) * factor;
        }
    }

    return {
        calories: Math.round(calories),
        protein: Math.round(protein),
        carbs: Math.round(carbs),
        fat: Math.round(fat),
    };
}

describe('calcDailyTotals — napi összesítés', () => {
    test('egy étel bejegyzés helyes összesítést ad', () => {
        const result = calcDailyTotals([
            { amountG: 200, food: { caloriesPer100g: 150, proteinPer100g: 10, carbsPer100g: 20, fatPer100g: 5 } },
        ]);
        expect(result.calories).toBe(300);
        expect(result.protein).toBe(20);
        expect(result.carbs).toBe(40);
        expect(result.fat).toBe(10);
    });

    test('több bejegyzés összegzi az értékeket', () => {
        const result = calcDailyTotals([
            { amountG: 100, food: { caloriesPer100g: 200, proteinPer100g: 15, carbsPer100g: 25, fatPer100g: 8 } },
            { amountG: 50, food: { caloriesPer100g: 100, proteinPer100g: 5, carbsPer100g: 15, fatPer100g: 2 } },
        ]);
        expect(result.calories).toBe(250);
        expect(result.protein).toBe(18); // 15 + 2.5 → 18
    });

    test('üres bejegyzés lista nullát ad', () => {
        const result = calcDailyTotals([]);
        expect(result.calories).toBe(0);
        expect(result.protein).toBe(0);
    });

    test('food nélküli bejegyzést kihagyja (recept)', () => {
        const result = calcDailyTotals([
            { amountG: 100, food: null, recipe: { totalCalories: 500, totalProtein: 30, totalCarbs: 50, totalFat: 20, totalWeight: 400 } },
        ]);
        expect(result.calories).toBe(0); // csak food-ot számol
    });
});
