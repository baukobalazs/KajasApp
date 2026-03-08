'use client';

import { Box, Typography, Button } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
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
            <ErrorOutlineIcon
                sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
                aria-hidden="true"
            />
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Hiba történt
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
                Váratlan hiba lépett fel. Kérjük, próbáld újra.
            </Typography>
            <Button variant="contained" onClick={reset} size="large">
                Újrapróbálás
            </Button>
        </Box>
    );
}
