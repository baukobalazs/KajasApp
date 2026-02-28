'use client';

import { Box, useTheme, useMediaQuery } from '@mui/material';
import Navbar from './Navbar';

interface AppLayoutProps {
    children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* Skip to content link — accessibility */}
            <a
                href="#main-content"
                style={{
                    position: 'absolute',
                    left: '-9999px',
                    top: 'auto',
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
                    e.currentTarget.style.textDecoration = 'none';
                }}
                onBlur={(e) => {
                    e.currentTarget.style.left = '-9999px';
                    e.currentTarget.style.width = '1px';
                    e.currentTarget.style.height = '1px';
                }}
            >
                Ugrás a tartalomra
            </a>

            <Navbar />

            {/* Fő tartalom */}
            <Box
                id="main-content"
                component="main"
                tabIndex={-1}
                sx={{
                    flexGrow: 1,
                    px: { xs: 2, sm: 3, md: 4 },       // reszponzív padding
                    py: { xs: 2, sm: 3 },
                    // Mobilon helyet hagyunk az alsó navigációnak
                    pb: isMobile ? '72px' : undefined,
                    maxWidth: 1200,
                    width: '100%',
                    mx: 'auto',                          // középre igazítás
                }}
            >
                {children}
            </Box>
        </Box>
    );
}