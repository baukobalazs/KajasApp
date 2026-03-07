import '@testing-library/jest-dom';

// ── calcMacros utility ────────────────────────────────────────
function calcMacros(kcal: number, proteinPct: number, carbPct: number, fatPct: number) {
    return {
        protein: Math.round((kcal * proteinPct / 100) / 4),
        carbs: Math.round((kcal * carbPct / 100) / 4),
        fat: Math.round((kcal * fatPct / 100) / 9),
    };
}

describe('calcMacros — határesetek', () => {
    test('1500 kcal 25/50/25 eloszlásnál helyes makrókat számít', () => {
        const r = calcMacros(1500, 25, 50, 25);
        expect(r.protein).toBe(94);
        expect(r.carbs).toBe(188);
        expect(r.fat).toBe(42);
    });

    test('nagyon magas kalória esetén is helyes', () => {
        const r = calcMacros(5000, 30, 45, 25);
        expect(r.protein).toBe(375);
        expect(r.carbs).toBe(563);
        expect(r.fat).toBe(139);
    });

    test('100% fehérje esetén szénhidrát és zsír 0', () => {
        const r = calcMacros(2000, 100, 0, 0);
        expect(r.protein).toBe(500);
        expect(r.carbs).toBe(0);
        expect(r.fat).toBe(0);
    });
});

// ── pctTotal validáció ────────────────────────────────────────
function isPctValid(p: number, c: number, f: number) {
    return p + c + f === 100;
}

describe('makró százalék validáció', () => {
    test('30+45+25 = 100, érvényes', () => {
        expect(isPctValid(30, 45, 25)).toBe(true);
    });

    test('40+40+40 = 120, nem érvényes', () => {
        expect(isPctValid(40, 40, 40)).toBe(false);
    });

    test('10+10+10 = 30, nem érvényes', () => {
        expect(isPctValid(10, 10, 10)).toBe(false);
    });

    test('40+30+30 = 100, érvényes', () => {
        expect(isPctValid(40, 30, 30)).toBe(true);
    });
});