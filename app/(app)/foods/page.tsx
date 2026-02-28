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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import FoodCard from '@/components/food/FoodCard';
import EmptyState from '@/components/ui/EmptyState';

// TODO: valódi adatok a 2. mérföldkőnél
const mockFoods = [
    { id: '1', name: 'Csirkemell', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6 },
    { id: '2', name: 'Zabpehely', caloriesPer100g: 370, proteinPer100g: 13, carbsPer100g: 60, fatPer100g: 7 },
    { id: '3', name: 'Tojás', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11 },
    { id: '4', name: 'Barna rizs', caloriesPer100g: 360, proteinPer100g: 7.5, carbsPer100g: 76, fatPer100g: 2.7 },
    { id: '5', name: 'Lazac', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13 },
    { id: '6', name: 'Görög joghurt', caloriesPer100g: 97, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 5 },
    { id: '7', name: 'Édesburgonya', caloriesPer100g: 86, proteinPer100g: 1.6, carbsPer100g: 20, fatPer100g: 0.1 },
    { id: '8', name: 'Mandula', caloriesPer100g: 579, proteinPer100g: 21, carbsPer100g: 22, fatPer100g: 50 },
];

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

    const filtered = useMemo(() => {
        return mockFoods
            .filter((f) => {
                const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
                const matchesCalories =
                    f.caloriesPer100g >= calorieRange[0] &&
                    f.caloriesPer100g <= calorieRange[1];
                return matchesSearch && matchesCalories;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'name_asc': return a.name.localeCompare(b.name, 'hu');
                    case 'name_desc': return b.name.localeCompare(a.name, 'hu');
                    case 'calories_asc': return a.caloriesPer100g - b.caloriesPer100g;
                    case 'calories_desc': return b.caloriesPer100g - a.caloriesPer100g;
                    case 'protein_desc': return b.proteinPer100g - a.proteinPer100g;
                    default: return 0;
                }
            });
    }, [search, sortBy, calorieRange]);

    const isFiltered =
        search !== '' ||
        calorieRange[0] !== 0 ||
        calorieRange[1] !== 600;

    const handleReset = () => {
        setSearch('');
        setCalorieRange([0, 600]);
        setSortBy('name_asc');
    };

    const handleAdd = (id: string) => {
        // TODO: FoodSearchDialog / étkezés választó a 2. mérföldkőnél
        console.log('Hozzáadás:', id);
    };

    return (
        <Box component="section" aria-labelledby="foods-title">
            {/* Fejléc */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" id="foods-title" fontWeight={700}>
                    Élelmiszerek
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Keress az adatbázisban vagy adj hozzá ételt az étkezésedhez
                </Typography>
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
                            <MenuItem key={key} value={key}>
                                {sortLabels[key]}
                            </MenuItem>
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
                        <Chip
                            label="!"
                            size="small"
                            color="error"
                            sx={{ ml: 1, height: 18, fontSize: '0.65rem' }}
                        />
                    )}
                </Button>
            </Box>

            {/* Szűrő panel */}
            <Collapse in={showFilters} id="filter-panel">
                <Box
                    sx={{
                        p: 2,
                        mb: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'background.paper',
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
                        <Typography variant="caption" color="text.secondary">
                            {calorieRange[0]} kcal
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {calorieRange[1]} kcal
                        </Typography>
                    </Box>

                    {isFiltered && (
                        <Button size="small" onClick={handleReset} sx={{ mt: 1 }}>
                            Szűrők törlése
                        </Button>
                    )}
                </Box>
            </Collapse>

            {/* Találatok száma */}
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {filtered.length} élelmiszer találat
            </Typography>

            {/* Élelmiszer lista */}
            {filtered.length === 0 ? (
                <EmptyState
                    message="Nincs találat a megadott feltételekre"
                    subMessage="Próbálj más keresési feltételt, vagy töröld a szűrőket"
                    onAction={handleReset}
                    actionLabel="Szűrők törlése"
                />
            ) : (
                <Grid container spacing={2}>
                    {filtered.map((food) => (
                        <Grid key={food.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                            <FoodCard {...food} onAdd={handleAdd} />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}