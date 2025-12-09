import { test as base , expect} from '@playwright/test';
import { LoginForm } from '../pages/LoginForm';
import { RegistrationForm } from '../pages/RegistrationForm';
import { DashboardPage } from '../pages/DashboardPage';
import { TransactionsPage } from '../pages/TransactionsPage';
import { NewTransactionModal } from '../pages/NewTransactionModal';

type Pages = {
    loginForm: LoginForm;
    registrationForm: RegistrationForm;
    dashboardPage: DashboardPage;
    transactionsPage: TransactionsPage;
    newTransactionModal: NewTransactionModal;
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
    }
});

export { expect };