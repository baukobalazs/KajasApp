'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
    Snackbar,
} from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import { useRecipes, useDeleteRecipe } from '@/lib/hooks/useApi';
import RecipeCard from '@/components/recipe/RecipeCard';
import EmptyState from '@/components/ui/EmptyState';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

export default function RecipesPage() {
    const { data: recipes, isLoading, error, mutate } = useRecipes();
    const { trigger: deleteRecipe } = useDeleteRecipe();

    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [toast, setToast] = useState('');

    const recipeToDelete = recipes?.find((r: any) => r.id === deleteId);

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await deleteRecipe({ id: deleteId });
            await mutate();
            setDeleteId(null);
            setToast('Recept sikeresen törölve');
        } catch (err: any) {
            setToast(err.message || 'Hiba történt a törlés során');
        }
    };

    // Kalória összesítés egy recepthez
    const calcRecipeCalories = (recipe: any) => {
        return (recipe.ingredients || []).reduce((sum: number, ing: any) => {
            if (!ing.food) return sum;
            return sum + Math.round(Number(ing.food.caloriesPer100g) * Number(ing.amountG) / 100);
        }, 0);
    };

    return (
        <Box component="section" aria-labelledby="recipes-title">
            {/* Fejléc */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" id="recipes-title" fontWeight={700}>
                        Receptjeim
                    </Typography>
                    {!isLoading && (
                        <Typography variant="body1" color="text.secondary">
                            {recipes?.length || 0} recept
                        </Typography>
                    )}
                </Box>
                <Button
                    component={Link}
                    href="/recipes/new"
                    variant="contained"
                    startIcon={<AddIcon />}
                    aria-label="Új recept létrehozása"
                    sx={{ minHeight: 44 }}
                >
                    Új recept
                </Button>
            </Box>

            {/* Hibakezelés */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} role="alert">
                    Hiba történt a receptek betöltésekor. Próbáld újra!
                </Alert>
            )}

            {/* Lista */}
            {isLoading ? (
                <SkeletonLoader type="cards" />
            ) : recipes?.length === 0 ? (
                <EmptyState
                    message="Még nincs egyetlen recepted sem"
                    subMessage="Hozd létre az első receptedet!"
                    onAction={() => { }}
                    actionLabel="Új recept létrehozása"
                />
            ) : (
                <Grid container spacing={2}>
                    {recipes?.map((recipe: any) => (
                        <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <RecipeCard
                                id={recipe.id}
                                name={recipe.name}
                                description={recipe.description}
                                ingredientCount={recipe.ingredients?.length || 0}
                                totalCalories={calcRecipeCalories(recipe)}
                                onDelete={(id) => setDeleteId(id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Törlés dialógus */}
            <Dialog
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">Recept törlése</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Biztosan törölni szeretnéd a(z) <strong>{recipeToDelete?.name}</strong> receptet?
                        Ez a művelet nem vonható vissza.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Mégsem</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Törlés
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Toast értesítés */}
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