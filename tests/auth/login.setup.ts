import { test as setup, expect } from '@playwright/test';
import { POMManager } from '../../src/fixtures/features/auth/login.fixture';

const LOGIN_PATH = process.env.LOGIN_PATH!;
const EMAIL = process.env.EMAIL!;
const PASSWORD = process.env.PASSWORD!;

setup('authenticate and save storage state', async ({ page }) => {
  const pm = new POMManager(page);

  // 1. Navigate to login screen
  await pm.loginPage.navigateTo(LOGIN_PATH);

  // 2. Wait for loading overlay to disappear before interacting with the page.
  //    The Vue.js transition classes (loading-loader-leave-active, loading-loader-leave-to)
  //    are added to <div class="loading-loader"> during page initialization and can
  //    intercept pointer events, causing "element intercepts pointer events" failures.
  await page
    .locator('.loading-loader')
    .waitFor({ state: 'hidden', timeout: 15000 })
    .catch(() => {
      // Overlay may already be gone — no action needed.
    });

  // 3. Fill credentials from environment variables
  await pm.loginPage.fillEmail(EMAIL);
  await pm.loginPage.fillPassword(PASSWORD);

  // 4. Click the submit button
  await pm.loginPage.clickSubmit();

  // 5. Verify redirect away from login page
  await expect(page).not.toHaveURL(/auth\/login/);

  // 6. Save storage state for downstream tests
  await page.context().storageState({ path: '.auth/user.json' });
});
