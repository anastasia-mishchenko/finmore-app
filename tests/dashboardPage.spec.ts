import { test, expect, Logger } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { RegistrationForm } from '../pages/RegistrationForm';
import { LoginForm } from '../pages/LoginForm';
import { faker } from '@faker-js/faker';
import { registrationFormTerms } from '../test-data/registrationFormTerms';
import { NewTransactionModal } from '../pages/NewTransactionModal';
import * as allure from "allure-js-commons";

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
      registrationFormTerms.currencyUAH
    );
 
    //await loginForm.fillLoginForm(fakerEmail, fakerPassword);
    await dashboardPage.userMenuIsVisible();
 
  });
 
  test("[Positive] Verify total income ampount is correct", async()=>{
    await allure.displayName("Verify total income amount");
    await allure.description("This test verifies correctness of calculating total income");
    await allure.severity("critical");

    await allure.step("Add income transaction", async()=>{
        await dashboardPage.clickAddTransactionButton();
        await newTransactionModal.fillTransactionForm('Дохід','15000', 'Інвестиції','Продаж акцій','2025-12-02', 'Картка ПриватБанку');
        await newTransactionModal.clickCreateButton();
        await newTransactionModal.modalIsNotVisible();
        await allure.step("Verify transaction exists", async()=>{
            await dashboardPage.verifyTheLastTransaction('15000', 'Інвестиції', 'Продаж акцій');
        });
    });

    await allure.step("Add income transaction", async()=>{
        await dashboardPage.clickAddTransactionButton();
        await newTransactionModal.fillTransactionForm('Дохід','5000', 'Фриланс','Проект','2025-12-02', 'Картка ПриватБанку');
        await newTransactionModal.clickCreateButton();
        await newTransactionModal.modalIsNotVisible();
        await allure.step("Verify transaction exists", async()=>{
            await dashboardPage.verifyTheLastTransaction('5000', 'Фриланс', 'Проект');
        });    

    await allure.step("Verify total income amount is correct", async()=>{
        await dashboardPage.verifyTotalIncome('20000.00 UAH');
    });
    });
  });

test ("[Positive] Verify total expences amount is correct", async()=>{
    await allure.displayName("Verify total expenses amount");
    await allure.description("This test verifies correctens of calculating total expenses");
    await allure.severity("critical");

    await allure.step("Add expense transaction", async()=>{
        await dashboardPage.clickAddTransactionButton();
        await newTransactionModal.fillTransactionForm('Витрата', '500', 'Транспорт', 'Таксі', '2025-12-01', 'Картка Монобанку');
        await newTransactionModal.clickCreateButton();
        await newTransactionModal.modalIsNotVisible();
        await allure.step("Verify transaction exists", async()=>{
            await dashboardPage.verifyTheLastTransaction('500', 'Транспорт', 'Таксі');
        });   
    });

    await allure.step("Add expense transaction", async()=>{
      await dashboardPage.clickAddTransactionButton();
      await newTransactionModal.fillTransactionForm('Витрата', '12500', 'Продукти', 'Покупка продуктів', '2025-12-01', 'Картка Монобанку');
      await newTransactionModal.clickCreateButton();
      await newTransactionModal.modalIsNotVisible();
      await allure.step("Verify transaction exists", async()=>{
          await dashboardPage.verifyTheLastTransaction('12500', 'Продукти', 'Покупка продуктів');
      });   
    });

    await allure.step("Verify total expenses amount is correct", async()=>{
        await dashboardPage.verifyTotalExpenses('13000.00 UAH');
    });
});

test ("[Positive] Verify balance amount is correct", async()=>{
    await allure.displayName("Verify balance amount");
    await allure.description("This test verifies correctness of calculating balance");
    await allure.severity("critical");
    
  await allure.step("Add income transaction", async()=>{
    await dashboardPage.clickAddTransactionButton();
    await newTransactionModal.fillTransactionForm('Дохід','15000', 'Інвестиції','Продаж акцій','2025-12-02', 'Картка ПриватБанку');
    await newTransactionModal.clickCreateButton();
    await newTransactionModal.modalIsNotVisible();
    await allure.step("Verify transaction exists", async()=>{
        await dashboardPage.verifyTheLastTransaction('15000', 'Інвестиції', 'Продаж акцій');
    });
  });

  await allure.step("Add expense transaction", async()=>{
    await dashboardPage.clickAddTransactionButton();
    await newTransactionModal.fillTransactionForm('Витрата', '5000', 'Продукти', 'Покупка продуктів', '2025-12-01', 'Картка Монобанку');
    await newTransactionModal.clickCreateButton();
    await newTransactionModal.modalIsNotVisible();
    await allure.step("Verify transaction exists", async()=>{
        await dashboardPage.verifyTheLastTransaction('5000', 'Продукти', 'Покупка продуктів');
    });
  });

  await allure.step("Verify balance amount is correct", async()=>{
    await dashboardPage.verifyBalance('10000.00 UAH');
  });
});

});
