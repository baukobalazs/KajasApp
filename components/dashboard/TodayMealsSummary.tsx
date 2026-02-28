'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    Chip,
    Button,
    Divider,
} from '@mui/material';
import Link from 'next/link';
import RestaurantIcon from '@mui/icons-material/Restaurant';

interface MealSummary {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    label: string;
    calories: number;
    itemCount: number;
}

interface TodayMealsSummaryProps {
    meals: MealSummary[];
    date: string;
}

const mealColors: Record<MealSummary['type'], 'primary' | 'secondary' | 'success' | 'warning'> = {
    breakfast: 'warning',
    lunch: 'primary',
    dinner: 'success',
    snack: 'secondary',
};

export default function TodayMealsSummary({ meals, date }: TodayMealsSummaryProps) {
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight={600}>
                        Mai étkezések
                    </Typography>
                    <Button
                        component={Link}
                        href={`/log/${date}`}
                        size="small"
                        variant="outlined"
                        aria-label="Napló megnyitása"
                    >
                        Napló megnyitása
                    </Button>
                </Box>

                {meals.length === 0 ? (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            py: 4,
                            color: 'text.secondary',
                        }}
                        role="status"
                        aria-live="polite"
                    >
                        <RestaurantIcon sx={{ fontSize: 48, mb: 1, opacity: 0.4 }} />
                        <Typography variant="body2">Még nincs rögzített étkezés ma</Typography>
                        <Button
                            component={Link}
                            href={`/log/${date}`}
                            variant="contained"
                            size="small"
                            sx={{ mt: 2 }}
                        >
                            Étkezés hozzáadása
                        </Button>
                    </Box>
                ) : (
                    <>
                        <List disablePadding>
                            {meals.map((meal, index) => (
                                <Box key={meal.type}>
                                    <ListItem disableGutters>
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Chip
                                                        label={meal.label}
                                                        size="small"
                                                        color={mealColors[meal.type]}
                                                        variant="outlined"
                                                    />
                                                    <Typography variant="body2" color="text.secondary">
                                                        {meal.itemCount} étel
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                        <ListItemSecondaryAction>
                                            <Typography variant="body2" fontWeight={600}>
                                                {meal.calories} kcal
                                            </Typography>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                    {index < meals.length - 1 && <Divider />}
                                </Box>
                            ))}
                        </List>

                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                mt: 2,
                                pt: 2,
                                borderTop: '1px solid',
                                borderColor: 'divider',
                            }}
                        >
                            <Typography variant="body2" fontWeight={600}>
                                Összesen
                            </Typography>
                            <Typography variant="body2" fontWeight={700} color="primary.main">
                                {totalCalories} kcal
                            </Typography>
                        </Box>
                    </>
                )}
            </CardContent>
        </Card>
    );
}