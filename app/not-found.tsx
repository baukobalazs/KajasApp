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
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -120,
                    right: -120,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(46,125,50,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                },
            }}
        >
            <Box
                sx={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                }}
            >
                <SentimentDissatisfiedIcon
                    sx={{ fontSize: 52, color: 'text.disabled' }}
                    aria-hidden="true"
                />
            </Box>
            <Typography
                variant="h1"
                fontWeight={800}
                sx={{
                    fontSize: '7rem',
                    lineHeight: 1,
                    background: 'linear-gradient(135deg, #2E7D32, #1B5E20)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}
            >
                404
            </Typography>
            <Typography variant="h5" fontWeight={600} gutterBottom>
                Az oldal nem található
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                A keresett oldal nem létezik vagy áthelyezték. Ellenőrizd az URL-t, vagy térj vissza a főoldalra.
            </Typography>
            <Link href="/dashboard" passHref>
                <Button
                    variant="contained"
                    size="large"
                    sx={{ minHeight: 44 }}
                    aria-label="Vissza a főoldalra"
                >
                    Vissza a főoldalra
                </Button>
            </Link>
        </Box>
    );
}