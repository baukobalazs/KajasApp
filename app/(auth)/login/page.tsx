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
import LoginIcon from '@mui/icons-material/Login';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    const validate = () => {
        const newErrors: { email?: string; password?: string } = {};
        if (!email.trim()) newErrors.email = 'Az e-mail cím kötelező';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Érvénytelen e-mail cím';
        if (!password) newErrors.password = 'A jelszó kötelező';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setError('');

        // TODO: NextAuth signIn a 3. mérföldkőnél
        console.log('Bejelentkezés:', { email, password });
        await new Promise((r) => setTimeout(r, 1000));
        setError('Hibás e-mail cím vagy jelszó.');
        setLoading(false);
    };

    return (
        <Card>
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Bejelentkezés
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Üdvözlünk vissza! Add meg az adataidat.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} role="alert">
                        {error}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <Stack spacing={2}>
                        <TextField
                            label="E-mail cím"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={Boolean(errors.email)}
                            helperText={errors.email}
                            autoComplete="email"
                            required
                            inputProps={{
                                'aria-required': 'true',
                                'aria-describedby': errors.email ? 'email-error' : undefined,
                            }}
                        />
                        <TextField
                            label="Jelszó"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={Boolean(errors.password)}
                            helperText={errors.password}
                            autoComplete="current-password"
                            required
                            inputProps={{
                                'aria-required': 'true',
                                'aria-describedby': errors.password ? 'password-error' : undefined,
                            }}
                        />

                        <Button
                            type="submit"
                            variant="contained"
                            size="large"
                            fullWidth
                            disabled={loading}
                            startIcon={<LoginIcon />}
                            aria-label="Bejelentkezés"
                            sx={{ minHeight: 44 }}
                        >
                            {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
                        </Button>
                    </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="body2" textAlign="center" color="text.secondary">
                    Még nincs fiókod?{' '}
                    <Box
                        component={Link}
                        href="/register"
                        sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                    >
                        Regisztrálj itt
                    </Box>
                </Typography>
            </CardContent>
        </Card>
    );
}