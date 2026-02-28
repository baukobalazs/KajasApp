'use client';

import { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    Button,
    Stack,
    Divider,
    Alert,
} from '@mui/material';
import Link from 'next/link';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'A név kötelező';
        if (!email.trim()) newErrors.email = 'Az e-mail cím kötelező';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Érvénytelen e-mail cím';
        if (!password) newErrors.password = 'A jelszó kötelező';
        else if (password.length < 8) newErrors.password = 'A jelszó legalább 8 karakter legyen';
        if (password !== confirmPassword) newErrors.confirmPassword = 'A két jelszó nem egyezik';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);

        // TODO: API hívás a 3. mérföldkőnél
        console.log('Regisztráció:', { name, email, password });
        await new Promise((r) => setTimeout(r, 1000));
        setSuccess(true);
        setLoading(false);
    };

    if (success) {
        return (
            <Card>
                <CardContent sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        Sikeres regisztráció! 🎉
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        A fiókod létrejött. Most már bejelentkezhetsz.
                    </Typography>
                    <Button
                        component={Link}
                        href="/login"
                        variant="contained"
                        fullWidth
                        sx={{ minHeight: 44 }}
                    >
                        Bejelentkezés
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Regisztráció
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Hozd létre a fiókodat és kezdd el követni a táplálkozásodat.
                </Typography>

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="Teljes név"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            error={Boolean(errors.name)}
                            helperText={errors.name}
                            autoComplete="name"
                            required
                            inputProps={{ 'aria-required': 'true' }}
                        />
                        <TextField
                            label="E-mail cím"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            autoComplete="email"
                            required
                            inputProps={{ 'aria-required': 'true' }}
                        />
                        <TextField
                            label="Jelszó"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={Boolean(errors.password)}
                            helperText={errors.password || 'Minimum 8 karakter'}
                            autoComplete="new-password"
                            required
                            inputProps={{ 'aria-required': 'true' }}
                        />
                        <TextField
                            label="Jelszó megerősítése"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={Boolean(errors.confirmPassword)}
                            helperText={errors.confirmPassword}
                            autoComplete="new-password"
                            required
                            inputProps={{ 'aria-required': 'true' }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                            startIcon={<PersonAddIcon />}
                            aria-label="Regisztráció"
                            sx={{ minHeight: 44 }}
                        >
                            {loading ? 'Regisztráció...' : 'Regisztráció'}
                        </Button>
                    </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body2" textAlign="center" color="text.secondary">
                    Már van fiókod?{' '}
                    <Box
                        component={Link}
                        href="/login"
                        sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                        Jelentkezz be
                    </Box>
                </Typography>
            </CardContent>
        </Card>
    );
}