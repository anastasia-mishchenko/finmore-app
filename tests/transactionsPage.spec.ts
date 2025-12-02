import { test, expect, Logger } from '@playwright/test';
import { TransactionsPage } from '../pages/TransactionsPage';
import { NewTransactionModal } from '../pages/NewTransactionModal';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginForm } from '../pages/LoginForm';
import { RegistrationForm } from '../pages/RegistrationForm';
import { faker } from '@faker-js/faker';
import { registrationFormTerms } from '../test-data/registrationFormTerms';
import * as allure from "allure-js-commons";
import { checkVisibility } from '../utils/globalMethods';

test.describe("Transactions Page validation", () => {
    let transactionsPage: TransactionsPage;
    let newTransactionModal: NewTransactionModal;
    let dashboardPage: DashboardPage;
    let loginForm: LoginForm;
    let registrationForm: RegistrationForm;
    let fakerEmail;
    let fakerPassword;
    let fakerFullName;

    test.beforeAll(async ({ browser }) => {
        await allure.displayName("Transactions Page validation");
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
        registrationForm = new RegistrationForm(page);
        transactionsPage = new TransactionsPage(page);
     
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
        await dashboardPage.navigateToTransactionsPage();
        await allure.step("Verify transactions page is visible", async()=>{
            await transactionsPage.transactionsPageTitleIsVisible();
        });
     
      });

test("[Positive] Add expense transaction", async()=>{
    await allure.displayName("Add expense transaction");
    await allure.description("This test verifies the ability to add an expense transaction");
    await allure.severity("critical");

    await transactionsPage.clickAddTransactionButton();
    await newTransactionModal.modalIsVisible();
    await newTransactionModal.selectExpenseType();
    await newTransactionModal.fillAmount('1000');
    await newTransactionModal.selectExpenseCategory('Продукти');
    await newTransactionModal.fillDescription('Вино');
    await newTransactionModal.fillDate('2025-11-26');
    await newTransactionModal.selectAccount('Картка Монобанку');
    await newTransactionModal.addTag('Алкоголь');
    
    await newTransactionModal.clickCreateButton();
    await newTransactionModal.modalIsNotVisible();
    await allure.step("Verify transaction exists", async()=>{
        await transactionsPage.verifyTransactionExists('1000', 'Продукти', 'Вино');
    });
  })
  test("[Positive] Add income transaction", async()=>{
    await allure.displayName("Add income transaction");
    await allure.description("This test verifies the ability to add an income transaction");
    await allure.severity("critical");
    
    await transactionsPage.clickAddTransactionButton();
    await newTransactionModal.modalIsVisible();
    await newTransactionModal.selectIncomeType();
    await newTransactionModal.fillAmount('1000000');
    await newTransactionModal.selectIncomeCategory('Зарплата');
    await newTransactionModal.fillDescription('Листопад');
    await newTransactionModal.fillDate('2025-11-26');
    await newTransactionModal.selectAccount('Готівка');
    await newTransactionModal.addTag('Зарплата');
    
    await newTransactionModal.clickCreateButton();
    await newTransactionModal.modalIsNotVisible();
    await transactionsPage.verifyTransactionExists('1000000', 'Зарплата', 'Листопад');
  })

  test.describe.serial("Transaction CRUD operations", () => {
    let createdTransactionId: string;
    const initialAmount = '2000';
    const initialCategory = 'Транспорт';
    const initialDescription = 'Таксі до аеропорту';
    const editedAmount = '2500';
    const editedCategory = 'Транспорт';
    const editedDescription = 'Таксі до аеропорту (оновлено)';

    test("[Positive] Add transaction for edit/delete flow", async() => {
      await allure.displayName("Add transaction for edit/delete flow");
      await allure.description("This test creates a transaction that will be edited and deleted in subsequent tests");
      await allure.severity("critical");

      await transactionsPage.clickAddTransactionButton();
      await newTransactionModal.modalIsVisible();
      await newTransactionModal.selectExpenseType();
      await newTransactionModal.fillAmount(initialAmount);
      await newTransactionModal.selectExpenseCategory(initialCategory);
      await newTransactionModal.fillDescription(initialDescription);
      await newTransactionModal.fillDate('2025-11-26');
      await newTransactionModal.selectAccount('Картка Монобанку');
      
      await newTransactionModal.clickCreateButton();
      await newTransactionModal.modalIsNotVisible();
      
      await allure.step("Verify transaction exists and get ID", async() => {
        createdTransactionId = await transactionsPage.verifyTransactionExists(initialAmount, initialCategory, initialDescription);
      });
    });

    test("[Positive] Edit transaction", async() => {
      await allure.displayName("Edit transaction");
      await allure.description("This test verifies the ability to edit a transaction created in the previous test");
      await allure.severity("critical");

      await transactionsPage.clickEditTransaction(createdTransactionId);
      await newTransactionModal.modalIsVisible();
      
      await newTransactionModal.fillAmount(editedAmount);
      await newTransactionModal.fillDescription(editedDescription);
      
      await newTransactionModal.clickSaveButton();
      await newTransactionModal.modalIsNotVisible();
      
      await allure.step("Verify transaction was updated", async() => {
        await transactionsPage.verifyTransactionExists(editedAmount, editedCategory, editedDescription);
      });
    });

    test("[Positive] Delete transaction", async() => {
      await allure.displayName("Delete transaction");
      await allure.description("This test verifies the ability to delete a transaction that was edited in the previous test");
      await allure.severity("critical");

      await transactionsPage.clickDeleteTransaction(createdTransactionId);
      
      await allure.step("Verify transaction was deleted", async() => {
        await transactionsPage.verifyTransactionNotExists(createdTransactionId);
      });
    });
  });

});