'use client';

import { useState, useEffect } from 'react';
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
    Alert,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRecipe, useCreateRecipe, useUpdateRecipe } from '@/lib/hooks/useApi';
import FoodSearchDialog from '@/components/food/FoodSearchDialog';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

interface Ingredient {
    id?: string;
    foodId: string;
    name: string;
    amountG: number;
    caloriesPer100g: number;
}

export default function RecipeEditorPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const isNew = !params?.id || params.id === 'new';
    const recipeId = isNew ? null : params.id;

    const { data: existingRecipe, isLoading } = useRecipe(recipeId);
    const { trigger: createRecipe, isMutating: isCreating } = useCreateRecipe();
    const { trigger: updateRecipe, isMutating: isUpdating } = useUpdateRecipe(recipeId || '');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [ingredients, setIngredients] = useState<Ingredient[]>([]);
    const [searchOpen, setSearchOpen] = useState(false);
    const [serverError, setServerError] = useState('');
    const [errors, setErrors] = useState<{ name?: string }>({});

    // Meglévő recept adatainak betöltése
    useEffect(() => {
        if (existingRecipe) {
            setName(existingRecipe.name || '');
            setDescription(existingRecipe.description || '');
            setIngredients(
                (existingRecipe.ingredients || []).map((ing: any) => ({
                    id: ing.id,
                    foodId: ing.foodId,
                    name: ing.food?.name || '',
                    amountG: Number(ing.amountG),
                    caloriesPer100g: Number(ing.food?.caloriesPer100g || 0),
                }))
            );
        }
    }, [existingRecipe]);

    const validate = () => {
        const newErrors: { name?: string } = {};
        if (!name.trim()) newErrors.name = 'A recept neve kötelező';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFoodSelect = (food: any, amountG: number) => {
        setIngredients((prev) => [
            ...prev,
            {
                foodId: food.savedId,
                name: food.name,
                amountG,
                caloriesPer100g: food.caloriesPer100g,
            },
        ]);
    };

    const handleAmountChange = (index: number, amountG: number) => {
        setIngredients((prev) =>
            prev.map((ing, i) => (i === index ? { ...ing, amountG } : ing))
        );
    };

    const handleRemove = (index: number) => {
        setIngredients((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        if (!validate()) return;
        setServerError('');

        const payload = {
            name,
            description: description || undefined,
            ingredients: ingredients.map((i) => ({
                foodId: i.foodId,
                amountG: i.amountG,
            })),
        };

        try {
            if (isNew) {
                await createRecipe(payload);
            } else {
                await updateRecipe(payload);
            }
            router.push('/recipes');
        } catch (err: any) {
            setServerError(err.message || 'Hiba történt a mentés során');
        }
    };

    const totalCalories = ingredients.reduce(
        (sum, i) => sum + Math.round((i.caloriesPer100g * i.amountG) / 100),
        0
    );

    if (!isNew && isLoading) return <SkeletonLoader type="form" />;

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

            {serverError && (
                <Alert severity="error" sx={{ mb: 2 }} role="alert">
                    {serverError}
                </Alert>
            )}

            <Stack spacing={3}>
                {/* Alapadatok */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Alapadatok
                        </Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Recept neve"
                                value={name}
                                onChange={(e) => { setName(e.target.value); if (errors.name) setErrors({}); }}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                required
                                inputProps={{ 'aria-required': 'true' }}
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
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" fontWeight={600}>
                                Hozzávalók
                            </Typography>
                            <Button
                                startIcon={<AddIcon />}
                                variant="outlined"
                                size="small"
                                onClick={() => setSearchOpen(true)}
                                aria-label="Hozzávaló hozzáadása"
                                sx={{ minHeight: 44 }}
                            >
                                Hozzáadás
                            </Button>
                        </Box>

                        {ingredients.length === 0 ? (
                            <Box
                                sx={{
                                    py: 4, textAlign: 'center',
                                    border: '1px dashed', borderColor: 'divider',
                                    borderRadius: 2, color: 'text.secondary',
                                }}
                                role="status"
                            >
                                <Typography variant="body2">Még nincs hozzávaló hozzáadva</Typography>
                            </Box>
                        ) : (
                            <Stack divider={<Divider />} spacing={0}>
                                {ingredients.map((ingredient, index) => {
                                    const cal = Math.round((ingredient.caloriesPer100g * ingredient.amountG) / 100);
                                    return (
                                        <Box
                                            key={index}
                                            sx={{
                                                display: 'flex', alignItems: 'center',
                                                gap: 1, py: 1.5,
                                                flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight={600} sx={{ flexGrow: 1 }}>
                                                {ingredient.name}
                                            </Typography>
                                            <TextField
                                                type="number"
                                                value={ingredient.amountG}
                                                onChange={(e) => handleAmountChange(index, Number(e.target.value))}
                                                size="small"
                                                inputProps={{ min: 1, 'aria-label': `${ingredient.name} mennyisége` }}
                                                InputProps={{ endAdornment: <Typography variant="caption">g</Typography> }}
                                                sx={{ width: 90 }}
                                            />
                                            <Chip label={`${cal} kcal`} size="small" color="secondary" variant="outlined" />
                                            <IconButton
                                                onClick={() => handleRemove(index)}
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
                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', gap: 2 }}>
                                <Chip label={`Összesen: ${totalCalories} kcal`} color="secondary" />
                            </Box>
                        )}
                    </CardContent>
                </Card>

                {/* Mentés */}
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => router.back()} sx={{ minHeight: 44 }}>
                        Mégse
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSave}
                        disabled={isCreating || isUpdating}
                        sx={{ minHeight: 44 }}
                    >
                        {isCreating || isUpdating ? 'Mentés...' : isNew ? 'Létrehozás' : 'Mentés'}
                    </Button>
                </Box>
            </Stack>

            {/* Étel kereső dialógus */}
            <FoodSearchDialog
                open={searchOpen}
                onClose={() => setSearchOpen(false)}
                onSelect={handleFoodSelect}
                title="Hozzávaló hozzáadása"
            />
        </Box>
    );
}