'use client';

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Stack,
    Alert,
} from '@mui/material';

interface FoodFormData {
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
}

interface FoodFormDialogProps {
    open: boolean;
    onClose: () => void;
    onSave: (data: FoodFormData) => Promise<void>;
    initial?: Partial<FoodFormData>;
    title?: string;
}

const empty: FoodFormData = {
    name: '',
    caloriesPer100g: 0,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 0,
};

export default function FoodFormDialog({
    open,
    onClose,
    onSave,
    initial,
    title = 'Élelmiszer',
}: FoodFormDialogProps) {
    const [form, setForm] = useState<FoodFormData>(empty);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [errors, setErrors] = useState<Partial<Record<keyof FoodFormData, string>>>({});

    useEffect(() => {
        if (open) {
            setForm(initial ? { ...empty, ...initial } : empty);
            setError('');
            setErrors({});
        }
    }, [open, initial]);

    const set = (field: keyof FoodFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = field === 'name' ? e.target.value : Number(e.target.value);
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const newErrors: Partial<Record<keyof FoodFormData, string>> = {};
        if (!form.name.trim()) newErrors.name = 'A név kötelező';
        if (form.caloriesPer100g <= 0) newErrors.caloriesPer100g = 'A kalória pozitív szám legyen';
        if (form.proteinPer100g < 0) newErrors.proteinPer100g = 'Nem lehet negatív';
        if (form.carbsPer100g < 0) newErrors.carbsPer100g = 'Nem lehet negatív';
        if (form.fatPer100g < 0) newErrors.fatPer100g = 'Nem lehet negatív';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        setSaving(true);
        setError('');
        try {
            await onSave(form);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Hiba történt a mentés során');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            aria-labelledby="food-form-title"
        >
            <DialogTitle id="food-form-title">{title}</DialogTitle>

            <DialogContent dividers>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} role="alert">
                        {error}
                    </Alert>
                )}

                <Stack spacing={2}>
                    <TextField
                        label="Élelmiszer neve"
                        value={form.name}
                        onChange={set('name')}
                        error={Boolean(errors.name)}
                        helperText={errors.name}
                        required
                        autoFocus
                        inputProps={{ 'aria-required': 'true' }}
                    />
                    <TextField
                        label="Kalória (kcal/100g)"
                        type="number"
                        value={form.caloriesPer100g || ''}
                        onChange={set('caloriesPer100g')}
                        error={Boolean(errors.caloriesPer100g)}
                        helperText={errors.caloriesPer100g}
                        required
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="Fehérje (g/100g)"
                        type="number"
                        value={form.proteinPer100g || ''}
                        onChange={set('proteinPer100g')}
                        error={Boolean(errors.proteinPer100g)}
                        helperText={errors.proteinPer100g}
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="Szénhidrát (g/100g)"
                        type="number"
                        value={form.carbsPer100g || ''}
                        onChange={set('carbsPer100g')}
                        error={Boolean(errors.carbsPer100g)}
                        helperText={errors.carbsPer100g}
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        label="Zsír (g/100g)"
                        type="number"
                        value={form.fatPer100g || ''}
                        onChange={set('fatPer100g')}
                        error={Boolean(errors.fatPer100g)}
                        helperText={errors.fatPer100g}
                        inputProps={{ min: 0 }}
                    />
                </Stack>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} disabled={saving}>
                    Mégse
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={saving}
                    aria-label={saving ? 'Mentés folyamatban...' : 'Mentés'}
                >
                    {saving ? 'Mentés...' : 'Mentés'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}