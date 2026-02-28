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
} from '@mui/material';
import Link from 'next/link';
import AddIcon from '@mui/icons-material/Add';
import RecipeCard from '@/components/recipe/RecipeCard';
import EmptyState from '@/components/ui/EmptyState';

// TODO: valódi adatok a 2. mérföldkőnél
const mockRecipes = [
    {
        id: '1',
        name: 'Zabpehely reggelire',
        description: 'Egyszerű, gyors és tápláló reggeli zabpehelyből és tejből.',
        ingredientCount: 3,
        totalCalories: 380,
    },
    {
        id: '2',
        name: 'Csirkés rizstál',
        description: 'Fehérjében gazdag ebéd csirkemellel és barna rizzsel.',
        ingredientCount: 5,
        totalCalories: 520,
    },
    {
        id: '3',
        name: 'Protein smoothie',
        description: 'Edzés utáni gyors fehérjefeltöltés.',
        ingredientCount: 4,
        totalCalories: 290,
    },
];

export default function RecipesPage() {
    const [recipes, setRecipes] = useState(mockRecipes);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const recipeToDelete = recipes.find((r) => r.id === deleteId);

    const handleDeleteConfirm = () => {
        if (deleteId) {
            setRecipes((prev) => prev.filter((r) => r.id !== deleteId));
            setDeleteId(null);
        }
    };

    return (
        <Box component="section" aria-labelledby="recipes-title">
            {/* Fejléc */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2,
                }}
            >
                <Box>
                    <Typography variant="h4" component="h1" id="recipes-title" fontWeight={700}>
                        Receptjeim
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        {recipes.length} recept
                    </Typography>
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

            {/* Receptek lista */}
            {recipes.length === 0 ? (
                <EmptyState
                    message="Még nincs egyetlen recepted sem"
                    subMessage="Hozd létre az első receptedet!"
                    onAction={() => { }}
                    actionLabel="Új recept létrehozása"
                />
            ) : (
                <Grid container spacing={2}>
                    {recipes.map((recipe) => (
                        <Grid key={recipe.id} size={{ xs: 12, sm: 6, md: 4 }}>
                            <RecipeCard
                                {...recipe}
                                onDelete={(id) => setDeleteId(id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Törlés megerősítő dialógus */}
            <Dialog
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Recept törlése
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Biztosan törölni szeretnéd a(z) <strong>{recipeToDelete?.name}</strong> receptet?
                        Ez a művelet nem vonható vissza.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteId(null)}
                        aria-label="Mégsem"
                    >
                        Mégsem
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                        aria-label="Törlés megerősítése"
                    >
                        Törlés
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}