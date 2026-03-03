import { Box, Skeleton, Grid } from '@mui/material';

interface SkeletonLoaderProps {
    type: 'cards' | 'list' | 'form' | 'dashboard';
}

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
    if (type === 'dashboard') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Skeleton variant="rounded" height={120} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="rounded" height={100} sx={{ flex: 1 }} />
                    <Skeleton variant="rounded" height={100} sx={{ flex: 1 }} />
                    <Skeleton variant="rounded" height={100} sx={{ flex: 1 }} />
                </Box>
                <Skeleton variant="rounded" height={200} />
            </Box>
        );
    }

    if (type === 'cards') {
        return (
            <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Skeleton variant="rounded" height={160} />
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (type === 'list') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={64} />
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rounded" height={56} />
            ))}
        </Box>
    );
}