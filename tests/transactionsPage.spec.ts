import { transactionsPageTerms } from '../test-data/transactionsPageTerms';
import * as allure from "allure-js-commons";
import { test } from "../fixtures/pages.fixture";
import { getUserId } from '../utils/globalMethods';
import { seedTransactions, TransactionRecord, buildTransactionFromSeed } from "../utils/transactionStorage";

test.describe("Transactions Page validation", () => {

test.beforeEach(async ({page, dashboardPage, transactionsPage }) => {
    await page.goto('/');
    await dashboardPage.waitForDashboardReady();
    await dashboardPage.navigateToTransactionsPage();
    await transactionsPage.transactionsPageTitleIsVisible();
  });

test("[Positive] Add expense transaction", async({  transactionsPage, newTransactionModal }) => {
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


  test("[Positive] Add income transaction", async({ transactionsPage, newTransactionModal }) => {
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
    let userId: string;
    let seedId: string;
    let transactionValue: TransactionRecord[] = [];

    test.beforeEach(async ({ page, dashboardPage, transactionsPage }) => {
      userId = await getUserId();
      seedId = Date.now().toString();
      transactionValue = [
        buildTransactionFromSeed(seedId, {
          ...transactionsPageTerms.initialTransaction,
          type: "expense",
          tags: []
        })
      ];

      await seedTransactions(transactionsPage.page, userId, transactionValue);
      await transactionsPage.page.reload();
      await dashboardPage.navigateToTransactionsPage();
      await transactionsPage.transactionsPageTitleIsVisible();
      createdTransactionId = seedId;
    });

    test("[Positive] Add transaction for CRUD flow using local storage ", async({ transactionsPage, newTransactionModal }) => {
      await allure.displayName("Add transaction for CRUD flow using local storage");
      await allure.description("This test creates a transaction that will be edited and deleted in subsequent tests using local storage");
      await allure.severity("critical");

      createdTransactionId = await transactionsPage.verifyTransactionExists(
        `${transactionValue[0].amount}`,
        transactionValue[0].category,
        transactionValue[0].description
      );
    });

    test("[Positive] Edit transaction", async({ transactionsPage, newTransactionModal }) => {
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

    test("[Positive] Delete transaction", async({ transactionsPage, newTransactionModal }) => {
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