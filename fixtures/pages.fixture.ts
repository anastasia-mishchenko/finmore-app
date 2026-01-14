import { test as base , expect, Page} from '@playwright/test';
import { LoginForm } from '../pages/LoginForm';
import { RegistrationForm } from '../pages/RegistrationForm';
import { DashboardPage } from '../pages/DashboardPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { NewTransactionModal } from '../pages/NewTransactionModal';
import { loginFormTerms } from '../test-data/loginTerms';

type Pages = {
    loginForm: LoginForm;
    registrationForm: RegistrationForm;
    dashboardPage: DashboardPage;
    transactionsPage: TransactionsPage;
    newTransactionModal: NewTransactionModal;
    authorizationPage: DashboardPage;
}

export const test = base.extend<Pages>({
    loginForm: async ({ page }, use) => {
        await use(new LoginForm(page));
    },
    registrationForm: async ({ page }, use) => {
        await use(new RegistrationForm(page));
    },
    dashboardPage: async ({ page }, use) => {
        await use(new DashboardPage(page));
    },
    transactionsPage: async ({ page }, use) => {
        await use(new TransactionsPage(page));
    },
    newTransactionModal: async ({ page }, use) => {
        await use(new NewTransactionModal(page));
    },
    authorizationPage: async ({ browser }, use) => {
        const context = await browser.newContext();
        const page = await context.newPage();
        const loginForm = new LoginForm(page);
        const dashboardPage = new DashboardPage(page);

        await loginForm.goto();
        await loginForm.fillLoginForm(loginFormTerms.validEmail, loginFormTerms.validPassword);
        await loginForm.clickLoginButton();
        await use(dashboardPage);
        await context.close();
    },
});

export { expect };