'use client';

import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Box,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface RecipeCardProps {
    id: string;
    name: string;
    description?: string;
    ingredientCount: number;
    totalCalories: number;
    onDelete: (id: string) => void;
}

export default function RecipeCard({
    id,
    name,
    description,
    ingredientCount,
    totalCalories,
    onDelete,
}: RecipeCardProps) {
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
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                    <BookmarkIcon sx={{ color: 'primary.main', mt: 0.3, flexShrink: 0 }} aria-hidden="true" />
                    <Typography variant="body1" fontWeight={600} component="h2">
                        {name}
                    </Typography>
                </Box>

                {description && (
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mb: 1.5,
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {description}
                    </Typography>
                )}

                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                        label={`${ingredientCount} hozzávaló`}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={`${totalCalories} kcal`}
                        size="small"
                        color="secondary"
                        variant="outlined"
                    />
                </Box>
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                <Tooltip title="Szerkesztés">
                    <IconButton
                        component={Link}
                        href={`/recipes/${id}`}
                        aria-label={`${name} szerkesztése`}
                        size="small"
                        color="primary"
                        sx={{ minWidth: 44, minHeight: 44 }}
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Törlés">
                    <IconButton
                        onClick={() => onDelete(id)}
                        aria-label={`${name} törlése`}
                        size="small"
                        color="error"
                        sx={{ minWidth: 44, minHeight: 44 }}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}