import { Page, expect } from '@playwright/test';

/**
 * Page Object Model for the Deposit page.
 */
export class DepositPage {
  readonly page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto(currency: string) {
    await this.page.goto(`/wallet/deposit/${currency}`);
    await this.page.waitForTimeout(2000);
  }

  async confirm() {
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await this.page.waitForTimeout(2000);
  }

  async selectNetwork(network: string) {
    // network is expected to match the testId of the network option
    await this.page.getByTestId(network).click();
    await this.page.waitForTimeout(1000);
  }

  async getAddress(): Promise<string> {
    const addressEl = this.page.getByTestId('cryptoAddressInput');
    await addressEl.waitFor({ state: 'visible', timeout: 10000 });
    const address = (await addressEl.textContent())?.trim();
    expect(address).toBeTruthy();
    return address as string;
  }
}
