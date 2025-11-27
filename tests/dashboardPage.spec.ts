import { test, expect, Logger } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { RegistrationForm } from '../pages/RegistrationForm';
import { LoginForm } from '../pages/LoginForm';
import { faker } from '@faker-js/faker';
import { registrationFormTerms } from '../test-data/registrationFormTerms';
import { checkVisibility, clickElement, fillElement } from '../utils/globalMethods';
import { NewTransactionModal } from '../pages/NewTransactionModal';

test.describe("Dashboard Page validation", () => {
    let dashboardPage: DashboardPage;
    let registrationForm: RegistrationForm;
    let loginForm: LoginForm;
    let newTransactionModal: NewTransactionModal;
    let fakerEmail;
    let fakerPassword;
    let fakerFullName;

    test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    dashboardPage = new DashboardPage(page);
    registrationForm = new RegistrationForm(page);
    loginForm = new LoginForm(page);
    newTransactionModal = new NewTransactionModal(page);
 
    fakerEmail = faker.internet.email();
    fakerPassword = faker.internet.password();
    fakerFullName = faker.person.fullName();
 
    loginForm = new LoginForm(page);
    dashboardPage = new DashboardPage(page);
    registrationForm = new RegistrationForm(page);
 
    await loginForm.goto();
    await loginForm.clickSwitchToRegistrationButton();
    await registrationForm.fillRegistrationForm(
      fakerFullName,
      fakerEmail,
      fakerPassword,
      fakerPassword,
      registrationFormTerms.currencyGBP
    );
 
    //await loginForm.fillLoginForm(fakerEmail, fakerPassword);
    await dashboardPage.userMenuIsVisible();
 
  });
 
  test("[Positive] Add expense transaction", async()=>{
    await clickElement(dashboardPage.addTransactionButton, 'Додати транзакцію');
    await newTransactionModal.modalIsVisible();
    await clickElement(newTransactionModal.expenseTypeButton, 'Витрата');
    await fillElement(newTransactionModal.amountInput, '1000', 'Сума');
    await newTransactionModal.selectCategory('Продукти');
    await fillElement(newTransactionModal.descriptionInput, 'Вино', 'Опис');
    await fillElement(newTransactionModal.dateInput, '2025-11-26', 'Дата');
    await newTransactionModal.selectAccount('Картка Монобанку');
    await newTransactionModal.fillTag('Алкоголь');
    await clickElement(newTransactionModal.addTagButton, 'Додати тег');
    await newTransactionModal.verifyTagExists('Алкоголь');
    
    
    await clickElement(newTransactionModal.createButton, 'Створити');
    await newTransactionModal.modalIsNotVisible();
    await dashboardPage.verifyTheLastTransaction('1000', 'Продукти', 'Вино');
  });
});
