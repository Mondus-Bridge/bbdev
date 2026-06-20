import { FullConfig, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load env variables (same file used in config)
dotenv.config({ path: path.resolve(__dirname, 'env', 'dev.env') });

async function loginAndSave(
  loginUrl: string,
  username: string,
  password: string,
  storagePath: string
) {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(loginUrl);
  // Adjust selectors to match your login page
  await page.fill('input[name="username"]', username);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForLoadState('networkidle');
  await page.context().storageState({ path: storagePath });
  await browser.close();
}

export default async function globalSetup(config: FullConfig) {
  const baseAuthDir = path.resolve(__dirname, '.auth');
  const appDir = path.join(baseAuthDir, 'app');
  const adminDir = path.join(baseAuthDir, 'admin');

  // Ensure directories exist
  fs.mkdirSync(appDir, { recursive: true });
  fs.mkdirSync(adminDir, { recursive: true });

  // Credentials – provide via .env or CI secrets
  const appLoginUrl = process.env.APP_LOGIN_URL ?? '';
  const appUser = process.env.APP_USER ?? '';
  const appPass = process.env.APP_PASS ?? '';

  const adminLoginUrl = process.env.ADMIN_LOGIN_URL ?? '';
  const adminUser = process.env.ADMIN_USER ?? '';
  const adminPass = process.env.ADMIN_PASS ?? '';

  if (appLoginUrl && appUser && appPass) {
    await loginAndSave(appLoginUrl, appUser, appPass, path.join(appDir, 'user.json'));
  }

  if (adminLoginUrl && adminUser && adminPass) {
    await loginAndSave(adminLoginUrl, adminUser, adminPass, path.join(adminDir, 'user.json'));
  }
}
