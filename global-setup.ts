import path from 'path';
import fs from 'fs';
import { chromium, FullConfig } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { LoginForm } from './pages/LoginForm';
import { RegistrationForm } from './pages/RegistrationForm';
import { DashboardPage } from './pages/DashboardPage';
import { registrationFormTerms } from './test-data/registrationFormTerms';

const STORAGE_STATE_PATH = path.join(__dirname, 'storage', 'auth.json');

export default async function globalSetup(config: FullConfig) {
  const baseURL =
    (config.projects?.[0]?.use?.baseURL as string | undefined) ||
    'https://finmore.netlify.app/';

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage();

  const loginForm = new LoginForm(page);
  const registrationForm = new RegistrationForm(page);
  const dashboardPage = new DashboardPage(page);

  const fullName = faker.person.fullName();
  const email = faker.internet.email();
  const password = faker.internet.password();

  await page.goto('/');
  await loginForm.clickSwitchToRegistrationButton();
  await registrationForm.fillRegistrationForm(
    fullName,
    email,
    password,
    password,
    registrationFormTerms.currencyUAH
  );
  await dashboardPage.waitForDashboardReady();

  fs.mkdirSync(path.dirname(STORAGE_STATE_PATH), { recursive: true });
  await context.storageState({ path: STORAGE_STATE_PATH });

  await browser.close();
}
