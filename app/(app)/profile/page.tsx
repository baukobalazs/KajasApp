'use client';

import { useState } from 'react';
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
    Alert,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

type Goal = 'loss' | 'maintain' | 'gain';

// TODO: valódi adatok NextAuth session + adatbázisból
const mockProfile = {
    name: 'Teszt Felhasználó',
    email: 'teszt@example.com',
    heightCm: 178,
    weightKg: 75,
    age: 25,
    goal: 'maintain' as Goal,
    dailyCalorieGoal: 2000,
    proteinGoalG: 150,
    carbGoalG: 200,
    fatGoalG: 65,
};

const goalOptions = [
    { value: 'loss', label: 'Fogyás', icon: <TrendingDownIcon /> },
    { value: 'maintain', label: 'Fenntartás', icon: <TrendingFlatIcon /> },
    { value: 'gain', label: 'Tömegnövelés', icon: <TrendingUpIcon /> },
];

export default function ProfilePage() {
    const [name, setName] = useState(mockProfile.name);
    const [heightCm, setHeightCm] = useState(mockProfile.heightCm);
    const [weightKg, setWeightKg] = useState(mockProfile.weightKg);
    const [age, setAge] = useState(mockProfile.age);
    const [goal, setGoal] = useState<Goal>(mockProfile.goal);
    const [dailyCalorieGoal, setDailyCalorieGoal] = useState(mockProfile.dailyCalorieGoal);
    const [proteinGoalG, setProteinGoalG] = useState(mockProfile.proteinGoalG);
    const [carbGoalG, setCarbGoalG] = useState(mockProfile.carbGoalG);
    const [fatGoalG, setFatGoalG] = useState(mockProfile.fatGoalG);
    const [saved, setSaved] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'A név kötelező';
        if (heightCm < 100 || heightCm > 250) newErrors.heightCm = '100–250 cm között legyen';
        if (weightKg < 30 || weightKg > 300) newErrors.weightKg = '30–300 kg között legyen';
        if (age < 10 || age > 120) newErrors.age = '10–120 között legyen';
        if (dailyCalorieGoal < 500 || dailyCalorieGoal > 10000) newErrors.dailyCalorieGoal = '500–10000 kcal között legyen';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        // TODO: API hívás a 2. mérföldkőnél
        console.log('Profil mentése');
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <Box component="section" aria-labelledby="profile-title">
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" component="h1" id="profile-title" fontWeight={700}>
                    Profilom
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {mockProfile.email}
                </Typography>
            </Box>

            {saved && (
                <Alert severity="success" sx={{ mb: 3 }} role="status" aria-live="polite">
                    Profil sikeresen mentve!
                </Alert>
            )}

            <Stack spacing={3}>
                {/* Személyes adatok */}
                <Card>
                    <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <FitnessCenterIcon color="primary" aria-hidden="true" />
                            <Typography variant="h6" fontWeight={600}>
                                Személyes adatok
                            </Typography>
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
                                    onChange={(e) => setHeightCm(Number(e.target.value))}
                                    error={Boolean(errors.heightCm)}
                                    helperText={errors.heightCm}
                                    inputProps={{ min: 100, max: 250, 'aria-label': 'Magasság centiméterben' }}
                                    sx={{ flex: 1, minWidth: 140 }}
                                />
                                <TextField
                                    label="Testsúly (kg)"
                                    type="number"
                                    value={weightKg}
                                    onChange={(e) => setWeightKg(Number(e.target.value))}
                                    error={Boolean(errors.weightKg)}
                                    helperText={errors.weightKg}
                                    inputProps={{ min: 30, max: 300, 'aria-label': 'Testsúly kilogrammban' }}
                                    sx={{ flex: 1, minWidth: 140 }}
                                />
                                <TextField
                                    label="Kor"
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(Number(e.target.value))}
                                    error={Boolean(errors.age)}
                                    helperText={errors.age}
                                    inputProps={{ min: 10, max: 120, 'aria-label': 'Kor' }}
                                    sx={{ flex: 1, minWidth: 140 }}
                                />
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* Cél */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Táplálkozási cél
                        </Typography>
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
                                        minHeight: 44,
                                        px: 3,
                                        gap: 1,
                                        borderRadius: '8px !important',
                                        border: '1px solid !important',
                                        borderColor: 'divider !important',
                                        '&.Mui-selected': {
                                            bgcolor: 'primary.main',
                                            color: 'white',
                                            borderColor: 'primary.main !important',
                                            '&:hover': { bgcolor: 'primary.dark' },
                                        },
                                    }}
                                >
                                    {opt.icon}
                                    {opt.label}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </CardContent>
                </Card>

                {/* Makró célok */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Napi célok
                        </Typography>
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
                                    label="Fehérje (g)"
                                    type="number"
                                    value={proteinGoalG}
                                    onChange={(e) => setProteinGoalG(Number(e.target.value))}
                                    inputProps={{ min: 0, 'aria-label': 'Napi fehérjecél grammban' }}
                                    sx={{ flex: 1, minWidth: 120 }}
                                />
                                <TextField
                                    label="Szénhidrát (g)"
                                    type="number"
                                    value={carbGoalG}
                                    onChange={(e) => setCarbGoalG(Number(e.target.value))}
                                    inputProps={{ min: 0, 'aria-label': 'Napi szénhidrátcél grammban' }}
                                    sx={{ flex: 1, minWidth: 120 }}
                                />
                                <TextField
                                    label="Zsír (g)"
                                    type="number"
                                    value={fatGoalG}
                                    onChange={(e) => setFatGoalG(Number(e.target.value))}
                                    inputProps={{ min: 0, 'aria-label': 'Napi zsírcél grammban' }}
                                    sx={{ flex: 1, minWidth: 120 }}
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
                        sx={{ minHeight: 44 }}
                        aria-label="Profil mentése"
                    >
                        Mentés
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
}