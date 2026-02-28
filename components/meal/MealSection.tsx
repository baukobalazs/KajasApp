'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    Button,
    Collapse,
} from '@mui/material';
import { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import MealEntryRow from './MealEntryRow ';


export interface MealEntry {
    id: string;
    name: string;
    amountG: number;
    caloriesPer100g: number;
    proteinPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
}

interface MealSectionProps {
    type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    label: string;
    entries: MealEntry[];
    onAddFood: (mealType: string) => void;
    onDeleteEntry: (id: string) => void;
    onAmountChange: (id: string, amount: number) => void;
}

const mealColors = {
    breakfast: '#FF8F00',
    lunch: '#2E7D32',
    dinner: '#1565C0',
    snack: '#6A1B9A',
};

function calcNutrition(entry: MealEntry) {
    const factor = entry.amountG / 100;
    return {
        calories: Math.round(entry.caloriesPer100g * factor),
        protein: Math.round(entry.proteinPer100g * factor),
        carbs: Math.round(entry.carbsPer100g * factor),
        fat: Math.round(entry.fatPer100g * factor),
    };
}

export default function MealSection({
    type,
    label,
    entries,
    onAddFood,
    onDeleteEntry,
    onAmountChange,
}: MealSectionProps) {
    const [expanded, setExpanded] = useState(true);

    const totalCalories = entries.reduce((sum, e) => sum + calcNutrition(e).calories, 0);

    return (
        <Card>
            <CardContent sx={{ pb: '16px !important' }}>
                {/* Fejléc */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        mb: expanded ? 2 : 0,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box
                            sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                bgcolor: mealColors[type],
                                flexShrink: 0,
                            }}
                            aria-hidden="true"
                        />
                        <Typography variant="h6" component="h2" fontWeight={600}>
                            {label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {totalCalories} kcal
                        </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            startIcon={<AddIcon />}
                            size="small"
                            variant="outlined"
                            onClick={() => onAddFood(type)}
                            aria-label={`Étel hozzáadása a ${label.toLowerCase()}hoz`}
                            sx={{ minHeight: 44 }}
                        >
                            Hozzáadás
                        </Button>
                        <Button
                            size="small"
                            onClick={() => setExpanded(!expanded)}
                            aria-expanded={expanded}
                            aria-label={expanded ? `${label} összecsukása` : `${label} kinyitása`}
                            sx={{ minWidth: 44, minHeight: 44 }}
                        >
                            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </Button>
                    </Box>
                </Box>

                {/* Tételek */}
                <Collapse in={expanded}>
                    {entries.length === 0 ? (
                        <Box
                            sx={{
                                py: 3,
                                textAlign: 'center',
                                color: 'text.secondary',
                                border: '1px dashed',
                                borderColor: 'divider',
                                borderRadius: 2,
                            }}
                            role="status"
                            aria-live="polite"
                        >
                            <Typography variant="body2">
                                Még nincs étel hozzáadva
                            </Typography>
                        </Box>
                    ) : (
                        <Box role="list" aria-label={`${label} tételek`}>
                            {entries.map((entry) => {
                                const nutrition = calcNutrition(entry);
                                return (
                                    <Box key={entry.id} role="listitem">
                                        <MealEntryRow
                                            id={entry.id}
                                            name={entry.name}
                                            amountG={entry.amountG}
                                            calories={nutrition.calories}
                                            protein={nutrition.protein}
                                            carbs={nutrition.carbs}
                                            fat={nutrition.fat}
                                            onDelete={onDeleteEntry}
                                            onAmountChange={onAmountChange}
                                        />
                                    </Box>
                                );
                            })}
                        </Box>
                    )}
                </Collapse>
            </CardContent>
        </Card>
    );
}