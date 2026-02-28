'use client';

import {
    Box,
    Typography,
    IconButton,
    TextField,
    Chip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

interface MealEntryRowProps {
    id: string;
    name: string;
    amountG: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    onDelete: (id: string) => void;
    onAmountChange: (id: string, amount: number) => void;
}

export default function MealEntryRow({
    id,
    name,
    amountG,
    calories,
    protein,
    carbs,
    fat,
    onDelete,
    onAmountChange,
}: MealEntryRowProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                py: 1.5,
                borderBottom: '1px solid',
                borderColor: 'divider',
                flexWrap: { xs: 'wrap', sm: 'nowrap' },
            }}
        >
            {/* Étel neve */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                    {name}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, flexWrap: 'wrap' }}>
                    <Chip label={`F: ${protein}g`} size="small" color="primary" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                    <Chip label={`Sz: ${carbs}g`} size="small" color="secondary" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                    <Chip label={`Zs: ${fat}g`} size="small" color="warning" variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                </Box>
            </Box>

            {/* Gramm input */}
            <TextField
                type="number"
                value={amountG}
                onChange={(e) => onAmountChange(id, Number(e.target.value))}
                size="small"
                inputProps={{
                    min: 1,
                    max: 9999,
                    'aria-label': `${name} mennyisége grammban`,
                }}
                InputProps={{ endAdornment: <Typography variant="caption">g</Typography> }}
                sx={{ width: 90 }}
            />

            {/* Kalória */}
            <Typography
                variant="body2"
                fontWeight={700}
                color="primary.main"
                sx={{ minWidth: 60, textAlign: 'right' }}
                aria-label={`${calories} kalória`}
            >
                {calories} kcal
            </Typography>

            {/* Törlés gomb */}
            <IconButton
                onClick={() => onDelete(id)}
                aria-label={`${name} törlése`}
                size="small"
                color="error"
                sx={{ minWidth: 44, minHeight: 44 }}
            >
                <DeleteIcon fontSize="small" />
            </IconButton>
        </Box>
    );
}