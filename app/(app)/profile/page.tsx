'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CardContent,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Divider,
    Snackbar,
    Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { useProfile, useUpdateProfile } from '@/lib/hooks/useApi';

type Goal = 'loss' | 'maintain' | 'gain';

const goalOptions = [
    { value: 'loss', label: 'Fogyás', icon: <TrendingDownIcon /> },
    { value: 'maintain', label: 'Fenntartás', icon: <TrendingFlatIcon /> },
    { value: 'gain', label: 'Tömegnövelés', icon: <TrendingUpIcon /> },
];

export default function ProfilePage() {
    const { data: session } = useSession();
    const { data: profile, isLoading, mutate } = useProfile();
    const { trigger: updateProfile, isMutating } = useUpdateProfile();

    const [name, setName] = useState('');
    const [heightCm, setHeightCm] = useState(0);
    const [weightKg, setWeightKg] = useState(0);
    const [age, setAge] = useState(0);
    const [goal, setGoal] = useState<Goal>('maintain');
    const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
    const [proteinGoalG, setProteinGoalG] = useState(150);
    const [carbGoalG, setCarbGoalG] = useState(200);
    const [fatGoalG, setFatGoalG] = useState(65);
    const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Profil adatok betöltése a form mezőkbe
    useEffect(() => {
        if (profile) {
            setHeightCm(profile.heightCm || 0);
            setWeightKg(Number(profile.weightKg) || 0);
            setAge(profile.age || 0);
            setGoal(profile.goal || 'maintain');
            setDailyCalorieGoal(profile.dailyCalorieGoal || 2000);
            setProteinGoalG(profile.proteinGoalG || 150);
            setCarbGoalG(profile.carbGoalG || 200);
            setFatGoalG(profile.fatGoalG || 65);
        }
        if (session?.user?.name) setName(session.user.name);
    }, [profile, session]);

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'A név kötelező';
        if (heightCm && (heightCm < 100 || heightCm > 250)) newErrors.heightCm = '100–250 cm között legyen';
        if (weightKg && (weightKg < 30 || weightKg > 300)) newErrors.weightKg = '30–300 kg között legyen';
        if (age && (age < 10 || age > 120)) newErrors.age = '10–120 között legyen';
        if (dailyCalorieGoal < 500 || dailyCalorieGoal > 10000) newErrors.dailyCalorieGoal = '500–10000 kcal között legyen';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            await updateProfile({
                heightCm,
                weightKg,
                age,
                goal,
                dailyCalorieGoal,
                proteinGoalG,
                carbGoalG,
                fatGoalG,
            });
            await mutate();
            setToast({ message: 'Profil sikeresen mentve!', severity: 'success' });
        } catch (err: any) {
            setToast({ message: err.message || 'Hiba történt a mentés során', severity: 'error' });
        }
    };

    if (isLoading) return <SkeletonLoader type="form" />;

    return (
        <Box component="section" aria-labelledby="profile-title">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" id="profile-title" fontWeight={700}>
                    Profilom
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {session?.user?.email}
                </Typography>
            </Box>

            <Stack spacing={3}>
                {/* Személyes adatok */}
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <FitnessCenterIcon color="primary" aria-hidden="true" />
                            <Typography variant="h6" fontWeight={600}>Személyes adatok</Typography>
                        </Box>
                        <Stack spacing={2}>
                            <TextField
                                label="Név"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                error={Boolean(errors.name)}
                                helperText={errors.name}
                                required
                                inputProps={{ 'aria-required': 'true' }}
                            />
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    label="Magasság (cm)"
                                    type="number"
                                    value={heightCm || ''}
                                    onChange={(e) => setHeightCm(Number(e.target.value))}
                                    error={Boolean(errors.heightCm)}
                                    helperText={errors.heightCm}
                                    inputProps={{ min: 100, max: 250, 'aria-label': 'Magasság centiméterben' }}
                                    sx={{ flex: 1, minWidth: 140 }}
                                />
                                <TextField
                                    label="Testsúly (kg)"
                                    type="number"
                                    value={weightKg || ''}
                                    onChange={(e) => setWeightKg(Number(e.target.value))}
                                    error={Boolean(errors.weightKg)}
                                    helperText={errors.weightKg}
                                    inputProps={{ min: 30, max: 300, 'aria-label': 'Testsúly kilogrammban' }}
                                    sx={{ flex: 1, minWidth: 140 }}
                                />
                                <TextField
                                    label="Kor"
                                    type="number"
                                    value={age || ''}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    error={Boolean(errors.age)}
                                    helperText={errors.age}
                                    inputProps={{ min: 10, max: 120 }}
                                    sx={{ flex: 1, minWidth: 140 }}
                                />
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Cél */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Táplálkozási cél</Typography>
                        <ToggleButtonGroup
                            value={goal}
                            exclusive
                            onChange={(_, val) => val && setGoal(val)}
                            aria-label="Táplálkozási cél kiválasztása"
                            sx={{ flexWrap: 'wrap', gap: 1 }}
                        >
                            {goalOptions.map((opt) => (
                                <ToggleButton
                                    key={opt.value}
                                    value={opt.value}
                                    aria-label={opt.label}
                                    sx={{
                                        minHeight: 44, px: 3, gap: 1,
                                        borderRadius: '8px !important',
                                        border: '1px solid !important',
                                        borderColor: 'divider !important',
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.main', color: 'white',
                                            borderColor: 'primary.main !important',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                        },
                                    }}
                                >
                                    {opt.icon}{opt.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </CardContent>
                </Card>

                {/* Makró célok */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>Napi célok</Typography>
                        <Stack spacing={2}>
                            <TextField
                                label="Napi kalóriacél (kcal)"
                                type="number"
                                value={dailyCalorieGoal}
                                onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
                                error={Boolean(errors.dailyCalorieGoal)}
                                helperText={errors.dailyCalorieGoal}
                                inputProps={{ min: 500, max: 10000 }}
                            />
                            <Divider />
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <TextField
                                    label="Fehérje (g)" type="number" value={proteinGoalG}
                                    onChange={(e) => setProteinGoalG(Number(e.target.value))}
                                    inputProps={{ min: 0 }} sx={{ flex: 1, minWidth: 120 }}
                                />
                                <TextField
                                    label="Szénhidrát (g)" type="number" value={carbGoalG}
                                    onChange={(e) => setCarbGoalG(Number(e.target.value))}
                                    inputProps={{ min: 0 }} sx={{ flex: 1, minWidth: 120 }}
                                />
                                <TextField
                                    label="Zsír (g)" type="number" value={fatGoalG}
                                    onChange={(e) => setFatGoalG(Number(e.target.value))}
                                    inputProps={{ min: 0 }} sx={{ flex: 1, minWidth: 120 }}
                                />
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Mentés */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={isMutating}
                        sx={{ minHeight: 44 }}
                    >
                        {isMutating ? 'Mentés...' : 'Mentés'}
                    </Button>
                </Box>
            </Stack>

            {/* Toast */}
            <Snackbar
                open={Boolean(toast)}
                autoHideDuration={3000}
                onClose={() => setToast(null)}
            >
                <Alert severity={toast?.severity} onClose={() => setToast(null)} aria-live="polite">
                    {toast?.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}