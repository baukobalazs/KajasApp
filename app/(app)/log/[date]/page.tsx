'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Stack,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TodayIcon from '@mui/icons-material/Today';
import MealSection, { MealEntry } from '@/components/meal/MealSection';

// TODO: valódi adatok a 2. mérföldkőnél
const mockEntries: MealEntry[] = [
    {
        id: '1',
        name: 'Zabpehely',
        amountG: 80,
        caloriesPer100g: 370,
        proteinPer100g: 13,
        carbsPer100g: 60,
        fatPer100g: 7,
    },
    {
        id: '2',
        name: 'Tej (1,5%)',
        amountG: 200,
        caloriesPer100g: 46,
        proteinPer100g: 3.4,
        carbsPer100g: 4.8,
        fatPer100g: 1.5,
    },
];

const mealTypes = [
    { type: 'breakfast' as const, label: 'Reggeli' },
    { type: 'lunch' as const, label: 'Ebéd' },
    { type: 'dinner' as const, label: 'Vacsora' },
    { type: 'snack' as const, label: 'Snack' },
];

export default function LogPage() {
    const params = useParams();
    const router = useRouter();
    const date = params.date as string;

    const [entries, setEntries] = useState<Record<string, MealEntry[]>>({
        breakfast: mockEntries,
        lunch: [],
        dinner: [],
        snack: [],
    });

    // Dátum navigáció
    const navigateDate = (direction: 'prev' | 'next') => {
        const current = new Date(date);
        current.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
        router.push(`/log/${current.toISOString().split('T')[0]}`);
    };

    const isToday = date === new Date().toISOString().split('T')[0];

    const formattedDate = new Date(date).toLocaleDateString('hu-HU', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    // Handlers
    const handleAddFood = (mealType: string) => {
        // TODO: FoodSearchDialog megnyitása a 2. mérföldkőnél
        console.log('Étel hozzáadása:', mealType);
    };

    const handleDeleteEntry = (mealType: string, id: string) => {
        setEntries((prev) => ({
            ...prev,
            [mealType]: prev[mealType].filter((e) => e.id !== id),
        }));
    };

    const handleAmountChange = (mealType: string, id: string, amount: number) => {
        setEntries((prev) => ({
            ...prev,
            [mealType]: prev[mealType].map((e) =>
                e.id === id ? { ...e, amountG: amount } : e
            ),
        }));
    };

    const totalCalories = Object.values(entries)
        .flat()
        .reduce((sum, e) => sum + Math.round((e.caloriesPer100g * e.amountG) / 100), 0);

    return (
        <Box component="section" aria-labelledby="log-title">
            {/* Fejléc + dátum navigáció */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 1,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                        onClick={() => navigateDate('prev')}
                        aria-label="Előző nap"
                        sx={{ minWidth: 44, minHeight: 44 }}
                    >
                        <ArrowBackIosIcon fontSize="small" />
                    </IconButton>

                    <Box>
                        <Typography variant="h5" component="h1" id="log-title" fontWeight={700}>
                            {isToday ? 'Ma' : formattedDate}
                        </Typography>
                        {isToday && (
                            <Typography variant="body2" color="text.secondary">
                                {formattedDate}
                            </Typography>
                        )}
                    </Box>

                    <IconButton
                        onClick={() => navigateDate('next')}
                        aria-label="Következő nap"
                        disabled={isToday}
                        sx={{ minWidth: 44, minHeight: 44 }}
                    >
                        <ArrowForwardIosIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography variant="body1" fontWeight={600} color="primary.main">
                        {totalCalories} kcal összesen
                    </Typography>
                    {!isToday && (
                        <Button
                            startIcon={<TodayIcon />}
                            size="small"
                            variant="outlined"
                            onClick={() => router.push(`/log/${new Date().toISOString().split('T')[0]}`)}
                            aria-label="Ugrás a mai naphoz"
                        >
                            Ma
                        </Button>
                    )}
                </Box>
            </Box>

            {/* Étkezés szekciók */}
            <Stack spacing={2}>
                {mealTypes.map(({ type, label }) => (
                    <MealSection
                        key={type}
                        type={type}
                        label={label}
                        entries={entries[type]}
                        onAddFood={handleAddFood}
                        onDeleteEntry={(id) => handleDeleteEntry(type, id)}
                        onAmountChange={(id, amount) => handleAmountChange(type, id, amount)}
                    />
                ))}
            </Stack>
        </Box>
    );
}