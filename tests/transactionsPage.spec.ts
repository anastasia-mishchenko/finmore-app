import { test, expect, Logger, Page, BrowserContext } from '@playwright/test';
import { TransactionsPage } from '../pages/TransactionsPage';
import { NewTransactionModal } from '../pages/NewTransactionModal';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginForm } from '../pages/LoginForm';
import { RegistrationForm } from '../pages/RegistrationForm';
import { faker } from '@faker-js/faker';
import { registrationFormTerms } from '../test-data/registrationFormTerms';
import { transactionsPageTerms } from '../test-data/transactionsPageTerms';
import * as allure from "allure-js-commons";
import { checkVisibility } from '../utils/globalMethods';

test.describe("Transactions Page validation", () => {
    let page: Page;
    let context: BrowserContext;
    let transactionsPage: TransactionsPage;
    let newTransactionModal: NewTransactionModal;
    let dashboardPage: DashboardPage;
    let loginForm: LoginForm;
    let registrationForm: RegistrationForm;

    const randomDate = faker.date.recent().toISOString().slice(0, 10);
    const email = faker.internet.email();
    const password = faker.internet.password();
    const fullname = faker.person.fullName();

    test.beforeAll(async ({ browser }) => {
        await allure.displayName("Transactions Page validation");
        context = await browser.newContext();
        page = await context.newPage();

        loginForm = new LoginForm(page);
        registrationForm = new RegistrationForm(page);
        dashboardPage = new DashboardPage(page);
        transactionsPage = new TransactionsPage(page);
        newTransactionModal = new NewTransactionModal(page);
     
        await loginForm.goto();
        await loginForm.clickSwitchToRegistrationButton();
        await registrationForm.fillRegistrationForm(
          fullname,
          email,
          password,
          password,
          registrationFormTerms.currencyUAH
        );
     
        //await loginForm.fillLoginForm(fakerEmail, fakerPassword);
        await dashboardPage.userMenuIsVisible();
        await dashboardPage.navigateToTransactionsPage();
        await transactionsPage.transactionsPageTitleIsVisible();
     
      });

test("[Positive] Add expense transaction", async()=>{
    await allure.displayName("Add expense transaction");
    await allure.description("This test verifies the ability to add an expense transaction");
    await allure.severity("critical");

    await transactionsPage.clickAddTransactionButton();
    await newTransactionModal.modalIsVisible();
    await newTransactionModal.selectExpenseType();
    await newTransactionModal.fillAmount(transactionsPageTerms.expenseTransaction.amount);
    await newTransactionModal.selectExpenseCategory(transactionsPageTerms.expenseTransaction.category);
    await newTransactionModal.fillDescription(transactionsPageTerms.expenseTransaction.description);
    await newTransactionModal.fillDate(transactionsPageTerms.expenseTransaction.date);
    await newTransactionModal.selectAccount(transactionsPageTerms.expenseTransaction.account);
    await newTransactionModal.addTag(transactionsPageTerms.expenseTransaction.tag);
    
    await newTransactionModal.clickCreateButton();
    await newTransactionModal.modalIsNotVisible();
    await allure.step("Verify transaction exists", async()=>{
        await transactionsPage.verifyTransactionExists(
            transactionsPageTerms.expenseTransaction.amount,
            transactionsPageTerms.expenseTransaction.category,
            transactionsPageTerms.expenseTransaction.description
        );
    });
  })


  test("[Positive] Add income transaction", async()=>{
    await allure.displayName("Add income transaction");
    await allure.description("This test verifies the ability to add an income transaction");
    await allure.severity("critical");
    
    await transactionsPage.clickAddTransactionButton();
    await newTransactionModal.modalIsVisible();
    await newTransactionModal.selectIncomeType();
    await newTransactionModal.fillAmount(transactionsPageTerms.incomeTransaction.amount);
    await newTransactionModal.selectIncomeCategory(transactionsPageTerms.incomeTransaction.category);
    await newTransactionModal.fillDescription(transactionsPageTerms.incomeTransaction.description);
    await newTransactionModal.fillDate(transactionsPageTerms.incomeTransaction.date);
    await newTransactionModal.selectAccount(transactionsPageTerms.incomeTransaction.account);
    await newTransactionModal.addTag(transactionsPageTerms.incomeTransaction.tag);
    
    await newTransactionModal.clickCreateButton();
    await newTransactionModal.modalIsNotVisible();
    await transactionsPage.verifyTransactionExists(
        transactionsPageTerms.incomeTransaction.amount,
        transactionsPageTerms.incomeTransaction.category,
        transactionsPageTerms.incomeTransaction.description
    );
  })

  test.describe.serial("Transaction CRUD operations", () => {
    let createdTransactionId: string;

    test("[Positive] Add transaction for edit/delete flow", async() => {
      await allure.displayName("Add transaction for edit/delete flow");
      await allure.description("This test creates a transaction that will be edited and deleted in subsequent tests");
      await allure.severity("critical");

      await transactionsPage.clickAddTransactionButton();
      await newTransactionModal.modalIsVisible();
      await newTransactionModal.selectExpenseType();
      await newTransactionModal.fillAmount(transactionsPageTerms.initialTransaction.amount);
      await newTransactionModal.selectExpenseCategory(transactionsPageTerms.initialTransaction.category);
      await newTransactionModal.fillDescription(transactionsPageTerms.initialTransaction.description);
      await newTransactionModal.fillDate(transactionsPageTerms.initialTransaction.date);
      await newTransactionModal.selectAccount(transactionsPageTerms.initialTransaction.account);
      
      await newTransactionModal.clickCreateButton();
      await newTransactionModal.modalIsNotVisible();
      
      await allure.step("Verify transaction exists and get ID", async() => {
        createdTransactionId = await transactionsPage.verifyTransactionExists(
            transactionsPageTerms.initialTransaction.amount,
            transactionsPageTerms.initialTransaction.category,
            transactionsPageTerms.initialTransaction.description
        );
      });
    });

    test("[Positive] Edit transaction", async() => {
      await allure.displayName("Edit transaction");
      await allure.description("This test verifies the ability to edit a transaction created in the previous test");
      await allure.severity("critical");

      await transactionsPage.clickEditTransaction(createdTransactionId);
      await newTransactionModal.modalIsVisible();
      
      await newTransactionModal.fillAmount(transactionsPageTerms.editedTransaction.amount);
      await newTransactionModal.fillDescription(transactionsPageTerms.editedTransaction.description);
      
      await newTransactionModal.clickSaveButton();
      await newTransactionModal.modalIsNotVisible();
      
      await allure.step("Verify transaction was updated", async() => {
        await transactionsPage.verifyTransactionExists(
            transactionsPageTerms.editedTransaction.amount,
            transactionsPageTerms.editedTransaction.category,
            transactionsPageTerms.editedTransaction.description
        );
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