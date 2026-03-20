'use client';

import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
    // ── Színrendszer ──────────────────────────────────────────────
    palette: {
        primary: {
            light: '#66BB6A',
            main: '#2E7D32',   // Zöld — egészség, táplálkozás
            dark: '#1B5E20',
            contrastText: '#ffffff',
        },
        secondary: {
            light: '#FFB74D',
            main: '#FF8F00',   // Narancs — kalória, energia
            dark: '#E65100',
            contrastText: '#000000',
        },
        error: {
            light: '#EF5350',
            main: '#C62828',
        },
        warning: {
            light: '#FFD54F',
            main: '#F57F17',
        },
        success: {
            light: '#66BB6A',
            main: '#2E7D32',
        },
        info: {
            light: '#4FC3F7',
            main: '#0288D1',
        },
        background: {
            default: '#F8F9FA',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A2E',
            secondary: '#5F6368',
        },
        divider: '#E8EAED',
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
        borderRadius: 12,
    },

    // ── Komponens szintű overrides ────────────────────────────────
    components: {
        // Gombok
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: 44,
                    paddingLeft: 20,
                    paddingRight: 20,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                },
                contained: {
                    boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
                        transform: 'translateY(-1px)',
                    },
                },
                outlined: {
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
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
                    transition: 'all 0.2s ease',
                },
            },
        },

        // Kártyák
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: '1px solid',
                    borderColor: '#E8EAED',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                        boxShadow: '0 8px 24px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
                        borderColor: '#D1D5DB',
                    },
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
                        borderRadius: 10,
                        minHeight: 44,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: '#2E7D32',
                            },
                        },
                    },
                },
            },
        },

        // Chip-ek (makró badge-ekhez)
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                },
            },
        },

        // Dialog (modal ablakok)
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 20,
                    boxShadow: '0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.08)',
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
                    borderBottom: '1px solid #E8EAED',
                    backdropFilter: 'blur(12px)',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                },
            },
        },

        // LinearProgress
        MuiLinearProgress: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    height: 8,
                },
            },
        },

        // Lista elemek
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    minHeight: 44,
                },
            },
        },

        // Alert
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                },
            },
        },

        // Fókusz láthatóság (accessibility)
        MuiButtonBase: {
            defaultProps: {
                disableRipple: false,
            },
        },

        // Snackbar
        MuiSnackbar: {
            defaultProps: {
                anchorOrigin: { vertical: 'bottom', horizontal: 'center' },
            },
        },

        // ToggleButton
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },

        // TableCell
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    color: '#5F6368',
                },
            },
        },
    },
});

export default theme;