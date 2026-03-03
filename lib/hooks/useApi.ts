import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher } from '@/lib/fetcher';

// ── Foods ─────────────────────────────────────────────────────

interface FoodFilters {
    search?: string;
    minCal?: number;
    maxCal?: number;
    sortBy?: string;
    sortOrder?: string;
}

export function useFoods(filters: FoodFilters = {}) {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.minCal) params.set('minCal', String(filters.minCal));
    if (filters.maxCal) params.set('maxCal', String(filters.maxCal));
    if (filters.sortBy) params.set('sortBy', filters.sortBy);
    if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

    const query = params.toString();
    return useSWR(`/api/foods${query ? `?${query}` : ''}`, fetcher);
}

async function postFood(url: string, { arg }: { arg: Record<string, unknown> }) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Hiba történt');
    }
    return res.json();
}

async function updateFood(url: string, { arg }: { arg: Record<string, unknown> }) {
    const { id, ...data } = arg;
    const res = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Hiba történt');
    }
    return res.json();
}

async function deleteFood(url: string, { arg }: { arg: { id: string } }) {
    const res = await fetch(`${url}/${arg.id}`, { method: 'DELETE' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Hiba történt');
    }
    return res.json();
}

export function useCreateFood() {
    return useSWRMutation('/api/foods', postFood);
}

export function useUpdateFood() {
    return useSWRMutation('/api/foods', updateFood);
}

export function useDeleteFood() {
    return useSWRMutation('/api/foods', deleteFood);
}

// ── Meals ─────────────────────────────────────────────────────

export function useMeals(date: string) {
    return useSWR(date ? `/api/meals?date=${date}` : null, fetcher);
}

async function addMealEntry(url: string, { arg }: { arg: Record<string, unknown> }) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Hiba történt');
    }
    return res.json();
}

async function updateMealEntry(url: string, { arg }: { arg: { id: string; amountG: number } }) {
    const res = await fetch(`${url}/${arg.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountG: arg.amountG }),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Hiba történt');
    }
    return res.json();
}

async function deleteMealEntry(url: string, { arg }: { arg: { id: string } }) {
    const res = await fetch(`${url}/${arg.id}`, { method: 'DELETE' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Hiba történt');
    }
    return res.json();
}

export function useAddMealEntry() {
    return useSWRMutation('/api/meals', addMealEntry);
}

export function useUpdateMealEntry() {
    return useSWRMutation('/api/meals/entries', updateMealEntry);
}

export function useDeleteMealEntry() {
    return useSWRMutation('/api/meals/entries', deleteMealEntry);
}

// ── Recipes ───────────────────────────────────────────────────

export function useRecipes() {
    return useSWR('/api/recipes', fetcher);
}

export function useRecipe(id: string | null) {
    return useSWR(id ? `/api/recipes/${id}` : null, fetcher);
}

async function mutateRecipe(
    url: string,
    { arg }: { arg: Record<string, unknown> },
    method: string
) {
    const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Hiba történt');
    }
    return res.json();
}

async function deleteRecipe(url: string, { arg }: { arg: { id: string } }) {
    const res = await fetch(`${url}/${arg.id}`, { method: 'DELETE' });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Hiba történt');
    }
    return res.json();
}

export function useCreateRecipe() {
    return useSWRMutation('/api/recipes', (url, { arg }: { arg: Record<string, unknown> }) =>
        mutateRecipe(url, { arg }, 'POST')
    );
}

export function useUpdateRecipe(id: string) {
    return useSWRMutation(`/api/recipes/${id}`, (url, { arg }: { arg: Record<string, unknown> }) =>
        mutateRecipe(url, { arg }, 'PUT')
    );
}

export function useDeleteRecipe() {
    return useSWRMutation('/api/recipes', deleteRecipe);
}

// ── Profile ───────────────────────────────────────────────────

export function useProfile() {
    return useSWR('/api/profile', fetcher);
}

async function updateProfile(url: string, { arg }: { arg: Record<string, unknown> }) {
    const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(arg),
    });
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Hiba történt');
    }
    return res.json();
}

export function useUpdateProfile() {
    return useSWRMutation('/api/profile', updateProfile);
}