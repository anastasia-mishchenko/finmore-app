import { test as base, BrowserContext, Page } from '@playwright/test';
import { LoginForm } from '../pages/LoginForm';
import { loginFormTerms } from '../test-data/loginTerms';

type Auth = {
    authorizationPage: Page;
}

export const authTest = base.extend<Auth>({
    authorizationPage: async ({ browser }, use) => {
       const context = await browser.newContext();
       const page = await context.newPage();
       const loginForm = new LoginForm(page);

       await loginForm.goto();
       await loginForm.fillLoginForm(loginFormTerms.validEmail, loginFormTerms.validPassword);
       await loginForm.clickLoginButton();
       await use(page);
       await context.close();
    },
});

export { expect } from '@playwright/test';