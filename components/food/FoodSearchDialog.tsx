'use client';

import { useState, useCallback, useDeferredValue } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, Typography, List, ListItem,
    ListItemButton, ListItemText, Chip, CircularProgress,
    InputAdornment, Divider, Alert, Tabs, Tab,
    ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { useRecipes } from '@/lib/hooks/useApi';

interface FoodResult {
    openfoodfactsId?: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
}

interface RecipeResult {
    id: string;
    name: string;
    description?: string;
    totalCalories: number;
    totalWeight: number;
    ingredientCount: number;
}

interface FoodSearchDialogProps {
    open: boolean;
    onClose: () => void;
    onSelect: (food: FoodResult & { savedId: string }, amountG: number) => void;
    onSelectRecipe?: (recipeId: string, amountG: number) => void;
    title?: string;
}

export default function FoodSearchDialog({
    open,
    onClose,
    onSelect,
    onSelectRecipe,
    title = 'Étel hozzáadása',
}: FoodSearchDialogProps) {
    const [tab, setTab] = useState(0);

    // --- Étel tab state ---
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<FoodResult[]>([]);
    const [selected, setSelected] = useState<FoodResult | null>(null);
    const [localAmount, setLocalAmount] = useState('100');
    const [searching, setSearching] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchError, setSearchError] = useState('');
    const deferredResults = useDeferredValue(results);

    // --- Recept tab state ---
    const [recipeQuery, setRecipeQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeResult | null>(null);
    const [recipeMode, setRecipeMode] = useState<'serving' | 'gram'>('serving');
    const [localServing, setLocalServing] = useState('1');
    const [localGram, setLocalGram] = useState('100');
    const [recipeSaving, setRecipeSaving] = useState(false);
    const [recipeError, setRecipeError] = useState('');

    const { data: recipesRaw } = useRecipes();
    const recipes: RecipeResult[] = (recipesRaw || []).map((r: any) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        ingredientCount: r.ingredients?.length || 0,
        totalCalories: (r.ingredients || []).reduce((sum: number, ing: any) => {
            if (!ing.food) return sum;
            return sum + Math.round(Number(ing.food.caloriesPer100g) * Number(ing.amountG) / 100);
        }, 0),
        totalWeight: (r.ingredients || []).reduce((sum: number, ing: any) => {
            return sum + Number(ing.amountG);
        }, 0),
    }));

    const filteredRecipes = recipes.filter(r =>
        r.name.toLowerCase().includes(recipeQuery.toLowerCase())
    );

    // --- Étel handlers ---
    const handleSearch = useCallback(async () => {
        if (query.length < 2) return;
        setSearching(true);
        setSearchError('');
        setResults([]);
        try {
            const res = await fetch(`/api/foods/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setResults(data.slice(0, 25));
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

    const handleConfirm = async () => {
        if (!selected || Number(localAmount) <= 0) return;
        setSaving(true);
        try {
            const res = await fetch('/api/foods/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(selected),
            });
            const savedFood = await res.json();
            if (!res.ok) throw new Error(savedFood.error);
            onSelect({ ...selected, savedId: savedFood.id }, Number(localAmount));
            handleClose();
        } catch (err: any) {
            setSearchError(err.message || 'Hiba történt a mentés során');
        } finally {
            setSaving(false);
        }
    };

    // --- Recept handlers ---
    const recipeAmountG = recipeMode === 'serving'
        ? Math.round(Number(localServing) * 100)
        : Number(localGram);

    const recipeCalories = selectedRecipe
        ? recipeMode === 'serving'
            ? Math.round(selectedRecipe.totalCalories * Number(localServing))
            : selectedRecipe.totalWeight > 0
                ? Math.round(selectedRecipe.totalCalories * Number(localGram) / selectedRecipe.totalWeight)
                : 0
        : 0;

    const handleRecipeConfirm = async () => {
        if (!selectedRecipe || recipeAmountG <= 0 || !onSelectRecipe) return;
        setRecipeSaving(true);
        setRecipeError('');
        try {
            await onSelectRecipe(selectedRecipe.id, recipeAmountG);
            handleClose();
        } catch (err: any) {
            setRecipeError(err.message || 'Hiba történt');
        } finally {
            setRecipeSaving(false);
        }
    };

    const handleClose = () => {
        setTab(0);
        setQuery(''); setResults([]); setSelected(null);
        setLocalAmount('100'); setSearchError('');
        setRecipeQuery(''); setSelectedRecipe(null);
        setRecipeMode('serving'); setLocalServing('1');
        setLocalGram('100'); setRecipeError('');
        onClose();
    };

    const calcCalories = (food: FoodResult, grams: number) =>
        Math.round((food.caloriesPer100g * grams) / 100);

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth aria-labelledby="food-search-title">
            <DialogTitle id="food-search-title">{title}</DialogTitle>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Tab label="Étel" />
                {onSelectRecipe && <Tab label="Recept" />}
            </Tabs>

            <DialogContent dividers>
                {/* ── ÉTEL TAB ── */}
                {tab === 0 && (
                    <>
                        {!selected && (
                            <Box>
                                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <TextField
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Étel neve (pl. csirkemell...)"
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

                                {searchError && <Alert severity="info" sx={{ mb: 2 }}>{searchError}</Alert>}

                                {deferredResults.length > 0 && (
                                    <List dense aria-label="Keresési eredmények" sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                        {deferredResults.map((food, index) => (
                                            <Box key={index}>
                                                <ListItem disablePadding>
                                                    <ListItemButton onClick={() => { setSelected(food); setLocalAmount('100'); }} sx={{ borderRadius: 1, py: 1 }}>
                                                        <ListItemText
                                                            primary={<Typography variant="body2" fontWeight={600}>{food.name}</Typography>}
                                                            secondary={
                                                                <Box component="span" sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                                                                    <Chip icon={<LocalFireDepartmentIcon sx={{ fontSize: '12px !important' }} />} label={`${food.caloriesPer100g} kcal`} size="small" color="secondary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                                    <Chip label={`F: ${food.proteinPer100g}g`} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                                    <Chip label={`Sz: ${food.carbsPer100g}g`} size="small" color="secondary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                                    <Chip label={`Zs: ${food.fatPer100g}g`} size="small" color="warning" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                                </Box>
                                                            }
                                                            secondaryTypographyProps={{ component: 'span' }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                                {index < deferredResults.length - 1 && <Divider />}
                                            </Box>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        )}

                        {selected && (
                            <Box>
                                <Button size="small" onClick={() => setSelected(null)} sx={{ mb: 2 }}>← Vissza</Button>
                                <Typography variant="h6" fontWeight={600} gutterBottom>{selected.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, mb: 3, flexWrap: 'wrap' }}>
                                    <Chip label={`${selected.caloriesPer100g} kcal/100g`} size="small" color="secondary" />
                                    <Chip label={`F: ${selected.proteinPer100g}g`} size="small" color="primary" variant="outlined" />
                                    <Chip label={`Sz: ${selected.carbsPer100g}g`} size="small" color="secondary" variant="outlined" />
                                    <Chip label={`Zs: ${selected.fatPer100g}g`} size="small" color="warning" variant="outlined" />
                                </Box>
                                <TextField
                                    label="Mennyiség (gramm)"
                                    type="number"
                                    value={localAmount}
                                    onChange={(e) => setLocalAmount(e.target.value)}
                                    onBlur={() => { if (Number(localAmount) < 1) setLocalAmount('100'); }}
                                    inputProps={{ min: 1, max: 9999 }}
                                    fullWidth autoFocus
                                />
                                {Number(localAmount) > 0 && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textAlign: 'center' }} role="status" aria-live="polite">
                                        <Typography variant="h5" fontWeight={700}>{calcCalories(selected, Number(localAmount))} kcal</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.85 }}>{localAmount}g {selected.name}</Typography>
                                    </Box>
                                )}
                                {searchError && <Alert severity="error" sx={{ mt: 2 }}>{searchError}</Alert>}
                            </Box>
                        )}
                    </>
                )}

                {/* ── RECEPT TAB ── */}
                {tab === 1 && (
                    <>
                        {!selectedRecipe && (
                            <Box>
                                <TextField
                                    value={recipeQuery}
                                    onChange={(e) => setRecipeQuery(e.target.value)}
                                    placeholder="Recept keresése..."
                                    size="small"
                                    fullWidth
                                    autoFocus
                                    sx={{ mb: 2 }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon aria-hidden="true" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    inputProps={{ 'aria-label': 'Recept keresése' }}
                                />
                                {filteredRecipes.length === 0 ? (
                                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
                                        {recipes.length === 0 ? 'Még nincs recepted.' : 'Nincs találat.'}
                                    </Typography>
                                ) : (
                                    <List dense sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                        {filteredRecipes.map((recipe, index) => (
                                            <Box key={recipe.id}>
                                                <ListItem disablePadding>
                                                    <ListItemButton onClick={() => setSelectedRecipe(recipe)} sx={{ borderRadius: 1, py: 1 }}>
                                                        <ListItemText
                                                            primary={
                                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                                    <BookmarkIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                                    <Typography variant="body2" fontWeight={600}>{recipe.name}</Typography>
                                                                </Box>
                                                            }
                                                            secondary={
                                                                <Box component="span" sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                                                    <Chip label={`${recipe.ingredientCount} hozzávaló`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                                    <Chip icon={<LocalFireDepartmentIcon sx={{ fontSize: '12px !important' }} />} label={`${recipe.totalCalories} kcal`} size="small" color="secondary" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                                                </Box>
                                                            }
                                                            secondaryTypographyProps={{ component: 'span' }}
                                                        />
                                                    </ListItemButton>
                                                </ListItem>
                                                {index < filteredRecipes.length - 1 && <Divider />}
                                            </Box>
                                        ))}
                                    </List>
                                )}
                            </Box>
                        )}

                        {selectedRecipe && (
                            <Box>
                                <Button size="small" onClick={() => setSelectedRecipe(null)} sx={{ mb: 2 }}>← Vissza</Button>
                                <Typography variant="h6" fontWeight={600} gutterBottom>{selectedRecipe.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, mb: 2 }}>
                                    <Chip label={`${selectedRecipe.ingredientCount} hozzávaló`} size="small" variant="outlined" />
                                    <Chip label={`${selectedRecipe.totalCalories} kcal/adag`} size="small" color="secondary" />
                                </Box>

                                <ToggleButtonGroup
                                    value={recipeMode}
                                    exclusive
                                    onChange={(_, val) => { if (val) setRecipeMode(val); }}
                                    size="small"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                >
                                    <ToggleButton value="serving">Adag</ToggleButton>
                                    <ToggleButton value="gram">Gramm</ToggleButton>
                                </ToggleButtonGroup>

                                {recipeMode === 'serving' ? (
                                    <TextField
                                        label="Adagszám"
                                        type="number"
                                        value={localServing}
                                        onChange={(e) => setLocalServing(e.target.value)}
                                        onBlur={() => { if (Number(localServing) <= 0) setLocalServing('1'); }}
                                        inputProps={{ min: 0.5, step: 0.5 }}
                                        fullWidth size="small" autoFocus
                                    />
                                ) : (
                                    <TextField
                                        label="Mennyiség (gramm)"
                                        type="number"
                                        value={localGram}
                                        onChange={(e) => setLocalGram(e.target.value)}
                                        onBlur={() => { if (Number(localGram) < 1) setLocalGram('100'); }}
                                        inputProps={{ min: 1, max: 9999 }}
                                        fullWidth size="small" autoFocus
                                    />
                                )}

                                {recipeAmountG > 0 && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textAlign: 'center' }} role="status" aria-live="polite">
                                        <Typography variant="h5" fontWeight={700}>{recipeCalories} kcal</Typography>
                                        <Typography variant="caption" sx={{ opacity: 0.85 }}>
                                            {recipeMode === 'serving' ? `${localServing} adag` : `${localGram}g`} • {selectedRecipe.name}
                                        </Typography>
                                    </Box>
                                )}
                                {recipeError && <Alert severity="error" sx={{ mt: 2 }}>{recipeError}</Alert>}
                            </Box>
                        )}
                    </>
                )}
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Mégse</Button>
                {tab === 0 && selected && (
                    <Button variant="contained" onClick={handleConfirm} disabled={saving || Number(localAmount) <= 0}>
                        {saving ? 'Mentés...' : 'Hozzáadás'}
                    </Button>
                )}
                {tab === 1 && selectedRecipe && (
                    <Button variant="contained" onClick={handleRecipeConfirm} disabled={recipeSaving || recipeAmountG <= 0}>
                        {recipeSaving ? 'Mentés...' : 'Hozzáadás'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}