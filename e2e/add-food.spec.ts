import { test, expect } from '@playwright/test';

test('étel hozzáadása a napi naplóhoz', async ({ page }) => {
    // 1. Bejelentkezés
    await page.goto('/login');
    await page.getByLabel('E-mail cím').fill('asd@asd.com'); // saját teszt email
    await page.getByLabel('Jelszó').fill('asdasdasd');   // saját teszt jelszó
    await page.getByRole('button', { name: /bejelentkezés/i }).click();

    // 2. Dashboard betöltése
    await expect(page).toHaveURL('/dashboard');

    // 3. Navigálás a mai nap naplójához
    const today = new Date().toISOString().split('T')[0];
    await page.goto(`/log/${today}`);
    await expect(page.getByRole('heading', { name: /ma/i })).toBeVisible();

    // 4. Reggeli hozzáadás megnyitása
    await page.getByRole('button', { name: /hozzáadás/i }).first().click();
    // 5. Étel keresése
    await page.getByLabel('Étel keresése').fill('csirkemell');
    await page.getByRole('button', { name: /keresés/i }).click();

    // 6. Találatra várunk és kiválasztjuk az elsőt
    await expect(page.getByRole('list', { name: /keresési eredmények/i })).toBeVisible({ timeout: 10000 });
    await page.getByRole('listitem').first().click();

    // 7. Mennyiség megadása
    await page.getByRole('spinbutton').fill('150');

    // 8. Hozzáadás
    await page.getByRole('button', { name: /hozzáadás/i }).click();

    // 9. Toast megjelenik
    await expect(page.getByText(/sikeresen hozzáadva/i)).toBeVisible({ timeout: 5000 });
});