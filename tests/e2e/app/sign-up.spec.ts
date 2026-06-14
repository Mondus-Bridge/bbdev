/// <reference types="node" />
import { test, expect } from '@playwright/test';
import { generateRandomEmail } from '../../../utils/email-generator';

const REGISTER_PATH = process.env.REGISTER_PATH!;
const PASSWORD = process.env.PASSWORD!;
const CONFIRM_CODE = process.env.CONFIRM_CODE!;

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
    let testEmail = '';
    generateRandomEmail((email) => {
      testEmail = email;
    });

    await page.goto(REGISTER_PATH);

    // Fill registration form
    await page.getByPlaceholder('alex@example.com').fill(testEmail);
    await page.getByPlaceholder('********').first().fill(PASSWORD);
    await page.getByPlaceholder('********').nth(1).fill(PASSWORD);
    await page.getByRole('button', { name: 'Sign up' }).click();

    // Wait for redirect to confirmation page
    await page.waitForURL(/auth\/register\/confirm/);

    // Enter confirm code
    await page.getByPlaceholder('123456').fill(CONFIRM_CODE);
    await page.getByRole('button', { name: 'Verify' }).click();

    // Verify successful registration
    await expect(page).not.toHaveURL(/auth\/register\/(base|confirm)/);
  });
});
