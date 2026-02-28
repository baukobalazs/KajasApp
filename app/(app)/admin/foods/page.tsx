'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
    Paper,
    IconButton,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Chip,
    Tooltip,
    TablePagination,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

interface Food {
    id: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    source: 'manual' | 'openfoodfacts';
}

// TODO: valódi adatok a 2. mérföldkőnél
const mockFoods: Food[] = [
    { id: '1', name: 'Csirkemell', caloriesPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, source: 'manual' },
    { id: '2', name: 'Zabpehely', caloriesPer100g: 370, proteinPer100g: 13, carbsPer100g: 60, fatPer100g: 7, source: 'openfoodfacts' },
    { id: '3', name: 'Tojás', caloriesPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, source: 'manual' },
    { id: '4', name: 'Barna rizs', caloriesPer100g: 360, proteinPer100g: 7.5, carbsPer100g: 76, fatPer100g: 2.7, source: 'openfoodfacts' },
    { id: '5', name: 'Lazac', caloriesPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, source: 'manual' },
    { id: '6', name: 'Görög joghurt', caloriesPer100g: 97, proteinPer100g: 10, carbsPer100g: 3.6, fatPer100g: 5, source: 'openfoodfacts' },
];

type SortField = 'name' | 'caloriesPer100g' | 'proteinPer100g';
type SortOrder = 'asc' | 'desc';

export default function AdminFoodsPage() {
    const [foods, setFoods] = useState<Food[]>(mockFoods);
    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const filtered = foods
        .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            const mult = sortOrder === 'asc' ? 1 : -1;
            if (sortField === 'name') return mult * a.name.localeCompare(b.name, 'hu');
            return mult * (a[sortField] - b[sortField]);
        });

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const foodToDelete = foods.find((f) => f.id === deleteId);

    const handleDeleteConfirm = () => {
        if (deleteId) {
            setFoods((prev) => prev.filter((f) => f.id !== deleteId));
            setDeleteId(null);
        }
    };

    return (
        <Box component="section" aria-labelledby="admin-title">
            {/* Fejléc */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" id="admin-title" fontWeight={700}>
                        Élelmiszer adatbázis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Admin panel — {foods.length} élelmiszer
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    aria-label="Új élelmiszer hozzáadása"
                    sx={{ minHeight: 44 }}
                    onClick={() => console.log('TODO: FoodFormDialog')}
                >
                    Új élelmiszer
                </Button>
            </Box>

            {/* Kereső */}
            <TextField
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(0); }}
                placeholder="Keresés név szerint..."
                size="small"
                sx={{ mb: 2, maxWidth: 400 }}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon aria-hidden="true" />
                        </InputAdornment>
                    ),
                }}
                inputProps={{ 'aria-label': 'Élelmiszer keresése' }}
            />

            {/* Táblázat */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                <Table aria-label="Élelmiszer adatbázis táblázat">
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'action.hover' }}>
                            <TableCell>
                                <TableSortLabel
                                    active={sortField === 'name'}
                                    direction={sortField === 'name' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('name')}
                                >
                                    Név
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortField === 'caloriesPer100g'}
                                    direction={sortField === 'caloriesPer100g' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('caloriesPer100g')}
                                >
                                    Kalória
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">
                                <TableSortLabel
                                    active={sortField === 'proteinPer100g'}
                                    direction={sortField === 'proteinPer100g' ? sortOrder : 'asc'}
                                    onClick={() => handleSort('proteinPer100g')}
                                >
                                    Fehérje
                                </TableSortLabel>
                            </TableCell>
                            <TableCell align="right">Szénhidrát</TableCell>
                            <TableCell align="right">Zsír</TableCell>
                            <TableCell align="center">Forrás</TableCell>
                            <TableCell align="right">Műveletek</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginated.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                                    Nincs találat
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginated.map((food) => (
                                <TableRow key={food.id} hover>
                                    <TableCell>{food.name}</TableCell>
                                    <TableCell align="right">{food.caloriesPer100g} kcal</TableCell>
                                    <TableCell align="right">{food.proteinPer100g}g</TableCell>
                                    <TableCell align="right">{food.carbsPer100g}g</TableCell>
                                    <TableCell align="right">{food.fatPer100g}g</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={food.source === 'manual' ? 'Manuális' : 'OpenFoodFacts'}
                                            size="small"
                                            color={food.source === 'manual' ? 'primary' : 'default'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Szerkesztés">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                aria-label={`${food.name} szerkesztése`}
                                                sx={{ minWidth: 44, minHeight: 44 }}
                                                onClick={() => console.log('TODO: FoodFormDialog', food.id)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Törlés">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                aria-label={`${food.name} törlése`}
                                                sx={{ minWidth: 44, minHeight: 44 }}
                                                onClick={() => setDeleteId(food.id)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={filtered.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5]}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    labelDisplayedRows={({ from, to, count }) => `${from}–${to} / ${count}`}
                />
            </TableContainer>

            {/* Törlés dialógus */}
            <Dialog
                open={Boolean(deleteId)}
                onClose={() => setDeleteId(null)}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-desc"
            >
                <DialogTitle id="delete-dialog-title">Élelmiszer törlése</DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-desc">
                        Biztosan törölni szeretnéd: <strong>{foodToDelete?.name}</strong>?
                        Ez a művelet nem vonható vissza.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteId(null)}>Mégsem</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Törlés
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}