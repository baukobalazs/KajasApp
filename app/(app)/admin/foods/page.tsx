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
    Alert,
    Snackbar,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useFoods, useDeleteFood } from '@/lib/hooks/useApi';
import SkeletonLoader from '@/components/ui/SkeletonLoader';

type SortField = 'name' | 'caloriesPer100g' | 'proteinPer100g';
type SortOrder = 'asc' | 'desc';

export default function AdminFoodsPage() {
    const { data: foods, isLoading, error, mutate } = useFoods();
    const { trigger: deleteFood } = useDeleteFood();

    const [search, setSearch] = useState('');
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [toast, setToast] = useState('');
    const rowsPerPage = 10;

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        } else {
            setSortField(field);
            setSortOrder('asc');
        }
    };

    const foodToDelete = foods?.find((f: any) => f.id === deleteId);

    const handleDeleteConfirm = async () => {
        if (!deleteId) return;
        try {
            await deleteFood({ id: deleteId });
            await mutate();
            setDeleteId(null);
            setToast('Élelmiszer sikeresen törölve');
        } catch (err: any) {
            setToast(err.message || 'Hiba történt a törlés során');
        }
    };

    const filtered = (foods || [])
        .filter((f: any) => f.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a: any, b: any) => {
            const mult = sortOrder === 'asc' ? 1 : -1;
            if (sortField === 'name') return mult * a.name.localeCompare(b.name, 'hu');
            return mult * (Number(a[sortField]) - Number(b[sortField]));
        });

    const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    if (isLoading) return <SkeletonLoader type="list" />;

    return (
        <Box component="section" aria-labelledby="admin-title">
            {/* Fejléc */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" component="h1" id="admin-title" fontWeight={700}>
                        Élelmiszer adatbázis
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Admin panel — {foods?.length || 0} élelmiszer
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

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} role="alert">
                    Hiba történt az élelmiszerek betöltésekor.
                </Alert>
            )}

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
                            paginated.map((food: any) => (
                                <TableRow key={food.id} hover>
                                    <TableCell>{food.name}</TableCell>
                                    <TableCell align="right">{Number(food.caloriesPer100g).toFixed(0)} kcal</TableCell>
                                    <TableCell align="right">{Number(food.proteinPer100g || 0).toFixed(1)}g</TableCell>
                                    <TableCell align="right">{Number(food.carbsPer100g || 0).toFixed(1)}g</TableCell>
                                    <TableCell align="right">{Number(food.fatPer100g || 0).toFixed(1)}g</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={food.openfoodfactsId ? 'OpenFoodFacts' : 'Manuális'}
                                            size="small"
                                            color={food.openfoodfactsId ? 'default' : 'primary'}
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
                    rowsPerPageOptions={[10]}
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

            {/* Toast */}
            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={3000}
                onClose={() => setToast('')}
                message={toast}
                aria-live="polite"
            />
        </Box>
    );
}