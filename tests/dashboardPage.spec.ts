import { test, expect } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { RegistrationForm } from '../pages/RegistrationForm';
import { LoginForm } from '../pages/LoginForm';
import { faker } from '@faker-js/faker';
import { registrationFormTerms } from '../test-data/registrationFormTerms';
import { dashboardPageTerms } from '../test-data/dashboardPageTerms';
import { NewTransactionModal } from '../pages/NewTransactionModal';
import * as allure from "allure-js-commons";
 
test.describe("Dashboard Page validation", () => {
 
  test.beforeEach(async ({ page }) => {
    const registrationForm = new RegistrationForm(page);
    const loginForm = new LoginForm(page);
    const dashboardPage = new DashboardPage(page);
 
    const fakerEmail = faker.internet.email();
    const fakerPassword = faker.internet.password();
    const fakerFullName = faker.person.fullName();
 
    await loginForm.goto();
    await loginForm.clickSwitchToRegistrationButton();
 
    await registrationForm.fillRegistrationForm(
      fakerFullName,
      fakerEmail,
      fakerPassword,
      fakerPassword,
      registrationFormTerms.currencyUAH
    );
 
    await dashboardPage.userMenuIsVisible();
  });
 
  
  test("[Positive] Verify total income amount is correct", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const newTransactionModal = new NewTransactionModal(page);
 
    await allure.displayName("Verify total income amount");
    await allure.description("This test verifies correctness of calculating total income");
    await allure.severity("critical");
 
    await allure.step("Add first income transaction", async () => {
      await dashboardPage.clickAddTransactionButton();
      await newTransactionModal.fillTransactionForm(
        dashboardPageTerms.incomeTransaction1.type,
        dashboardPageTerms.incomeTransaction1.amount,
        dashboardPageTerms.incomeTransaction1.category,
        dashboardPageTerms.incomeTransaction1.description,
        faker.date.recent().toISOString().slice(0, 10),
        dashboardPageTerms.incomeTransaction1.account
      );
      await newTransactionModal.clickCreateButton();
      await newTransactionModal.modalIsNotVisible();
      await dashboardPage.verifyTheLastTransaction(
          dashboardPageTerms.incomeTransaction1.amount,
          dashboardPageTerms.incomeTransaction1.category,
          dashboardPageTerms.incomeTransaction1.description
      );
    });

    await allure.step("Add second income transaction", async () => {
      await dashboardPage.clickAddTransactionButton();
      await newTransactionModal.fillTransactionForm(
        dashboardPageTerms.incomeTransaction2.type,
        dashboardPageTerms.incomeTransaction2.amount,
        dashboardPageTerms.incomeTransaction2.category,
        dashboardPageTerms.incomeTransaction2.description,
        faker.date.recent().toISOString().slice(0, 10),
        dashboardPageTerms.incomeTransaction2.account
      );
      await newTransactionModal.clickCreateButton();
      await newTransactionModal.modalIsNotVisible();
      await dashboardPage.verifyTheLastTransaction(
          dashboardPageTerms.incomeTransaction2.amount,
          dashboardPageTerms.incomeTransaction2.category,
          dashboardPageTerms.incomeTransaction2.description
      );
    });

    await allure.step("Verify total income amount", async () => {
      await dashboardPage.verifyTotalIncome(dashboardPageTerms.expectedTotalIncome);
    });
  });
 
  
  test("[Positive] Verify total expenses amount is correct", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const newTransactionModal = new NewTransactionModal(page);
 
    await allure.displayName("Verify total expenses amount");
 
    await allure.step("Add first expense", async () => {
      await dashboardPage.clickAddTransactionButton();
      await newTransactionModal.fillTransactionForm(
        dashboardPageTerms.expenseTransaction1.type,
        dashboardPageTerms.expenseTransaction1.amount,
        dashboardPageTerms.expenseTransaction1.category,
        dashboardPageTerms.expenseTransaction1.description,
        faker.date.recent().toISOString().slice(0, 10),
        dashboardPageTerms.expenseTransaction1.account
      );
      await newTransactionModal.clickCreateButton();
      await newTransactionModal.modalIsNotVisible();
      await dashboardPage.verifyTheLastTransaction(
          dashboardPageTerms.expenseTransaction1.amount,
          dashboardPageTerms.expenseTransaction1.category,
          dashboardPageTerms.expenseTransaction1.description
      );
    });

    await allure.step("Add second expense", async () => {
      await dashboardPage.clickAddTransactionButton();
      await newTransactionModal.fillTransactionForm(
        dashboardPageTerms.expenseTransaction2.type,
        dashboardPageTerms.expenseTransaction2.amount,
        dashboardPageTerms.expenseTransaction2.category,
        dashboardPageTerms.expenseTransaction2.description,
        faker.date.recent().toISOString().slice(0, 10),
        dashboardPageTerms.expenseTransaction2.account
      );
      await newTransactionModal.clickCreateButton();
      await newTransactionModal.modalIsNotVisible();
      await dashboardPage.verifyTheLastTransaction(
          dashboardPageTerms.expenseTransaction2.amount,
          dashboardPageTerms.expenseTransaction2.category,
          dashboardPageTerms.expenseTransaction2.description
      );
    });

    await allure.step("Verify total expenses", async () => {
      await dashboardPage.verifyTotalExpenses(dashboardPageTerms.expectedTotalExpenses);
    });
  });
 
 
  test("[Positive] Verify balance amount is correct", async ({ page }) => {
    const dashboardPage = new DashboardPage(page);
    const newTransactionModal = new NewTransactionModal(page);
 
    await allure.displayName("Verify balance amount");
 
    await allure.step("Add income", async () => {
      await dashboardPage.clickAddTransactionButton();
      await newTransactionModal.fillTransactionForm(
        dashboardPageTerms.incomeTransaction1.type,
        dashboardPageTerms.incomeTransaction1.amount,
        dashboardPageTerms.incomeTransaction1.category,
        dashboardPageTerms.incomeTransaction1.description,
        faker.date.recent().toISOString().slice(0, 10),
        dashboardPageTerms.incomeTransaction1.account
      );
      await newTransactionModal.clickCreateButton();
      await dashboardPage.verifyTheLastTransaction(
          dashboardPageTerms.incomeTransaction1.amount,
          dashboardPageTerms.incomeTransaction1.category,
          dashboardPageTerms.incomeTransaction1.description
      );
    });

    await allure.step("Add expense", async () => {
      await dashboardPage.clickAddTransactionButton();
      await newTransactionModal.fillTransactionForm(
        dashboardPageTerms.expenseTransaction3.type,
        dashboardPageTerms.expenseTransaction3.amount,
        dashboardPageTerms.expenseTransaction3.category,
        dashboardPageTerms.expenseTransaction3.description,
        faker.date.recent().toISOString().slice(0, 10),
        dashboardPageTerms.expenseTransaction3.account
      );
      await newTransactionModal.clickCreateButton();
      await dashboardPage.verifyTheLastTransaction(
          dashboardPageTerms.expenseTransaction3.amount,
          dashboardPageTerms.expenseTransaction3.category,
          dashboardPageTerms.expenseTransaction3.description
      );
    });

    await allure.step("Verify balance", async () => {
      await dashboardPage.verifyBalance(dashboardPageTerms.expectedBalance);
    });
  });
 
});