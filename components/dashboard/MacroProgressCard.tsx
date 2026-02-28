'use client';

import {
    Card,
    CardContent,
    Typography,
    Box,
    LinearProgress,
    Chip,
} from '@mui/material';

interface MacroProgressCardProps {
    label: string;
    current: number;
    goal: number;
    unit: string;
    color: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
}

export default function MacroProgressCard({
    label,
    current,
    goal,
    unit,
    color,
}: MacroProgressCardProps) {
    const percentage = Math.min(Math.round((current / goal) * 100), 100);
    const remaining = Math.max(goal - current, 0);
    const isOver = current > goal;

    return (
        <Card>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {label}
                    </Typography>
                    <Chip
                        label={isOver ? 'Túllépve' : `${remaining}${unit} maradt`}
                        size="small"
                        color={isOver ? 'error' : 'default'}
                        sx={{ fontSize: '0.7rem' }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1 }}>
                    <Typography variant="h5" fontWeight={700} color={`${color}.main`}>
                        {current}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        / {goal} {unit}
                    </Typography>
                </Box>

                <LinearProgress
                    variant="determinate"
                    value={percentage}
                    color={isOver ? 'error' : color}
                    aria-label={`${label}: ${current} / ${goal} ${unit}`}
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: 'action.hover',
                    }}
                />
            </CardContent>
        </Card>
    );
}