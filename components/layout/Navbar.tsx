'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    BottomNavigation,
    BottomNavigationAction,
    IconButton,
    Avatar,
    useMediaQuery,
    useTheme,
    Menu,
    MenuItem,
    Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
    { label: 'Napló', href: '/log', icon: <MenuBookIcon /> },
    { label: 'Ételek', href: '/foods', icon: <SearchIcon /> },
    { label: 'Receptek', href: '/recipes', icon: <BookmarkIcon /> },
];

// TODO: valódi user adatok NextAuth session-ből
const mockUser = {
    name: 'Teszt Felhasználó',
    email: 'teszt@example.com',
    role: 'admin',
};

export default function Navbar() {
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const today = new Date().toISOString().split('T')[0];

    const getActiveIndex = () => {
        if (pathname === '/dashboard') return 0;
        if (pathname.startsWith('/log')) return 1;
        if (pathname.startsWith('/foods')) return 2;
        if (pathname.startsWith('/recipes')) return 3;
        return 0;
    };

    const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // ── Mobil: alsó tab bar ───────────────────────────────────────
    if (isMobile) {
        return (
            <Box
                component="nav"
                aria-label="Főnavigáció"
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: theme.zIndex.appBar,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                }}
            >
                <BottomNavigation value={getActiveIndex()} showLabels>
                    {navItems.map((item, index) => (
                        <BottomNavigationAction
                            key={item.href}
                            label={item.label}
                            icon={item.icon}
                            component={Link}
                            href={item.href === '/log' ? `/log/${today}` : item.href}
                            value={index}
                            aria-label={item.label}
                            sx={{
                                minWidth: 44,
                                '&.Mui-selected': {
                                    color: 'primary.main',
                                },
                            }}
                        />
                    ))}
                </BottomNavigation>
            </Box>
        );
    }

    // ── Desktop: felső AppBar ─────────────────────────────────────
    return (
        <>
            <AppBar
                position="fixed"
                color="inherit"
                component="header"
                sx={{ bgcolor: 'background.paper' }}
            >
                <Toolbar>
                    {/* Logo */}
                    <Typography
                        variant="h6"
                        component={Link}
                        href="/dashboard"
                        aria-label="KajApp főoldal"
                        sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                            fontWeight: 700,
                            mr: 4,
                        }}
                    >
                        🥗 KajApp
                    </Typography>

                    {/* Navigációs linkek */}
                    <Box
                        component="nav"
                        aria-label="Főnavigáció"
                        sx={{ display: 'flex', gap: 1, flexGrow: 1 }}
                    >
                        {navItems.map((item) => {
                            const href = item.href === '/log' ? `/log/${today}` : item.href;
                            const isActive =
                                item.href === '/dashboard'
                                    ? pathname === '/dashboard'
                                    : pathname.startsWith(item.href);

                            return (
                                <Box
                                    key={item.href}
                                    component={Link}
                                    href={href}
                                    aria-current={isActive ? 'page' : undefined}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        px: 2,
                                        py: 1,
                                        borderRadius: 2,
                                        textDecoration: 'none',
                                        color: isActive ? 'primary.main' : 'text.secondary',
                                        bgcolor: isActive ? 'primary.light' + '20' : 'transparent',
                                        fontWeight: isActive ? 600 : 400,
                                        fontSize: '0.9rem',
                                        minHeight: 44,
                                        transition: 'all 0.15s',
                                        '&:hover': {
                                            bgcolor: 'action.hover',
                                            color: 'primary.main',
                                        },
                                        '&:focus-visible': {
                                            outline: '2px solid',
                                            outlineColor: 'primary.main',
                                            outlineOffset: 2,
                                        },
                                    }}
                                >
                                    {item.icon}
                                    {item.label}
                                </Box>
                            );
                        })}
                    </Box>

                    {/* Admin link (csak adminoknak) */}
                    {mockUser.role === 'admin' && (
                        <IconButton
                            component={Link}
                            href="/admin/foods"
                            aria-label="Admin panel"
                            sx={{ mr: 1 }}
                        >
                            <AdminPanelSettingsIcon />
                        </IconButton>
                    )}

                    {/* Avatar + dropdown menü */}
                    <IconButton
                        onClick={handleAvatarClick}
                        aria-label="Felhasználói menü megnyitása"
                        aria-controls="user-menu"
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorEl)}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                fontSize: '0.875rem',
                            }}
                        >
                            {mockUser.name.charAt(0)}
                        </Avatar>
                    </IconButton>

                    <Menu
                        id="user-menu"
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    >
                        <MenuItem disabled>
                            <Box>
                                <Typography variant="body2" fontWeight={600}>
                                    {mockUser.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {mockUser.email}
                                </Typography>
                            </Box>
                        </MenuItem>
                        <Divider />
                        <MenuItem
                            component={Link}
                            href="/profile"
                            onClick={handleMenuClose}
                            aria-label="Profil oldal"
                        >
                            <PersonIcon sx={{ mr: 1, fontSize: 20 }} />
                            Profil
                        </MenuItem>
                        <MenuItem
                            onClick={handleMenuClose}
                            aria-label="Kijelentkezés"
                            sx={{ color: 'error.main' }}
                        >
                            <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
                            Kijelentkezés
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            {/* Toolbar spacer — hogy a tartalom ne csússzon a fixed AppBar alá */}
            <Toolbar />
        </>
    );
}