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
    Slider,
    Chip,
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

const templates = [
    { label: 'Általános', protein: 30, carb: 45, fat: 25 },
    { label: 'Magas fehérje', protein: 40, carb: 30, fat: 30 },
    { label: 'Fogyás', protein: 35, carb: 40, fat: 25 },
    { label: 'Tömegnövelés', protein: 25, carb: 50, fat: 25 },
];

function calcMacros(kcal: number, proteinPct: number, carbPct: number, fatPct: number) {
    return {
        protein: Math.round((kcal * proteinPct / 100) / 4),
        carbs: Math.round((kcal * carbPct / 100) / 4),
        fat: Math.round((kcal * fatPct / 100) / 9),
    };
}

export default function ProfilePage() {
    const { data: session } = useSession();
    const { data: profile, isLoading, mutate } = useProfile();
    const { trigger: updateProfile, isMutating } = useUpdateProfile();

    const [name, setName] = useState('');
    const [heightCm, setHeightCm] = useState<string>('');
    const [weightKg, setWeightKg] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [goal, setGoal] = useState<Goal>('maintain');

    const [dailyCalorieGoal, setDailyCalorieGoal] = useState<string>('');
    const [proteinGoalG, setProteinGoalG] = useState<string>('');
    const [carbGoalG, setCarbGoalG] = useState<string>('');
    const [fatGoalG, setFatGoalG] = useState<string>('');

    const [proteinPct, setProteinPct] = useState(30);
    const [carbPct, setCarbPct] = useState(45);
    const [fatPct, setFatPct] = useState(25);

    const [toast, setToast] = useState<{ message: string; severity: 'success' | 'error' } | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const pctTotal = proteinPct + carbPct + fatPct;
    const kcal = Number(dailyCalorieGoal);
    const canSave = pctTotal === 100 && kcal > 0;

    // Profil betöltése
    useEffect(() => {
        if (profile) {
            setHeightCm(profile.heightCm ? String(profile.heightCm) : '');
            setWeightKg(profile.weightKg ? String(Number(profile.weightKg)) : '');
            setAge(profile.age ? String(profile.age) : '');
            setGoal(profile.goal || 'maintain');
            setDailyCalorieGoal(profile.dailyCalorieGoal ? String(profile.dailyCalorieGoal) : '');
            setProteinGoalG(profile.proteinGoalG ? String(profile.proteinGoalG) : '');
            setCarbGoalG(profile.carbGoalG ? String(profile.carbGoalG) : '');
            setFatGoalG(profile.fatGoalG ? String(profile.fatGoalG) : '');
        }
        if (session?.user?.name) setName(session.user.name);
    }, [profile, session]);

    // Újraszámolja a makrókat az aktuális értékekből
    const recalc = (
        newKcal: number,
        newProteinPct: number,
        newCarbPct: number,
        newFatPct: number
    ) => {
        if (!newKcal || newKcal <= 0 || newProteinPct + newCarbPct + newFatPct !== 100) return;
        const { protein, carbs, fat } = calcMacros(newKcal, newProteinPct, newCarbPct, newFatPct);
        setProteinGoalG(String(protein));
        setCarbGoalG(String(carbs));
        setFatGoalG(String(fat));
    };

    const handleCalorieChange = (val: string) => {
        setDailyCalorieGoal(val);
        recalc(Number(val), proteinPct, carbPct, fatPct);
    };

    const handleProteinPct = (_: Event, val: number | number[]) => {
        const v = val as number;
        setProteinPct(v);
        recalc(kcal, v, carbPct, fatPct);
    };

    const handleCarbPct = (_: Event, val: number | number[]) => {
        const v = val as number;
        setCarbPct(v);
        recalc(kcal, proteinPct, v, fatPct);
    };

    const handleFatPct = (_: Event, val: number | number[]) => {
        const v = val as number;
        setFatPct(v);
        recalc(kcal, proteinPct, carbPct, v);
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'A név kötelező';
        if (heightCm && (Number(heightCm) < 100 || Number(heightCm) > 250)) newErrors.heightCm = '100–250 cm között legyen';
        if (weightKg && (Number(weightKg) < 30 || Number(weightKg) > 300)) newErrors.weightKg = '30–300 kg között legyen';
        if (age && (Number(age) < 10 || Number(age) > 120)) newErrors.age = '10–120 között legyen';
        if (!dailyCalorieGoal || Number(dailyCalorieGoal) < 500 || Number(dailyCalorieGoal) > 10000) {
            newErrors.dailyCalorieGoal = '500–10000 kcal között legyen';
        }
        if (pctTotal !== 100) newErrors.pct = 'A makrók összege 100% kell legyen';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validate()) return;
        try {
            await updateProfile({
                heightCm: heightCm ? Number(heightCm) : null,
                weightKg: weightKg ? Number(weightKg) : null,
                age: age ? Number(age) : null,
                goal,
                dailyCalorieGoal: Number(dailyCalorieGoal),
                proteinGoalG: Number(proteinGoalG),
                carbGoalG: Number(carbGoalG),
                fatGoalG: Number(fatGoalG),
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
                                    value={heightCm}
                                    onChange={(e) => setHeightCm(e.target.value)}
                                    error={Boolean(errors.heightCm)}
                                    helperText={errors.heightCm || 'Opcionális'}
                                    inputProps={{ min: 100, max: 250 }}
                                    sx={{ flex: 1, minWidth: 140 }}
                                />
                                <TextField
                                    label="Testsúly (kg)"
                                    type="number"
                                    value={weightKg}
                                    onChange={(e) => setWeightKg(e.target.value)}
                                    error={Boolean(errors.weightKg)}
                                    helperText={errors.weightKg || 'Opcionális'}
                                    inputProps={{ min: 30, max: 300 }}
                                    sx={{ flex: 1, minWidth: 140 }}
                                />
                                <TextField
                                    label="Kor"
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    error={Boolean(errors.age)}
                                    helperText={errors.age || 'Opcionális'}
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

                {/* Napi célok */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>Napi célok</Typography>

                        <TextField
                            label="Napi kalóriacél (kcal)"
                            type="number"
                            value={dailyCalorieGoal}
                            onChange={(e) => handleCalorieChange(e.target.value)}
                            error={Boolean(errors.dailyCalorieGoal)}
                            helperText={errors.dailyCalorieGoal}
                            inputProps={{ min: 500, max: 10000 }}
                            fullWidth
                            sx={{ mb: 3 }}
                        />

                        <Divider sx={{ mb: 3 }} />

                        <Typography variant="body2" fontWeight={600} gutterBottom>
                            Makró eloszlás
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                            {templates.map((t) => {
                                const isActive = proteinPct === t.protein && carbPct === t.carb && fatPct === t.fat;
                                return (
                                    <Chip
                                        key={t.label}
                                        label={`${t.label} ${t.protein}/${t.carb}/${t.fat}`}
                                        onClick={() => {
                                            setProteinPct(t.protein);
                                            setCarbPct(t.carb);
                                            setFatPct(t.fat);
                                            recalc(kcal, t.protein, t.carb, t.fat);
                                        }}
                                        color={isActive ? 'primary' : 'default'}
                                        variant={isActive ? 'filled' : 'outlined'}
                                        clickable
                                        aria-pressed={isActive}
                                        sx={{ minHeight: 36 }}
                                    />
                                );
                            })}
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                            Húzd a csúszkákat — a gramm értékek azonnal frissülnek.
                        </Typography>

                        <Stack spacing={2.5} sx={{ mb: 2 }}>
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">Fehérje</Typography>
                                    <Typography variant="body2" fontWeight={700} color="primary.main">
                                        {proteinPct}%{proteinGoalG ? ` → ${proteinGoalG}g` : ''}
                                    </Typography>
                                </Box>
                                <Slider
                                    value={proteinPct}
                                    onChange={handleProteinPct}
                                    min={10} max={60} step={5}
                                    color="primary"
                                    aria-label="Fehérje százalék"
                                />
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">Szénhidrát</Typography>
                                    <Typography variant="body2" fontWeight={700} color="secondary.main">
                                        {carbPct}%{carbGoalG ? ` → ${carbGoalG}g` : ''}
                                    </Typography>
                                </Box>
                                <Slider
                                    value={carbPct}
                                    onChange={handleCarbPct}
                                    min={10} max={70} step={5}
                                    color="secondary"
                                    aria-label="Szénhidrát százalék"
                                />
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2">Zsír</Typography>
                                    <Typography variant="body2" fontWeight={700} color="warning.main">
                                        {fatPct}%{fatGoalG ? ` → ${fatGoalG}g` : ''}
                                    </Typography>
                                </Box>
                                <Slider
                                    value={fatPct}
                                    onChange={handleFatPct}
                                    min={10} max={60} step={5}
                                    color="warning"
                                    aria-label="Zsír százalék"
                                />
                            </Box>
                        </Stack>

                        {/* Összeg jelző */}
                        <Box
                            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}
                            role="status"
                            aria-live="polite"
                        >
                            <Typography
                                variant="body2"
                                fontWeight={600}
                                color={pctTotal === 100 ? 'success.main' : 'error.main'}
                            >
                                Összesen: {pctTotal}%{' '}
                                {pctTotal === 100 ? '✓' : `(${pctTotal > 100 ? '+' : ''}${pctTotal - 100})`}
                            </Typography>
                            {errors.pct && (
                                <Typography variant="caption" color="error.main">{errors.pct}</Typography>
                            )}
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        {/* Makró értékek — csak olvasható */}
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                            <TextField
                                label="Fehérje (g)"
                                value={proteinGoalG}
                                disabled
                                helperText="Automatikusan számítva"
                                sx={{ flex: 1, minWidth: 120 }}
                            />
                            <TextField
                                label="Szénhidrát (g)"
                                value={carbGoalG}
                                disabled
                                helperText="Automatikusan számítva"
                                sx={{ flex: 1, minWidth: 120 }}
                            />
                            <TextField
                                label="Zsír (g)"
                                value={fatGoalG}
                                disabled
                                helperText="Automatikusan számítva"
                                sx={{ flex: 1, minWidth: 120 }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Mentés */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2 }}>
                    {!canSave && (
                        <Typography variant="caption" color="text.secondary">
                            {!dailyCalorieGoal ? 'Add meg a kalóriacélt' : pctTotal !== 100 ? 'A makrók összege 100% kell legyen' : ''}
                        </Typography>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<SaveIcon />}
                        onClick={handleSave}
                        disabled={isMutating || !canSave}
                        sx={{ minHeight: 44 }}
                        aria-disabled={!canSave}
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