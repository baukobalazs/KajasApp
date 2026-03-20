'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    IconButton,
    Button,
    Stack,
    Alert,
    Snackbar,
} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import TodayIcon from '@mui/icons-material/Today';
import { useMeals, useAddMealEntry, useDeleteMealEntry, useUpdateMealEntry } from '@/lib/hooks/useApi';
import MealSection from '@/components/meal/MealSection';
import FoodSearchDialog from '@/components/food/FoodSearchDialog';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { MealEntry } from '@/components/meal/MealSection';

const mealTypes = [
    { type: 'breakfast' as const, label: 'Reggeli' },
    { type: 'lunch' as const, label: 'Ebéd' },
    { type: 'dinner' as const, label: 'Vacsora' },
    { type: 'snack' as const, label: 'Snack' },
];

export default function LogPage() {
    const { date } = useParams<{ date: string }>();
    const router = useRouter();

    const { data: mealsData, isLoading, error, mutate } = useMeals(date);
    const { trigger: addEntry } = useAddMealEntry();
    const { trigger: deleteEntry } = useDeleteMealEntry();
    const { trigger: updateEntry } = useUpdateMealEntry();

    const [searchOpen, setSearchOpen] = useState(false);
    const [activeMealType, setActiveMealType] = useState<string>('');
    const [toast, setToast] = useState('');

    const isToday = date === new Date().toISOString().split('T')[0];

    const formattedDate = new Date(date).toLocaleDateString('hu-HU', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    const navigateDate = (direction: 'prev' | 'next') => {
        const current = new Date(date);
        current.setDate(current.getDate() + (direction === 'next' ? 1 : -1));
        router.push(`/log/${current.toISOString().split('T')[0]}`);
    };

    const handleAddFood = (mealType: string) => {
        setActiveMealType(mealType);
        setSearchOpen(true);
    };

    const handleFoodSelect = async (food: any, amountG: number) => {
        try {
            await addEntry({
                date,
                type: activeMealType,
                entry: { foodId: food.savedId, amountG },
            });
            await mutate();
            setToast('Étel sikeresen hozzáadva');
        } catch (err: any) {
            setToast(err.message || 'Hiba történt');
        }
    };

    const handleDeleteEntry = async (id: string) => {
        try {
            await deleteEntry({ id });
            await mutate();
        } catch (err: any) {
            setToast(err.message || 'Hiba történt a törlés során');
        }
    };

    const handleAmountChange = async (id: string, amountG: number) => {
        try {
            await updateEntry({ id, amountG });
            await mutate();
        } catch (err: any) {
            setToast(err.message || 'Hiba történt');
        }
    };

    // Meals adatok átalakítása MealSection számára
    const getMealEntries = (type: string): MealEntry[] => {
        const meal = (mealsData || []).find((m: any) => m.type === type);
        if (!meal) return [];
        return (meal.entries || []).map((entry: any) => ({
            id: entry.id,
            name: entry.food?.name || entry.recipe?.name || 'Ismeretlen',
            amountG: Number(entry.amountG),
            caloriesPer100g: Number(entry.food?.caloriesPer100g || 0),
            proteinPer100g: Number(entry.food?.proteinPer100g || 0),
            carbsPer100g: Number(entry.food?.carbsPer100g || 0),
            fatPer100g: Number(entry.food?.fatPer100g || 0),
        }));
    };

    const totalCalories = (mealsData || []).reduce((sum: number, meal: any) => {
        return sum + (meal.entries || []).reduce((s: number, entry: any) => {
            if (!entry.food) return s;
            return s + Math.round(Number(entry.food.caloriesPer100g) * Number(entry.amountG) / 100);
        }, 0);
    }, 0);

    const handleRecipeSelect = async (recipeId: string, amountG: number) => {
        try {
            await addEntry({
                date,
                type: activeMealType,
                entry: { recipeId, amountG },
            });
            await mutate();
            setToast('Recept sikeresen hozzáadva');
        } catch (err: any) {
            setToast(err.message || 'Hiba történt');
        }
    };

    if (isLoading) return <SkeletonLoader type="list" />;

    return (
        <Box component="section" aria-labelledby="log-title">
            {/* Fejléc + dátum navigáció */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <IconButton onClick={() => navigateDate('prev')} aria-label="Előző nap" sx={{ minWidth: 44, minHeight: 44 }}>
                        <ArrowBackIosIcon fontSize="small" />
                    </IconButton>

                    <Box sx={{ textAlign: 'center', minWidth: 180 }}>
                        <Typography variant="h5" component="h1" id="log-title" fontWeight={700}>
                            {isToday ? 'Ma' : formattedDate}
                        </Typography>
                        {isToday && (
                            <Typography variant="body2" color="text.secondary">{formattedDate}</Typography>
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
                    <Box
                        sx={{
                            px: 2, py: 0.75,
                            borderRadius: 2,
                            background: 'linear-gradient(135deg, #2E7D32, #1B5E20)',
                            color: '#fff',
                        }}
                    >
                        <Typography variant="body2" fontWeight={700}>
                            {totalCalories} kcal
                        </Typography>
                    </Box>
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

            {/* Hibakezelés */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} role="alert">
                    Hiba történt az étkezések betöltésekor.
                </Alert>
            )}

            {/* Étkezés szekciók */}
            <Stack spacing={2}>
                {mealTypes.map(({ type, label }) => (
                    <MealSection
                        key={type}
                        type={type}
                        label={label}
                        entries={getMealEntries(type)}
                        onAddFood={handleAddFood}
                        onDeleteEntry={handleDeleteEntry}
                        onAmountChange={handleAmountChange}
                    />
                ))}
            </Stack>

            {/* Étel kereső dialógus */}
            <FoodSearchDialog
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                onSelect={handleFoodSelect}
                onSelectRecipe={handleRecipeSelect}
                title={`Étel hozzáadása — ${mealTypes.find(m => m.type === activeMealType)?.label || ''}`}
            />

            {/* Toast */}
            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={3000}
                onClose={() => setToast('')}
                message={toast}
                aria-live="polite"
            />
        </Box>
    );
}