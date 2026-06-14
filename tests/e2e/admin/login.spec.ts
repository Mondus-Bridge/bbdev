/// <reference types="node" />
import { test, expect } from '@playwright/test';

const ADMIN_BASE_URL = process.env.ADMIN_BASE_URL!;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const PASSWORD = process.env.PASSWORD!;

test.describe('Admin Login', () => {
  // Navigate to admin login page
  test('admin can log in with valid credentials', async ({ page }) => {
    await page.goto(ADMIN_BASE_URL);

    // Fill in email
    const emailInput = page.getByPlaceholder('Email');
    await emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await emailInput.fill(ADMIN_EMAIL);

    // Fill in password
    const passwordInput = page.getByPlaceholder('Password');
    await passwordInput.fill(PASSWORD);

    // Click Log in button
    const loginButton = page.getByRole('button', { name: 'Log in' });
    await loginButton.click();

    // Verify redirect away from login page
    await expect(page).not.toHaveURL(/auth\/login/);
  });

  // Attempt login with incorrect password
  test('admin login fails with wrong password', async ({ page }) => {
    await page.goto(ADMIN_BASE_URL);

    // Fill in email
    const emailInput = page.getByPlaceholder('Email');
    await emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await emailInput.fill(ADMIN_EMAIL);

    // Fill in wrong password
    const passwordInput = page.getByPlaceholder('Password');
    await passwordInput.fill('wrongpassword123!');

    // Click Log in button
    const loginButton = page.getByRole('button', { name: 'Log in' });
    await loginButton.click();

    // Verify error message is displayed
    await expect(page.getByText(/password must contain/i)).toBeVisible();
  });
});
