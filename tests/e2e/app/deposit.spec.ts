/// <reference types="node" />
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { POMManager } from '../../../src/fixtures/features/auth/login.fixture';

const ADDRESSES_FILE = path.resolve(__dirname, '..', '..', '..', 'fixtures', 'deposit-addresses.json');

function saveAddress(currency: string, network: string, address: string) {
  const dir = path.dirname(ADDRESSES_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let data: Record<string, any> = {};
  if (fs.existsSync(ADDRESSES_FILE)) {
    data = JSON.parse(fs.readFileSync(ADDRESSES_FILE, 'utf-8'));
  }
  if (!data[currency] || typeof data[currency] === 'string') {
    data[currency] = {};
  }
  data[currency][network] = address;
  fs.writeFileSync(ADDRESSES_FILE, JSON.stringify(data, null, 2));
}

  test.describe('Deposit Addresses', () => {
    test.beforeEach(async ({ page }) => {
      const pm = new POMManager(page);



      const user = process.env.EMAIL ?? '';
      const pass = process.env.PASSWORD ?? '';
      if (!loginUrl || !user || !pass) {
        throw new Error('Missing login env vars');
      }
      await pm.loginPage.navigateTo(loginUrl);
      await pm.loginPage.fillEmail(user);
      await pm.loginPage.fillPassword(pass);
      await pm.loginPage.clickSubmit();
      await expect(page).not.toHaveURL(/auth\/login/);
    });

    test('capture BTC address with Bitcoin network', async ({ page }) => {
      const depositPage = new DepositPage(page);
      await depositPage.goto('BTC');
      await depositPage.confirm();
      const address = await depositPage.getAddress();
      console.log(`BTC (Bitcoin): ${address}`);
      saveAddress('BTC', 'Bitcoin', address);
    });

    test('capture BTC address with BNB Smart Chain (BEP20)', async ({ page }) => {
      const depositPage = new DepositPage(page);
      await depositPage.goto('BTC');
      await depositPage.selectNetwork('BNB Smart Chain (BEP20)');
      await depositPage.confirm();
      const address = await depositPage.getAddress();
      console.log(`BTC (BNB Smart Chain BEP20): ${address}`);
      saveAddress('BTC', 'BNB Smart Chain (BEP20)', address);
    });

    test('capture USDT address', async ({ page }) => {
      const depositPage = new DepositPage(page);
      await depositPage.goto('USDT');
      await depositPage.confirm();
      const address = await depositPage.getAddress();
      console.log(`USDT: ${address}`);
      saveAddress('USDT', 'default', address);
    });

    test('capture ETH address', async ({ page }) => {
      const depositPage = new DepositPage(page);
      await depositPage.goto('ETH');
      await depositPage.confirm();
      const address = await depositPage.getAddress();
      console.log(`ETH: ${address}`);
      saveAddress('ETH', 'default', address);
    });

    test('capture TRX address', async ({ page }) => {
      const depositPage = new DepositPage(page);
      await depositPage.goto('TRX');
      await depositPage.confirm();
      const address = await depositPage.getAddress();
      console.log(`TRX: ${address}`);
      saveAddress('TRX', 'default', address);
    });
  });
