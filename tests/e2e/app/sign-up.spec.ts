/// <reference types="node" />
import { test, expect } from '@playwright/test';

test.use({ storageState: undefined });
import { generateRandomEmail } from '../../../utils/email-generator';

// Ensure required environment variables are defined
test.beforeAll(() => {
  const required = ['REGISTER_PATH', 'PASSWORD', 'CONFIRM_CODE'];
  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Environment variable ${key} must be set for sign‑up tests`);
    }
  }
});

const REGISTER_PATH = process.env.REGISTER_PATH!;
const PASSWORD = process.env.PASSWORD!;
const CONFIRM_CODE = process.env.CONFIRM_CODE!;

// Apply retry to mitigate flaky network/UI issues
test.describe.configure({ retries: 2 });

test.describe('App Sign Up', () => {
  // Navigate to sign up page and verify form
  test('registration form is displayed correctly', async ({ page }) => {
    await page.goto(REGISTER_PATH);

    await expect(page.getByPlaceholder('alex@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('********').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign up' })).toBeVisible();
  });

  // Attempt sign up with mismatched passwords
  test('sign up fails when passwords do not match', async ({ page }) => {
    await page.goto(REGISTER_PATH);

    await page.getByPlaceholder('alex@example.com').fill('test@mail.com');
    await page.getByPlaceholder('********').first().fill(PASSWORD);
    await page.getByPlaceholder('********').nth(1).fill('DifferentPass1!');
    await page.getByRole('button', { name: 'Sign up' }).click();

    await expect(page.locator('text=Passwords do not match')).toBeVisible();
  });

  // Complete user registration flow with random email
  test('user can sign up and verify with confirm code', async ({ page }) => {
    const testEmail = generateRandomEmail();

    // Navigate to sign‑up page and wait for it to be ready
    await page.goto(REGISTER_PATH);
    await page.waitForLoadState('networkidle');
    await expect(page.getByPlaceholder('alex@example.com')).toBeVisible();

    // Fill registration form using stable selectors
    await page.getByPlaceholder('alex@example.com').fill(testEmail);
    await page.getByPlaceholder('********').first().fill(PASSWORD);
    await page.getByPlaceholder('********').nth(1).fill(PASSWORD);
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Wait for navigation to the confirmation page
    await page.waitForURL(/auth\/register\/confirm/);
    await page.waitForLoadState('networkidle');

    // Enter confirm code and submit
    await page.getByPlaceholder('123456').fill(CONFIRM_CODE);
    await page.getByRole('button', { name: 'Verify' }).click();

    // Ensure we have left the registration flow
    await page.waitForURL((url) => !/auth\/register\/(base|confirm)/.test(url.href));
    await expect(page).not.toHaveURL(/auth\/register\/(base|confirm)/);
  });
});
