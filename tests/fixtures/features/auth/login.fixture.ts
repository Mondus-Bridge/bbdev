import { Page } from '@playwright/test';
import { LoginPage } from '../../../pages/auth/LoginPage';

export class POMManager {
  readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
  }
}
