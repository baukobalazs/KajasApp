'use client';

import { useState, useCallback } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Chip,
    CircularProgress,
    InputAdornment,
    Divider,
    Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface FoodResult {
    openfoodfactsId?: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
}

interface FoodSearchDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (food: FoodResult & { savedId: string }, amountG: number) => void;
    title?: string;
}

export default function FoodSearchDialog({
    open,
    onClose,
    onSelect,
    title = 'Étel hozzáadása',
}: FoodSearchDialogProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FoodResult[]>([]);
    const [selected, setSelected] = useState<FoodResult | null>(null);
    const [amountG, setAmountG] = useState(100);
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchError, setSearchError] = useState('');

    const handleSearch = useCallback(async () => {
        if (query.length < 2) return;
        setSearching(true);
        setSearchError('');
        setResults([]);

        try {
            const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setResults(data);
            if (data.length === 0) setSearchError('Nincs találat. Próbálj más keresési kifejezést.');
        } catch (err: any) {
            setSearchError(err.message || 'Hiba történt a keresés során');
        } finally {
            setSearching(false);
        }
    }, [query]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    const handleSelect = (food: FoodResult) => {
        setSelected(food);
        setAmountG(100);
    };

    const handleConfirm = async () => {
        if (!selected || amountG <= 0) return;
        setSaving(true);

        try {
            // Étel mentése az adatbázisba
            const res = await fetch('/api/foods/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selected),
            });
            const savedFood = await res.json();
            if (!res.ok) throw new Error(savedFood.error);

            onSelect({ ...selected, savedId: savedFood.id }, amountG);
            handleClose();
        } catch (err: any) {
            setSearchError(err.message || 'Hiba történt a mentés során');
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        setQuery('');
        setResults([]);
        setSelected(null);
        setAmountG(100);
        setSearchError('');
        onClose();
    };

    const calcCalories = (food: FoodResult, grams: number) =>
        Math.round((food.caloriesPer100g * grams) / 100);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            aria-labelledby="food-search-title"
        >
            <DialogTitle id="food-search-title">{title}</DialogTitle>

            <DialogContent dividers>
                {/* Keresés */}
                {!selected && (
                    <Box>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <TextField
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Étel neve (pl. csirkemell, zabpehely...)"
                                size="small"
                                fullWidth
                                autoFocus
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon aria-hidden="true" />
                                        </InputAdornment>
                                    ),
                                }}
                                inputProps={{ 'aria-label': 'Étel keresése' }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleSearch}
                                disabled={searching || query.length < 2}
                                sx={{ minHeight: 44, minWidth: 90 }}
                            >
                                {searching ? <CircularProgress size={20} color="inherit" /> : 'Keresés'}
                            </Button>
                        </Box>

                        {searchError && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                {searchError}
                            </Alert>
                        )}

                        {results.length > 0 && (
                            <List dense aria-label="Keresési eredmények">
                                {results.map((food, index) => (
                                    <Box key={index}>
                                        <ListItem disablePadding>
                                            <ListItemButton
                                                onClick={() => handleSelect(food)}
                                                aria-label={`${food.name} kiválasztása`}
                                                sx={{ borderRadius: 1, py: 1 }}
                                            >
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" fontWeight={600}>
                                                            {food.name}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                                                            <Chip
                                                                icon={<LocalFireDepartmentIcon sx={{ fontSize: '12px !important' }} />}
                                                                label={`${food.caloriesPer100g} kcal`}
                                                                size="small"
                                                                color="secondary"
                                                                variant="outlined"
                                                                sx={{ fontSize: '0.7rem' }}
                                                            />
                                                            <Chip label={`F: ${food.proteinPer100g}g`} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                            <Chip label={`Sz: ${food.carbsPer100g}g`} size="small" color="secondary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                            <Chip label={`Zs: ${food.fatPer100g}g`} size="small" color="warning" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                        </Box>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        {index < results.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        )}
                    </Box>
                )}

                {/* Mennyiség megadása */}
                {selected && (
                    <Box>
                        <Button
                            size="small"
                            onClick={() => setSelected(null)}
                            sx={{ mb: 2 }}
                            aria-label="Vissza a kereséshez"
                        >
                            ← Vissza
                        </Button>

                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            {selected.name}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 0.5, mb: 3, flexWrap: 'wrap' }}>
                            <Chip label={`${selected.caloriesPer100g} kcal/100g`} size="small" color="secondary" />
                            <Chip label={`F: ${selected.proteinPer100g}g`} size="small" color="primary" variant="outlined" />
                            <Chip label={`Sz: ${selected.carbsPer100g}g`} size="small" color="secondary" variant="outlined" />
                            <Chip label={`Zs: ${selected.fatPer100g}g`} size="small" color="warning" variant="outlined" />
                        </Box>

                        <TextField
                            label="Mennyiség (gramm)"
                            type="number"
                            value={amountG}
                            onChange={(e) => setAmountG(Number(e.target.value))}
                            inputProps={{ min: 1, max: 9999, 'aria-label': 'Mennyiség grammban' }}
                            fullWidth
                            autoFocus
                        />

                        {amountG > 0 && (
                            <Box
                                sx={{
                                    mt: 2, p: 2,
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    borderRadius: 2,
                                    textAlign: 'center',
                                }}
                                role="status"
                                aria-live="polite"
                            >
                                <Typography variant="h5" fontWeight={700}>
                                    {calcCalories(selected, amountG)} kcal
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.85 }}>
                                    {amountG}g {selected.name}
                                </Typography>
                            </Box>
                        )}

                        {searchError && (
                            <Alert severity="error" sx={{ mt: 2 }} role="alert">
                                {searchError}
                            </Alert>
                        )}
                    </Box>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Mégse</Button>
                {selected && (
                    <Button
                        variant="contained"
                        onClick={handleConfirm}
                        disabled={saving || amountG <= 0}
                        aria-label="Étel hozzáadása az étkezéshez"
                    >
                        {saving ? 'Mentés...' : 'Hozzáadás'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}