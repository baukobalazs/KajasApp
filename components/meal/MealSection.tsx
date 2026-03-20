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
import MealEntryRow from './MealEntryRow';


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
    breakfast: { dot: '#FF8F00', bg: 'rgba(255,143,0,0.06)' },
    lunch: { dot: '#2E7D32', bg: 'rgba(46,125,50,0.06)' },
    dinner: { dot: '#1565C0', bg: 'rgba(21,101,192,0.06)' },
    snack: { dot: '#6A1B9A', bg: 'rgba(106,27,154,0.06)' },
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
        <Card sx={{ bgcolor: mealColors[type].bg, borderColor: `${mealColors[type].dot}20` }}>
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 10,
                                height: 10,
                                borderRadius: '50%',
                                bgcolor: mealColors[type].dot,
                                flexShrink: 0,
                                boxShadow: `0 0 0 3px ${mealColors[type].dot}30`,
                            }}
                            aria-hidden="true"
                        />
                        <Typography variant="h6" component="h2" fontWeight={700}>
                            {label}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" fontWeight={500}>
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