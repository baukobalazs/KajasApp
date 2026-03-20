import { Box, Skeleton, Grid } from '@mui/material';

interface SkeletonLoaderProps {
    type: 'cards' | 'list' | 'form' | 'dashboard';
}

const skeletonSx = { borderRadius: '12px' };

export default function SkeletonLoader({ type }: SkeletonLoaderProps) {
    if (type === 'dashboard') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Skeleton variant="rounded" height={140} sx={skeletonSx} animation="wave" />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Skeleton variant="rounded" height={110} sx={{ flex: 1, ...skeletonSx }} animation="wave" />
                    <Skeleton variant="rounded" height={110} sx={{ flex: 1, ...skeletonSx }} animation="wave" />
                    <Skeleton variant="rounded" height={110} sx={{ flex: 1, ...skeletonSx }} animation="wave" />
                </Box>
                <Skeleton variant="rounded" height={220} sx={skeletonSx} animation="wave" />
            </Box>
        );
    }

    if (type === 'cards') {
        return (
            <Grid container spacing={2}>
                {[...Array(6)].map((_, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Skeleton variant="rounded" height={170} sx={skeletonSx} animation="wave" />
                    </Grid>
                ))}
            </Grid>
        );
    }

    if (type === 'list') {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} variant="rounded" height={72} sx={skeletonSx} animation="wave" />
                ))}
            </Box>
        );
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} variant="rounded" height={60} sx={skeletonSx} animation="wave" />
            ))}
        </Box>
    );
}