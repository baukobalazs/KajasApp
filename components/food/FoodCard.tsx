'use client';

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    Button,
    Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

interface FoodCardProps {
    id: string;
    name: string;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    onAdd?: (id: string) => void;
}

export default function FoodCard({
    id,
    name,
    caloriesPer100g,
    proteinPer100g,
    carbsPer100g,
    fatPer100g,
    onAdd,
}: FoodCardProps) {
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: 4 },
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body1" fontWeight={600} gutterBottom noWrap title={name}>
                    {name}
                </Typography>

                {/* Kalória */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                    <LocalFireDepartmentIcon sx={{ fontSize: 16, color: 'secondary.main' }} aria-hidden="true" />
                    <Typography variant="h6" fontWeight={700} color="secondary.main">
                        {caloriesPer100g}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                        kcal / 100g
                    </Typography>
                </Box>

                {/* Makrók */}
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    <Tooltip title="Fehérje">
                        <Chip
                            label={`F ${proteinPer100g}g`}
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                        />
                    </Tooltip>
                    <Tooltip title="Szénhidrát">
                        <Chip
                            label={`Sz ${carbsPer100g}g`}
                            size="small"
                            color="secondary"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                        />
                    </Tooltip>
                    <Tooltip title="Zsír">
                        <Chip
                            label={`Zs ${fatPer100g}g`}
                            size="small"
                            color="warning"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem' }}
                        />
                    </Tooltip>
                </Box>
            </CardContent>

            {onAdd && (
                <CardActions sx={{ pt: 0 }}>
                    <Button
                        startIcon={<AddIcon />}
                        size="small"
                        fullWidth
                        variant="outlined"
                        onClick={() => onAdd(id)}
                        aria-label={`${name} hozzáadása étkezéshez`}
                        sx={{ minHeight: 44 }}
                    >
                        Hozzáadás
                    </Button>
                </CardActions>
            )}
        </Card>
    );
}