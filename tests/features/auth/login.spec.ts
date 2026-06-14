import { test, expect } from '@playwright/test';
// Provide a minimal declaration for `process` so TypeScript doesn't require
// @types/node in the test environment.
declare const process: { env: { [key: string]: string | undefined } };
import { POMManager } from '../../../src/fixtures/features/auth/login.fixture';

// Override the project-level storageState (set in playwright.config.ts) so that
// login tests always start with a clean authenticated session.
test.use({ storageState: { cookies: [], origins: [] } });

const LOGIN_PATH = process.env.LOGIN_PATH!;
const EMAIL = process.env.EMAIL!;
const PASSWORD = process.env.PASSWORD!;

/**
 * Wait for the Vue.js loading overlay to disappear.
 *
 * During page initialization a <div class="loading-loader"> is rendered with
 * CSS transition classes (loading-loader-leave-active, loading-loader-leave-to)
 * that can cover interactive elements.  Playwright's actionability check detects
 * the interception and retries the action until the timeout is reached.
 *
 * Call this helper after any navigation to ensure the overlay has fully
 * transitioned out before interacting with the page.
 */
async function waitForLoadingOverlay(page: import('@playwright/test').Page) {
  await page
    .locator('.loading-loader')
    .waitFor({ state: 'hidden', timeout: 15000 })
    .catch(() => {
      // Overlay may already be gone — no action needed.
    });
}

test.describe('User Authentication', () => {
  test('Login with Valid Credentials', async ({ page }) => {
    const pm = new POMManager(page);

    // 1. Navigate to login screen
    await pm.loginPage.navigateTo(LOGIN_PATH);

    // 2. Wait for the loading overlay to disappear before interacting
    await waitForLoadingOverlay(page);

    // 3. Fill credentials
    await pm.loginPage.fillEmail(EMAIL);
    await pm.loginPage.fillPassword(PASSWORD);

    // 4. Click the submit button
    await pm.loginPage.clickSubmit();

    // 5. Verify successful redirect away from the login page
    await expect(page).not.toHaveURL(/auth\/login/);
  });

  test('Login Fails with Wrong Password', async ({ page }) => {
    const pm = new POMManager(page);

    // 1. Navigate to login screen
    await pm.loginPage.navigateTo(LOGIN_PATH);

    // 2. Wait for the loading overlay to disappear before interacting
    await waitForLoadingOverlay(page);

    // 3. Fill credentials with an invalid password
    await pm.loginPage.fillEmail(EMAIL);
    await pm.loginPage.fillPassword('wrongpassword123!');

    // 4. Click the submit button
    await pm.loginPage.clickSubmit();

    // 5. Verify the error message is visible
    await expect(pm.loginPage.errorMessage).toBeVisible();
  });
});
