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
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -200,
                    right: -200,
                    width: 500,
                    height: 500,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(46,125,50,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -150,
                    left: -150,
                    width: 400,
                    height: 400,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,143,0,0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                },
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
                    e.currentTarget.style.borderRadius = '8px';
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
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Typography
                    sx={{ fontSize: '3rem', mb: 1, lineHeight: 1 }}
                    aria-hidden="true"
                >
                    🥗
                </Typography>
                <Typography
                    variant="h4"
                    fontWeight={800}
                    sx={{
                        background: 'linear-gradient(135deg, #2E7D32, #1B5E20)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                    aria-label="KajApp főoldal"
                >
                    KajApp
                </Typography>
            </Box>

            {/* Tartalom */}
            <Box
                id="main-content"
                component="main"
                tabIndex={-1}
                sx={{
                    width: '100%',
                    maxWidth: 440,
                    position: 'relative',
                    zIndex: 1,
                }}
            >
                {children}
            </Box>
        </Box>
    );
}