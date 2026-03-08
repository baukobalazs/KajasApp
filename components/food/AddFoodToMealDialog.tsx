'use client';

import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Typography,
} from '@mui/material';
import { useAddMealEntry } from '@/lib/hooks/useApi';

interface Props {
    open: boolean;
    onClose: () => void;
    food: { id: string; name: string; caloriesPer100g: number } | null;
}

const mealTypes = [
    { value: 'breakfast', label: 'Reggeli' },
    { value: 'lunch', label: 'Ebéd' },
    { value: 'dinner', label: 'Vacsora' },
    { value: 'snack', label: 'Snack' },
];

const today = new Date().toISOString().split('T')[0];

export default function AddFoodToMealDialog({ open, onClose, food }: Props) {
    const [mealType, setMealType] = useState('breakfast');
    const [localAmount, setLocalAmount] = useState('100');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const { trigger: addEntry } = useAddMealEntry();

    const amountG = Number(localAmount);
    const calories = food ? Math.round(food.caloriesPer100g * amountG / 100) : 0;

    const handleConfirm = async () => {
        if (!food || amountG <= 0) return;
        setSaving(true);
        setError('');
        try {
            await addEntry({
                date: today,
                type: mealType,
                entry: { foodId: food.id, amountG },
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
        setLocalAmount('100');
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>Hozzáadás étkezéshez</DialogTitle>
            <DialogContent dividers>
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                    {food?.name}
                </Typography>

                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                    <InputLabel>Étkezés</InputLabel>
                    <Select value={mealType} label="Étkezés" onChange={(e) => setMealType(e.target.value)}>
                        {mealTypes.map(({ value, label }) => (
                            <MenuItem key={value} value={value}>{label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    label="Mennyiség (gramm)"
                    type="number"
                    value={localAmount}
                    onChange={(e) => setLocalAmount(e.target.value)}
                    onBlur={() => {
                        if (amountG < 1 || amountG > 9999) setLocalAmount('100');
                    }}
                    inputProps={{ min: 1, max: 9999 }}
                    fullWidth
                    size="small"
                    autoFocus
                />

                {amountG > 0 && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textAlign: 'center' }}>
                        <Typography variant="h6" fontWeight={700}>{calories} kcal</Typography>
                        <Typography variant="caption" sx={{ opacity: 0.85 }}>{amountG}g • {today}</Typography>
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