'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    IconButton,
    Divider,
    Stack,
    Chip,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

interface Ingredient {
    id: string;
    foodId: string;
    name: string;
    amountG: number;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
}

// TODO: valódi adatok a 2. mérföldkőnél
const mockRecipe = {
    name: 'Csirkés rizstál',
    description: 'Fehérjében gazdag ebéd csirkemellel és barna rizzsel.',
    ingredients: [
        { id: '1', foodId: 'f1', name: 'Csirkemell', amountG: 200, caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
        { id: '2', foodId: 'f2', name: 'Barna rizs', amountG: 100, caloriesPer100g: 360, proteinPer100g: 7.5, carbsPer100g: 76, fatPer100g: 2.7 },
    ] as Ingredient[],
};

export default function RecipeEditorPage() {
    const params = useParams();
    const router = useRouter();
    const isNew = params.id === undefined;

    const [name, setName] = useState(isNew ? '' : mockRecipe.name);
    const [description, setDescription] = useState(isNew ? '' : mockRecipe.description);
    const [ingredients, setIngredients] = useState<Ingredient[]>(
        isNew ? [] : mockRecipe.ingredients
    );
    const [errors, setErrors] = useState<{ name?: string }>({});

    const totalCalories = ingredients.reduce(
        (sum, i) => sum + Math.round((i.caloriesPer100g * i.amountG) / 100),
        0
    );
    const totalProtein = ingredients.reduce(
        (sum, i) => sum + Math.round((i.proteinPer100g * i.amountG) / 100),
        0
    );

    const validate = () => {
        const newErrors: { name?: string } = {};
        if (!name.trim()) newErrors.name = 'A recept neve kötelező';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        // TODO: API hívás a 2. mérföldkőnél
        console.log('Mentés:', { name, description, ingredients });
        router.push('/recipes');
    };

    const handleAmountChange = (id: string, amount: number) => {
        setIngredients((prev) =>
            prev.map((i) => (i.id === id ? { ...i, amountG: amount } : i))
        );
    };

    const handleRemoveIngredient = (id: string) => {
        setIngredients((prev) => prev.filter((i) => i.id !== id));
    };

    const handleAddIngredient = () => {
        // TODO: FoodSearchDialog megnyitása a 2. mérföldkőnél
        console.log('Hozzávaló hozzáadása');
    };

    return (
        <Box component="section" aria-labelledby="recipe-editor-title">
            {/* Fejléc */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <IconButton
                    onClick={() => router.back()}
                    aria-label="Vissza"
                    sx={{ minWidth: 44, minHeight: 44 }}
                >
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1" id="recipe-editor-title" fontWeight={700}>
                    {isNew ? 'Új recept' : 'Recept szerkesztése'}
                </Typography>
            </Box>

            <Stack spacing={3}>
                {/* Alap adatok */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Alapadatok
                        </Typography>

                        <Stack spacing={2}>
                            <TextField
                                label="Recept neve"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name) setErrors({});
                                }}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                inputProps={{ 'aria-required': 'true' }}
                                required
                            />
                            <TextField
                                label="Leírás (opcionális)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                multiline
                                rows={3}
                            />
                        </Stack>
                    </CardContent>
                </Card>

                {/* Hozzávalók */}
                <Card>
                    <CardContent>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 2,
                            }}
                        >
                            <Typography variant="h6" fontWeight={600}>
                                Hozzávalók
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                variant="outlined"
                                size="small"
                                onClick={handleAddIngredient}
                                aria-label="Hozzávaló hozzáadása"
                                sx={{ minHeight: 44 }}
                            >
                                Hozzáadás
                            </Button>
                        </Box>

                        {ingredients.length === 0 ? (
                            <Box
                                sx={{
                                    py: 4,
                                    textAlign: 'center',
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    borderRadius: 2,
                                    color: 'text.secondary',
                                }}
                                role="status"
                            >
                                <Typography variant="body2">
                                    Még nincs hozzávaló hozzáadva
                                </Typography>
                            </Box>
                        ) : (
                            <Stack divider={<Divider />} spacing={0}>
                                {ingredients.map((ingredient) => {
                                    const cal = Math.round((ingredient.caloriesPer100g * ingredient.amountG) / 100);
                                    return (
                                        <Box
                                            key={ingredient.id}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 1,
                                                py: 1.5,
                                                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight={600} sx={{ flexGrow: 1 }}>
                                                {ingredient.name}
                                            </Typography>

                                            <TextField
                                                type="number"
                                                value={ingredient.amountG}
                                                onChange={(e) => handleAmountChange(ingredient.id, Number(e.target.value))}
                                                size="small"
                                                inputProps={{
                                                    min: 1,
                                                    'aria-label': `${ingredient.name} mennyisége`,
                                                }}
                                                InputProps={{ endAdornment: <Typography variant="caption">g</Typography> }}
                                                sx={{ width: 90 }}
                                            />

                                            <Chip
                                                label={`${cal} kcal`}
                                                size="small"
                                                color="secondary"
                                                variant="outlined"
                                            />

                                            <IconButton
                                                onClick={() => handleRemoveIngredient(ingredient.id)}
                                                aria-label={`${ingredient.name} eltávolítása`}
                                                size="small"
                                                color="error"
                                                sx={{ minWidth: 44, minHeight: 44 }}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    );
                                })}
                            </Stack>
                        )}

                        {/* Összesítő */}
                        {ingredients.length > 0 && (
                            <Box
                                sx={{
                                    mt: 2,
                                    pt: 2,
                                    borderTop: '1px solid',
                                    borderColor: 'divider',
                                    display: 'flex',
                                    gap: 2,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <Chip label={`Összesen: ${totalCalories} kcal`} color="secondary" />
                                <Chip label={`Fehérje: ${totalProtein}g`} color="primary" variant="outlined" />
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Mentés gomb */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={() => router.back()}
                        sx={{ minHeight: 44 }}
                    >
                        Mégse
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        sx={{ minHeight: 44 }}
                        aria-label={isNew ? 'Recept létrehozása' : 'Változások mentése'}
                    >
                        {isNew ? 'Létrehozás' : 'Mentés'}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}