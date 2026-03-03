// Alap fetcher az SWR-hez
export const fetcher = async (url: string) => {
    const res = await fetch(url);

    if (!res.ok) {
        const error = await res.json().catch(() => ({ error: 'Ismeretlen hiba' }));
        throw new Error(error.error || 'Hálózati hiba');
    }

    return res.json();
};