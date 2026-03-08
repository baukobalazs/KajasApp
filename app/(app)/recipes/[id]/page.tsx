'use client';

import { useParams, useRouter } from 'next/navigation';
import {
    Box, Typography, Button, Card, CardContent,
    Chip, Divider, Stack, IconButton, Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { useRecipe } from '@/lib/hooks/useApi';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function RecipeViewPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { data: recipe, isLoading, error } = useRecipe(id);

    const totalCalories = (recipe?.ingredients || []).reduce((sum: number, ing: any) => {
        if (!ing.food) return sum;
        return sum + Math.round(Number(ing.food.caloriesPer100g) * Number(ing.amountG) / 100);
    }, 0);

    if (isLoading) return <SkeletonLoader type="form" />;
    if (error) return <Alert severity="error">Hiba történt a recept betöltésekor.</Alert>;

    return (
        <Box component="section" aria-labelledby="recipe-view-title">
            {/* Fejléc */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton onClick={() => router.back()} aria-label="Vissza" sx={{ minWidth: 44, minHeight: 44 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h4" component="h1" id="recipe-view-title" fontWeight={700}>
                        {recipe?.name}
                    </Typography>
                </Box>
                <Button
                    startIcon={<EditIcon />}
                    variant="outlined"
                    onClick={() => router.push(`/recipes/${id}/edit`)}
                    sx={{ minHeight: 44 }}
                >
                    Szerkesztés
                </Button>
            </Box>

            <Stack spacing={3}>
                {/* Leírás + összesítő */}
                <Card>
                    <CardContent>
                        {recipe?.description && (
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                {recipe.description}
                            </Typography>
                        )}
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip label={`${recipe?.ingredients?.length || 0} hozzávaló`} variant="outlined" />
                            <Chip label={`${totalCalories} kcal összesen`} color="secondary" />
                        </Box>
                    </CardContent>
                </Card>

                {/* Hozzávalók */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Hozzávalók
                        </Typography>
                        <Stack divider={<Divider />} spacing={0}>
                            {(recipe?.ingredients || []).map((ing: any) => {
                                const cal = Math.round(Number(ing.food?.caloriesPer100g) * Number(ing.amountG) / 100);
                                return (
                                    <Box key={ing.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, flexWrap: 'wrap', gap: 1 }}>
                                        <Typography variant="body2" fontWeight={600}>
                                            {ing.food?.name}
                                        </Typography>
                                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                            <Chip label={`${ing.amountG}g`} size="small" variant="outlined" />
                                            <Chip label={`${cal} kcal`} size="small" color="secondary" variant="outlined" />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Stack>
                    </CardContent>
                </Card>
            </Stack>
        </Box>
    );
}