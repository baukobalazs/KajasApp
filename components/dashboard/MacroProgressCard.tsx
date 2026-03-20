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

const colorMap = {
    primary: { bg: 'rgba(46, 125, 50, 0.08)', accent: '#2E7D32' },
    secondary: { bg: 'rgba(255, 143, 0, 0.08)', accent: '#FF8F00' },
    warning: { bg: 'rgba(245, 127, 23, 0.08)', accent: '#F57F17' },
    error: { bg: 'rgba(198, 40, 40, 0.08)', accent: '#C62828' },
    success: { bg: 'rgba(46, 125, 50, 0.08)', accent: '#2E7D32' },
};

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
    const colors = colorMap[color] || colorMap.primary;

    return (
        <Card sx={{ position: 'relative', overflow: 'visible' }}>
            <CardContent sx={{ p: 2.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: '0.3px', fontSize: '0.7rem' }}>
                        {label}
                    </Typography>
                    <Chip
                        label={isOver ? 'Túllépve!' : `${remaining}${unit} maradt`}
                        size="small"
                        color={isOver ? 'error' : 'default'}
                        variant={isOver ? 'filled' : 'outlined'}
                        sx={{ fontSize: '0.65rem', height: 22 }}
                    />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0.5, mb: 1.5 }}>
                    <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: isOver ? 'error.main' : colors.accent, lineHeight: 1 }}>
                        {current}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        / {goal} {unit}
                    </Typography>
                </Box>

                <Box sx={{ position: 'relative' }}>
                    <LinearProgress
                        variant="determinate"
                        value={percentage}
                        color={isOver ? 'error' : color}
                        aria-label={`${label}: ${current} / ${goal} ${unit}`}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: isOver ? 'rgba(198,40,40,0.1)' : colors.bg,
                            '& .MuiLinearProgress-bar': {
                                borderRadius: 4,
                                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                            },
                        }}
                    />
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ position: 'absolute', right: 0, top: 12, fontSize: '0.65rem' }}
                    >
                        {percentage}%
                    </Typography>
                </Box>
            </CardContent>
        </Card>
    );
}