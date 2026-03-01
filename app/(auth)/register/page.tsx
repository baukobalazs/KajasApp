'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState('');
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
        setServerError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setServerError(data.error || 'Ismeretlen hiba történt');
                setLoading(false);
                return;
            }

            // Sikeres regisztráció → átirányítás a login oldalra
            router.push('/login?registered=true');

        } catch {
            setServerError('Hálózati hiba, próbáld újra később');
            setLoading(false);
        }
    };

    return (
        <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Regisztráció
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Hozd létre a fiókodat és kezdd el követni a táplálkozásodat.
                </Typography>

                {serverError && (
                    <Alert severity="error" sx={{ mb: 2 }} role="alert">
                        {serverError}
                    </Alert>
                )}

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