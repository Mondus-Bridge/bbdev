import { Locator, Page } from '@playwright/test';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.getByPlaceholder('Email');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Log in' });
  }

  async navigateTo(path: string) {
    await this.page.goto(path);
  }

  async fillEmail(email: string) {
    await this.emailInput.waitFor({ state: 'visible', timeout: 15000 });
    await this.emailInput.fill(email);
  }

  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  async clickSubmit() {
    await this.loginButton.click();
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  get errorMessage() {
    return this.page.getByText(/password must contain/i);
  }
}
