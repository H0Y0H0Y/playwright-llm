import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const STORAGE_STATE_PATH = path.join(__dirname, '..', '..', '.auth', 'standard_user.json');

setup('create storage state for standard_user', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill('standard_user');
    await page.getByRole('textbox', { name: 'Password' }).fill('secret_sauce');
    await page.getByRole('button', { name: 'login' }).click();
    await page.waitForURL(/.*inventory\.html/);
    await expect(page.locator('.app_logo')).toContainText('Swag Labs');

    const authDir = path.dirname(STORAGE_STATE_PATH);

    fs.mkdirSync(authDir, { recursive: true });

    await page.context().storageState({ path: STORAGE_STATE_PATH });
});
