'use client';

import { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    TextField,
    InputAdornment,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Slider,
    Grid,
    Collapse,
    Button,
    Chip,
    Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FoodCard from '@/components/food/FoodCard';
import EmptyState from '@/components/ui/EmptyState';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { useFoods } from '@/lib/hooks/useApi';
import AddFoodToMealDialog from '@/components/food/AddFoodToMealDialog';
import FoodSearchDialog from '@/components/food/FoodSearchDialog';

type SortOption = 'name_asc' | 'name_desc' | 'calories_asc' | 'calories_desc' | 'protein_desc';

const sortLabels: Record<SortOption, string> = {
    name_asc: 'Név (A–Z)',
    name_desc: 'Név (Z–A)',
    calories_asc: 'Kalória (növekvő)',
    calories_desc: 'Kalória (csökkenő)',
    protein_desc: 'Fehérje (csökkenő)',
};

export default function FoodsPage() {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('name_asc');
    const [calorieRange, setCalorieRange] = useState<[number, number]>([0, 600]);
    const [showFilters, setShowFilters] = useState(false);
    const [addDialogFood, setAddDialogFood] = useState<{ id: string; name: string; caloriesPer100g: number } | null>(null);
    const [searchDialogOpen, setSearchDialogOpen] = useState(false);


    // SWR — keresés és szűrés szerver oldalon
    const [sortField, sortOrder] = sortBy.split('_') as [string, string];
    const { data: foods, isLoading, error, mutate } = useFoods({
        search,
        minCal: calorieRange[0] > 0 ? calorieRange[0] : undefined,
        maxCal: calorieRange[1] < 600 ? calorieRange[1] : undefined,
        sortBy: sortField === 'name' ? 'name' : sortField === 'calories' ? 'calories' : 'protein',
        sortOrder: sortOrder === 'desc' ? 'desc' : 'asc',
    });

    const handleAdd = (id: string) => {
        const food = sorted.find((f: any) => f.id === id);
        if (food) setAddDialogFood({ id: food.id, name: food.name, caloriesPer100g: Number(food.caloriesPer100g) });
    };
    const handleFoodFound = async (food: any, amountG: number) => {
        // Az étel már mentésre kerül a FoodSearchDialog-ban
        // Csak frissítjük a listát
        await mutate();
    };

    // Kliens oldali rendezés a protein_desc esetén
    const sorted = useMemo(() => {
        if (!foods) return [];
        if (sortBy === 'protein_desc') {
            return [...foods].sort((a: any, b: any) => Number(b.proteinPer100g) - Number(a.proteinPer100g));
        }
        return foods;
    }, [foods, sortBy]);

    const isFiltered = search !== '' || calorieRange[0] !== 0 || calorieRange[1] !== 600;

    const handleReset = () => {
        setSearch('');
        setCalorieRange([0, 600]);
        setSortBy('name_asc');
    };



    return (
        <Box component="section" aria-labelledby="foods-title">
            {/* Fejléc */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" id="foods-title" fontWeight={800}>
                        Élelmiszerek
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Keress az adatbázisban vagy adj hozzá ételt az étkezésedhez
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<SearchIcon />}
                    onClick={() => setSearchDialogOpen(true)}
                    sx={{ minHeight: 44 }}
                >
                    Új étel keresése
                </Button>
            </Box>

            {/* Kereső sor */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                <TextField
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Étel keresése..."
                    size="small"
                    sx={{ flexGrow: 1, minWidth: 200 }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon aria-hidden="true" />
                            </InputAdornment>
                        ),
                    }}
                    inputProps={{ 'aria-label': 'Élelmiszer keresése' }}
                />

                <FormControl size="small" sx={{ minWidth: 180 }}>
                    <InputLabel id="sort-label">Rendezés</InputLabel>
                    <Select
                        labelId="sort-label"
                        value={sortBy}
                        label="Rendezés"
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                    >
                        {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                            <MenuItem key={key} value={key}>{sortLabels[key]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button
                    startIcon={<FilterListIcon />}
                    variant={showFilters ? 'contained' : 'outlined'}
                    onClick={() => setShowFilters(!showFilters)}
                    aria-expanded={showFilters}
                    aria-controls="filter-panel"
                    sx={{ minHeight: 44 }}
                >
                    Szűrők
                    {isFiltered && (
                        <Chip label="!" size="small" color="error" sx={{ ml: 1, height: 18, fontSize: '0.65rem' }} />
                    )}
                </Button>
            </Box>

            {/* Szűrő panel */}
            <Collapse in={showFilters} id="filter-panel">
                <Box
                    sx={{
                        p: 2, mb: 2,
                        border: '1px solid', borderColor: 'divider',
                        borderRadius: 2, bgcolor: 'background.paper',
                    }}
                >
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                        Kalória tartomány (kcal/100g)
                    </Typography>
                    <Box sx={{ px: 1 }}>
                        <Slider
                            value={calorieRange}
                            onChange={(_, val) => setCalorieRange(val as [number, number])}
                            min={0}
                            max={600}
                            step={10}
                            valueLabelDisplay="auto"
                            aria-label="Kalória tartomány szűrő"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="caption" color="text.secondary">{calorieRange[0]} kcal</Typography>
                        <Typography variant="caption" color="text.secondary">{calorieRange[1]} kcal</Typography>
                    </Box>
                    {isFiltered && (
                        <Button size="small" onClick={handleReset} sx={{ mt: 1 }}>
                            Szűrők törlése
                        </Button>
                    )}
                </Box>
            </Collapse>

            {/* Hibakezelés */}
            {error && (
                <Alert severity="error" sx={{ mb: 2 }} role="alert">
                    Hiba történt az élelmiszerek betöltésekor. Próbáld újra!
                </Alert>
            )}

            {/* Találatok száma */}
            {!isLoading && !error && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {sorted.length} élelmiszer találat
                </Typography>
            )}

            {/* Lista */}
            {isLoading ? (
                <SkeletonLoader type="cards" />
            ) : sorted.length === 0 ? (
                <EmptyState
                    message="Nincs találat a megadott feltételekre"
                    subMessage="Próbálj más keresési feltételt, vagy töröld a szűrőket"
                    onAction={handleReset}
                    actionLabel="Szűrők törlése"
                />
            ) : (
                <Grid container spacing={2}>
                    {sorted.map((food: any) => (
                        <Grid key={food.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FoodCard
                                id={food.id}
                                name={food.name}
                                caloriesPer100g={Number(food.caloriesPer100g)}
                                proteinPer100g={Number(food.proteinPer100g)}
                                carbsPer100g={Number(food.carbsPer100g)}
                                fatPer100g={Number(food.fatPer100g)}
                                onAdd={handleAdd}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}
            <AddFoodToMealDialog
                open={Boolean(addDialogFood)}
                onClose={() => setAddDialogFood(null)}
                food={addDialogFood}
            />
            <FoodSearchDialog
                open={searchDialogOpen}
                onClose={() => setSearchDialogOpen(false)}
                onSelect={handleFoodFound}
                title="Új étel keresése"
            />
        </Box>

    );
}