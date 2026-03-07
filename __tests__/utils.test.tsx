import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── 1. calcMacros utility ─────────────────────────────────────
function calcMacros(kcal: number, proteinPct: number, carbPct: number, fatPct: number) {
    return {
        protein: Math.round((kcal * proteinPct / 100) / 4),
        carbs: Math.round((kcal * carbPct / 100) / 4),
        fat: Math.round((kcal * fatPct / 100) / 9),
    };
}

describe('calcMacros', () => {
    test('2000 kcal 30/45/25 eloszlásnál helyes makrókat számít', () => {
        const result = calcMacros(2000, 30, 45, 25);
        expect(result.protein).toBe(150); // 2000 * 0.30 / 4
        expect(result.carbs).toBe(225);   // 2000 * 0.45 / 4
        expect(result.fat).toBe(56);      // 2000 * 0.25 / 9
    });

    test('0 kalóriánál 0 makrókat ad vissza', () => {
        const result = calcMacros(0, 30, 45, 25);
        expect(result.protein).toBe(0);
        expect(result.carbs).toBe(0);
        expect(result.fat).toBe(0);
    });

    test('magas fehérje eloszlásnál (40/30/30) helyes értékeket számít', () => {
        const result = calcMacros(2000, 40, 30, 30);
        expect(result.protein).toBe(200); // 2000 * 0.40 / 4
        expect(result.carbs).toBe(150);   // 2000 * 0.30 / 4
        expect(result.fat).toBe(67);      // 2000 * 0.30 / 9
    });
});

// ── 2. Kalória számítás segédfüggvények ───────────────────────
function kcalFromMacros(proteinG: number, carbsG: number, fatG: number) {
    return proteinG * 4 + carbsG * 4 + fatG * 9;
}

describe('kcalFromMacros', () => {
    test('150g fehérje + 225g szénhidrát + 56g zsír = 2004 kcal', () => {
        expect(kcalFromMacros(150, 225, 56)).toBe(2004);
    });

    test('0g minden makrónál 0 kcal', () => {
        expect(kcalFromMacros(0, 0, 0)).toBe(0);
    });
});

// ── 3. Napi cél validáció ─────────────────────────────────────
function isCalorieGoalValid(kcal: number) {
    return kcal >= 500 && kcal <= 10000;
}

describe('isCalorieGoalValid', () => {
    test('2000 kcal érvényes', () => expect(isCalorieGoalValid(2000)).toBe(true));
    test('499 kcal nem érvényes', () => expect(isCalorieGoalValid(499)).toBe(false));
    test('10001 kcal nem érvényes', () => expect(isCalorieGoalValid(10001)).toBe(false));
    test('500 kcal határérték érvényes', () => expect(isCalorieGoalValid(500)).toBe(true));
    test('10000 kcal határérték érvényes', () => expect(isCalorieGoalValid(10000)).toBe(true));
});