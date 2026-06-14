import { Page } from '@playwright/test';
import { LoginPage } from '../../../pom/features/auth/LoginPage';

export class POMManager {
  readonly loginPage: LoginPage;

  constructor(page: Page) {
    this.loginPage = new LoginPage(page);
  }
}
