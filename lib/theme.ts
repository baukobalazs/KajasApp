'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    // ── Színrendszer ──────────────────────────────────────────────
    palette: {
        primary: {
            light: '#60ad5e',
            main: '#2E7D32',   // Zöld — egészség, táplálkozás
            dark: '#005005',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#ffc046',
            main: '#FF8F00',   // Narancs — kalória, energia
            dark: '#c56000',
            contrastText: '#000000',
        },
        error: {
            main: '#C62828',
        },
        warning: {
            main: '#F57F17',
        },
        success: {
            main: '#2E7D32',
        },
        background: {
            default: '#F5F5F5',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#616161',
        },
    },

    // ── Tipográfia ────────────────────────────────────────────────
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.25rem',
            fontWeight: 700,
            lineHeight: 1.2,
        },
        h2: {
            fontSize: '1.875rem',
            fontWeight: 700,
            lineHeight: 1.3,
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
            lineHeight: 1.4,
        },
        h5: {
            fontSize: '1.125rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.5,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },
        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.5,
        },
    },

    // ── Breakpointok ──────────────────────────────────────────────
    breakpoints: {
        values: {
            xs: 0,      // mobil
            sm: 600,    // tablet
            md: 900,    // kis desktop
            lg: 1200,   // desktop
            xl: 1536,   // nagy képernyő
        },
    },

    // ── Spacing (8px alap) ────────────────────────────────────────
    spacing: 8,

    // ── Alakzatok (border-radius tokenek) ─────────────────────────
    shape: {
        borderRadius: 8,
    },

    // ── Komponens szintű overrides ────────────────────────────────
    components: {
        // Gombok
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',   // Ne legyen csupa nagybetű
                    fontWeight: 600,
                    minHeight: 44,           // Touch-barát méret (44x44px)
                    paddingLeft: 20,
                    paddingRight: 20,
                },
            },
            defaultProps: {
                disableElevation: true,
            },
        },

        // Icon gombok — touch-barát méret
        MuiIconButton: {
            styleOverrides: {
                root: {
                    minWidth: 44,
                    minHeight: 44,
                },
            },
        },

        // Kártyák
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08), 0 2px 12px rgba(0,0,0,0.04)',
                },
            },
        },

        // Input mezők
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                fullWidth: true,
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 8,
                        minHeight: 44,
                    },
                },
            },
        },

        // Chip-ek (makró badge-ekhez)
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 6,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                },
            },
        },

        // Dialog (modal ablakok)
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                },
            },
        },

        // AppBar (navbar)
        MuiAppBar: {
            defaultProps: {
                elevation: 0,
            },
            styleOverrides: {
                root: {
                    borderBottom: '1px solid #E0E0E0',
                },
            },
        },

        // Lista elemek
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    minHeight: 44,
                },
            },
        },

        // Fókusz láthatóság (accessibility)
        MuiButtonBase: {
            defaultProps: {
                disableRipple: false,
            },
        },
    },
});

export default theme;