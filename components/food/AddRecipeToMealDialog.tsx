'use client';

import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, InputLabel, Select,
    MenuItem, Box, Typography, ToggleButton, ToggleButtonGroup,
} from '@mui/material';
import { useAddMealEntry } from '@/lib/hooks/useApi';


interface Props {
    open: boolean;
    onClose: () => void;
    recipe: { id: string; name: string; totalCalories: number; totalWeight: number } | null;
}

const mealTypes = [
    { value: 'breakfast', label: 'Reggeli' },
    { value: 'lunch', label: 'Ebéd' },
    { value: 'dinner', label: 'Vacsora' },
    { value: 'snack', label: 'Snack' },
];

const today = new Date().toISOString().split('T')[0];

export default function AddRecipeToMealDialog({ open, onClose, recipe }: Props) {
    const [mealType, setMealType] = useState('breakfast');
    const [mode, setMode] = useState<'serving' | 'gram'>('serving');
    const [localServing, setLocalServing] = useState('1');
    const [localGram, setLocalGram] = useState('100');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const { trigger: addEntry } = useAddMealEntry();

    const servings = Number(localServing);
    const grams = Number(localGram);

    const calories = recipe
        ? mode === 'serving'
            ? Math.round(recipe.totalCalories * servings)
            : recipe.totalWeight > 0
                ? Math.round(recipe.totalCalories * grams / recipe.totalWeight)
                : 0
        : 0;

    const amountG = mode === 'serving'
        ? Math.round(servings * 100)  // 1 adag = 100g konvenció
        : grams;

    const handleConfirm = async () => {
        if (!recipe || amountG <= 0) return;
        setSaving(true);
        setError('');
        try {
            await addEntry({
                date: today,
                type: mealType,
                entry: { recipeId: recipe.id, amountG },
            });
            handleClose();
        } catch (err: any) {
            setError(err.message || 'Hiba történt');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setMealType('breakfast');
        setMode('serving');
        setLocalServing('1');
        setLocalGram('100');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Recept hozzáadása étkezéshez</DialogTitle>
            <DialogContent dividers>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {recipe?.name}
                </Typography>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Étkezés</InputLabel>
                    <Select value={mealType} label="Étkezés" onChange={(e) => setMealType(e.target.value)}>
                        {mealTypes.map(({ value, label }) => (
                            <MenuItem key={value} value={value}>{label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(_, val) => { if (val) setMode(val); }}
                    size="small"
                    fullWidth
                    sx={{ mb: 2 }}
                    aria-label="Mennyiség típusa"
                >
                    <ToggleButton value="serving">Adag</ToggleButton>
                    <ToggleButton value="gram">Gramm</ToggleButton>
                </ToggleButtonGroup>

                {mode === 'serving' ? (
                    <TextField
                        label="Adagszám"
                        type="number"
                        value={localServing}
                        onChange={(e) => setLocalServing(e.target.value)}
                        onBlur={() => {
                            if (servings <= 0 || isNaN(servings)) setLocalServing('1');
                        }}
                        inputProps={{ min: 0.5, step: 0.5 }}
                        fullWidth
                        size="small"
                        autoFocus
                    />
                ) : (
                    <TextField
                        label="Mennyiség (gramm)"
                        type="number"
                        value={localGram}
                        onChange={(e) => setLocalGram(e.target.value)}
                        onBlur={() => {
                            if (grams < 1 || isNaN(grams)) setLocalGram('100');
                        }}
                        inputProps={{ min: 1, max: 9999 }}
                        fullWidth
                        size="small"
                        autoFocus
                    />
                )}

                {amountG > 0 && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700}>{calories} kcal</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.85 }}>
                            {mode === 'serving' ? `${localServing} adag` : `${grams}g`} • {today}
                        </Typography>
                    </Box>
                )}

                {error && <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>{error}</Typography>}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Mégse</Button>
                <Button variant="contained" onClick={handleConfirm} disabled={saving || amountG <= 0}>
                    {saving ? 'Mentés...' : 'Hozzáadás'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}