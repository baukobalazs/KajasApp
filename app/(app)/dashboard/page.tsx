import { Typography, Box, Grid } from '@mui/material';
import MacroProgressCard from '@/components/dashboard/MacroProgressCard';
import TodayMealsSummary from '@/components/dashboard/TodayMealsSummary';

// TODO: valódi adatok a 2. mérföldkőnél (adatbázisból)
const mockData = {
    user: { name: 'Teszt Felhasználó' },
    calories: { current: 1340, goal: 2000 },
    macros: {
        protein: { current: 87, goal: 150 },
        carbs: { current: 162, goal: 200 },
        fat: { current: 44, goal: 65 },
    },
    meals: [
        { type: 'breakfast' as const, label: 'Reggeli', calories: 420, itemCount: 3 },
        { type: 'lunch' as const, label: 'Ebéd', calories: 650, itemCount: 4 },
        { type: 'snack' as const, label: 'Snack', calories: 270, itemCount: 2 },
    ],
};

export default function DashboardPage() {
    const today = new Date().toISOString().split('T')[0];
    const { calories, macros, meals, user } = mockData;
    const caloriePercentage = Math.min(Math.round((calories.current / calories.goal) * 100), 100);
    const remaining = Math.max(calories.goal - calories.current, 0);

    return (
        <Box component="section" aria-labelledby="dashboard-title">
            {/* Fejléc */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" id="dashboard-title" fontWeight={700}>
                    Szia, {user.name}! 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {new Date().toLocaleDateString('hu-HU', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Kalória összesítő — teljes sor */}
                <Grid size={12}>
                    <Box
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            bgcolor: 'primary.main',
                            color: 'white',
                        }}
                        role="region"
                        aria-label="Napi kalória összesítő"
                    >
                        <Typography variant="body2" sx={{ opacity: 0.85, mb: 0.5 }}>
                            Napi kalóriabevitel
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
                            <Typography variant="h3" fontWeight={700}>
                                {calories.current}
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.75 }}>
                                / {calories.goal} kcal
                            </Typography>
                        </Box>

                        {/* Progress bar */}
                        <Box
                            sx={{
                                height: 12,
                                borderRadius: 6,
                                bgcolor: 'rgba(255,255,255,0.25)',
                                overflow: 'hidden',
                                mb: 1,
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
                                    bgcolor: 'white',
                                    borderRadius: 6,
                                    transition: 'width 0.4s ease',
                                }}
                            />
                        </Box>

                        <Typography variant="body2" sx={{ opacity: 0.85 }}>
                            Még {remaining} kcal maradt a célodból
                        </Typography>
                    </Box>
                </Grid>

                {/* Makró kártyák */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <MacroProgressCard
                        label="Fehérje"
                        current={macros.protein.current}
                        goal={macros.protein.goal}
                        unit="g"
                        color="primary"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <MacroProgressCard
                        label="Szénhidrát"
                        current={macros.carbs.current}
                        goal={macros.carbs.goal}
                        unit="g"
                        color="secondary"
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <MacroProgressCard
                        label="Zsír"
                        current={macros.fat.current}
                        goal={macros.fat.goal}
                        unit="g"
                        color="warning"
                    />
                </Grid>

                {/* Mai étkezések */}
                <Grid size={12}>
                    <TodayMealsSummary meals={meals} date={today} />
                </Grid>
            </Grid>
        </Box>
    );
}