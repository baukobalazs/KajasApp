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
import { useRouter } from 'next/navigation';
import AddIcon from '@mui/icons-material/Add';
interface RecipeCardProps {
    id: string;
    name: string;
    description?: string;
    ingredientCount: number;
    totalCalories: number;
    onDelete: (id: string) => void;
    onAdd: (id: string) => void;
}

export default function RecipeCard({
    id,
    name,
    description,
    ingredientCount,
    totalCalories,
    onDelete,
    onAdd,
}: RecipeCardProps) {
    const router = useRouter();
    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer',
                '&:hover': { boxShadow: 4 },
            }}
            onClick={() => router.push(`/recipes/${id}`)}
            aria-label={`${name} recept megtekintése`}
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
                    <Link href={`/recipes/${id}/edit`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <IconButton aria-label={`${name} szerkesztése`} size="small" color="primary" sx={{ minWidth: 44, minHeight: 44 }}>
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Link>
                </Tooltip>
                <Tooltip title="Hozzáadás étkezéshez">
                    <IconButton
                        onClick={(e) => { e.stopPropagation(); onAdd(id); }}
                        aria-label={`${name} hozzáadása étkezéshez`}
                        size="small"
                        color="success"
                        sx={{ minWidth: 44, minHeight: 44 }}
                    >
                        <AddIcon fontSize="small" />
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