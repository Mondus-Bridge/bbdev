/// <reference types="node" />
import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

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
  test('capture BTC address with Bitcoin network', async ({ page }) => {
    await page.goto('/wallet/deposit/BTC');
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(2000);

    const addressEl = page.getByTestId('cryptoAddressInput');
    await addressEl.waitFor({ state: 'visible', timeout: 10000 });
    const address = (await addressEl.textContent())?.trim();
    expect(address).toBeTruthy();
    console.log(`BTC (Bitcoin): ${address}`);
    saveAddress('BTC', 'Bitcoin', address!);
  });

  test('capture BTC address with BNB Smart Chain (BEP20)', async ({ page }) => {
    await page.goto('/wallet/deposit/BTC');
    await page.waitForTimeout(2000);

    await page.getByTestId('BNB Smart Chain (BEP20)').click();
    await page.waitForTimeout(1000);

    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(2000);

    const addressEl = page.getByTestId('cryptoAddressInput');
    await addressEl.waitFor({ state: 'visible', timeout: 10000 });
    const address = (await addressEl.textContent())?.trim();
    expect(address).toBeTruthy();
    console.log(`BTC (BNB Smart Chain BEP20): ${address}`);
    saveAddress('BTC', 'BNB Smart Chain (BEP20)', address!);
  });

  test('capture USDT address', async ({ page }) => {
    await page.goto('/wallet/deposit/USDT');
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(2000);

    const addressEl = page.getByTestId('cryptoAddressInput');
    await addressEl.waitFor({ state: 'visible', timeout: 10000 });
    const address = (await addressEl.textContent())?.trim();
    expect(address).toBeTruthy();
    console.log(`USDT: ${address}`);
    saveAddress('USDT', 'default', address!);
  });

  test('capture ETH address', async ({ page }) => {
    await page.goto('/wallet/deposit/ETH');
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(2000);

    const addressEl = page.getByTestId('cryptoAddressInput');
    await addressEl.waitFor({ state: 'visible', timeout: 10000 });
    const address = (await addressEl.textContent())?.trim();
    expect(address).toBeTruthy();
    console.log(`ETH: ${address}`);
    saveAddress('ETH', 'default', address!);
  });

  test('capture TRX address', async ({ page }) => {
    await page.goto('/wallet/deposit/TRX');
    await page.waitForTimeout(2000);

    await page.getByRole('button', { name: 'Confirm' }).click();
    await page.waitForTimeout(2000);

    const addressEl = page.getByTestId('cryptoAddressInput');
    await addressEl.waitFor({ state: 'visible', timeout: 10000 });
    const address = (await addressEl.textContent())?.trim();
    expect(address).toBeTruthy();
    console.log(`TRX: ${address}`);
    saveAddress('TRX', 'default', address!);
  });
});
