import { Box, Typography, Button } from '@mui/material';
import Link from 'next/link';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

export default function NotFound() {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                px: 3,
                bgcolor: 'background.default',
            }}
        >
            <SentimentDissatisfiedIcon
                sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }}
                aria-hidden="true"
            />
            <Typography variant="h1" fontWeight={700} color="primary.main" sx={{ fontSize: '6rem', lineHeight: 1 }}>
                404
            </Typography>
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Az oldal nem található
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                A keresett oldal nem létezik vagy áthelyezték. Ellenőrizd az URL-t, vagy térj vissza a főoldalra.
            </Typography>
            <Button
                component={Link}
                href="/dashboard"
                variant="contained"
                size="large"
                sx={{ minHeight: 44 }}
                aria-label="Vissza a főoldalra"
            >
                Vissza a főoldalra
            </Button>
        </Box>
    );
}