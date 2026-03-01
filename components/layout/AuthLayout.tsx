'use client';
import { Box, Typography } from '@mui/material';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'background.default',
                px: 2,
                py: 4,
            }}
        >
            {/* Skip link */}
            <a
                href="#main-content"
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    width: 1,
                    height: 1,
                    overflow: 'hidden',
                }}
                onFocus={(e) => {
                    e.currentTarget.style.left = '16px';
                    e.currentTarget.style.top = '16px';
                    e.currentTarget.style.width = 'auto';
                    e.currentTarget.style.height = 'auto';
                    e.currentTarget.style.overflow = 'visible';
                    e.currentTarget.style.zIndex = '9999';
                    e.currentTarget.style.padding = '8px 16px';
                    e.currentTarget.style.background = '#2E7D32';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.borderRadius = '4px';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.left = '-9999px';
                    e.currentTarget.style.width = '1px';
                    e.currentTarget.style.height = '1px';
                }}
            >
                Ugrás a tartalomra
            </a>

            {/* Logo */}
            <Typography
                variant="h4"
                fontWeight={700}
                color="primary.main"
                sx={{ mb: 4 }}
                aria-label="KajApp főoldal"
            >
                🥗 KajApp
            </Typography>

            {/* Tartalom */}
            <Box
                id="main-content"
                component="main"
                tabIndex={-1}
                sx={{
                    width: '100%',
                    maxWidth: 440,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}