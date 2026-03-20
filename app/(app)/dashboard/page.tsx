'use client';

import { Typography, Box, Grid } from '@mui/material';
import { useSession } from 'next-auth/react';
import MacroProgressCard from '@/components/dashboard/MacroProgressCard';
import TodayMealsSummary from '@/components/dashboard/TodayMealsSummary';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { useMeals, useProfile } from '@/lib/hooks/useApi';

export default function DashboardPage() {
    const { data: session } = useSession();
    const today = new Date().toISOString().split('T')[0];

    const { data: mealsData, isLoading: mealsLoading, error: mealsError } = useMeals(today);
    const { data: profile, isLoading: profileLoading } = useProfile();

    const isLoading = mealsLoading || profileLoading;

    // Kalória és makró célok — profilból vagy alapértelmezett
    const calorieGoal = profile?.dailyCalorieGoal || 2000;
    const proteinGoal = profile?.proteinGoalG || 150;
    const carbGoal = profile?.carbGoalG || 200;
    const fatGoal = profile?.fatGoalG || 65;

    // Napi összesítés számítása a meals adatokból
    const totals = (mealsData || []).reduce(
        (acc: { calories: number; protein: number; carbs: number; fat: number }, meal: any) => {
            (meal.entries || []).forEach((entry: any) => {
                if (entry.food) {
                    const factor = Number(entry.amountG) / 100;
                    acc.calories += Math.round(Number(entry.food.caloriesPer100g) * factor);
                    acc.protein += Math.round(Number(entry.food.proteinPer100g) * factor);
                    acc.carbs += Math.round(Number(entry.food.carbsPer100g) * factor);
                    acc.fat += Math.round(Number(entry.food.fatPer100g) * factor);
                }
            });
            return acc;
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    // Mai étkezések összefoglalóhoz
    const mealTypeLabels: Record<string, string> = {
        breakfast: 'Reggeli',
        lunch: 'Ebéd',
        dinner: 'Vacsora',
        snack: 'Snack',
    };

    const mealSummaries = (mealsData || []).map((meal: any) => {
        const calories = (meal.entries || []).reduce((sum: number, entry: any) => {
            if (!entry.food) return sum;
            return sum + Math.round(Number(entry.food.caloriesPer100g) * Number(entry.amountG) / 100);
        }, 0);
        return {
            type: meal.type,
            label: mealTypeLabels[meal.type] || meal.type,
            calories,
            itemCount: meal.entries?.length || 0,
        };
    });

    const caloriePercentage = Math.min(Math.round((totals.calories / calorieGoal) * 100), 100);
    const remaining = Math.max(calorieGoal - totals.calories, 0);

    if (isLoading) return <SkeletonLoader type="dashboard" />;

    if (mealsError) {
        return (
            <Box sx={{ py: 4, textAlign: 'center', color: 'error.main' }} role="alert">
                <Typography>Hiba történt az adatok betöltésekor. Próbáld újra!</Typography>
            </Box>
        );
    }

    return (
        <Box component="section" aria-labelledby="dashboard-title">
            {/* Fejléc */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" id="dashboard-title" fontWeight={700}>
                    Szia, {session?.user?.name || 'Felhasználó'}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
                    {new Date().toLocaleDateString('hu-HU', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Kalória összesítő */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            p: { xs: 3, sm: 4 },
                            borderRadius: 4,
                            background: 'linear-gradient(135deg, #2E7D32 0%, #1B5E20 50%, #004D40 100%)',
                            color: 'white',
                            position: 'relative',
                            overflow: 'hidden',
                            '&::before': {
                                content: '\"\"',
                                position: 'absolute',
                                top: -60,
                                right: -60,
                                width: 200,
                                height: 200,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.06)',
                            },
                            '&::after': {
                                content: '\"\"',
                                position: 'absolute',
                                bottom: -40,
                                left: '30%',
                                width: 150,
                                height: 150,
                                borderRadius: '50%',
                                background: 'rgba(255,255,255,0.04)',
                            },
                        }}
                        role="region"
                        aria-label="Napi kalória összesítő"
                    >
                        <Typography variant="body2" sx={{ opacity: 0.8, mb: 0.5, fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '0.75rem' }}>
                            Napi kalóriabevitel
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2.5 }}>
                            <Typography sx={{ fontSize: { xs: '2.5rem', sm: '3rem' }, fontWeight: 800, lineHeight: 1 }}>
                                {totals.calories}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.6, fontWeight: 400 }}>
                                / {calorieGoal} kcal
                            </Typography>
                        </Box>

                        <Box
                            sx={{
                                height: 10,
                                borderRadius: 5,
                                bgcolor: 'rgba(255,255,255,0.15)',
                                overflow: 'hidden',
                                mb: 1.5,
                                position: 'relative',
                            }}
                            role="progressbar"
                            aria-valuenow={caloriePercentage}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            aria-label={`Kalória: ${caloriePercentage}%`}
                        >
                            <Box
                                sx={{
                                    height: '100%',
                                    width: `${caloriePercentage}%`,
                                    background: 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,1) 100%)',
                                    borderRadius: 5,
                                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                                }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Még <strong>{remaining} kcal</strong> maradt a célodból
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.6, fontWeight: 600 }}>
                                {caloriePercentage}%
                            </Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Makró kártyák */}
                <Grid item xs={12} sm={4}>
                    <MacroProgressCard
                        label="Fehérje"
                        current={totals.protein}
                        goal={proteinGoal}
                        unit="g"
                        color="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <MacroProgressCard
                        label="Szénhidrát"
                        current={totals.carbs}
                        goal={carbGoal}
                        unit="g"
                        color="secondary"
                    />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <MacroProgressCard
                        label="Zsír"
                        current={totals.fat}
                        goal={fatGoal}
                        unit="g"
                        color="warning"
                    />
                </Grid>

                {/* Mai étkezések */}
                <Grid item xs={12}>
                    <TodayMealsSummary meals={mealSummaries} date={today} />
                </Grid>
            </Grid>
        </Box>
    );
}