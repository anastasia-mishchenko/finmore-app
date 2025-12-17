import { test, expect } from "../fixtures/pages.fixture";
import { registrationFormTerms } from "../test-data/registrationFormTerms";
//import {
//generateUniqueEmail,
//  generateUkrainianFullName,
//  generatePassword,
//} from "../test-data/randomDataGenerationForRegistration";  
import { faker } from "@faker-js/faker";
import * as allure from "allure-js-commons";

// Force blank storage so registration tests start logged out
test.use({ storageState: { cookies: [], origins: [] } });

test.describe("Registration Form validation", () => {

  test.beforeEach(async ({ loginForm, registrationForm, dashboardPage }) => {
    await loginForm.goto();
    await expect(loginForm.loginForm).toBeVisible();
    await loginForm.clickSwitchToRegistrationButton();
    await expect(registrationForm.registerForm).toBeVisible();
  });

  test("[Registration][Positive] Verify correct title is shown on Registration Form", async ({ registrationForm }) => {
    await allure.displayName("Verify correct title is shown on Registration Form");
    await allure.description("This test verifies the correct title is shown on the Registration Form");
    await allure.severity("critical");
    await expect(registrationForm.registerTitle).toHaveText(
      registrationFormTerms.registrationFormTitle
    );
  });

  test("[Registration][Positive] Verify placeholders for fields", async ({ registrationForm }) => {
    await allure.displayName("Verify placeholders for fields");
    await allure.description("This test verifies the placeholders for the fields on the Registration Form");
    await allure.severity("critical");
    await registrationForm.verifyPlaceholders();
  });

  test("[Registration][Negative] Verify error messages for fields", async ({ registrationForm }) => {
    await allure.displayName("Verify error messages for fields");
    await allure.description("This test verifies the error messages for the fields on the Registration Form");
    await allure.severity("critical");
    await registrationForm.clickRegisterButton();
    await expect(registrationForm.fullNameError).toHaveText(registrationFormTerms.fullNameError);
    await expect(registrationForm.emailError).toHaveText(registrationFormTerms.emailError);
    await expect(registrationForm.passwordError).toHaveText(registrationFormTerms.passwordError);
    await expect(registrationForm.confirmPasswordError).toHaveText(registrationFormTerms.confirmPasswordError);
  });

  test("[Registration][Negative] Verify error message for password min length", async ({ registrationForm }) => {
    await allure.displayName("Verify error message for password min length");
    await allure.description("This test verifies the error message for the password min length on the Registration Form");
    await allure.severity("critical");
    await registrationForm.fillFullName(registrationFormTerms.fullName);
    await registrationForm.fillEmail(registrationFormTerms.email);
    await registrationForm.fillPassword(registrationFormTerms.passwordShort);
    await registrationForm.clickRegisterButton();
    await expect(registrationForm.passwordError).toHaveText(registrationFormTerms.passwordMinLengthError);
  });

  test("[Registration][Negative] Verify error message for confirm password match", async ({ registrationForm }) => {
    await allure.displayName("Verify error message for confirm password match");
    await allure.description("This test verifies the error message for the confirm password match on the Registration Form");
    await allure.severity("critical");
    await registrationForm.fillFullName(registrationFormTerms.fullName);
    await registrationForm.fillEmail(registrationFormTerms.email);
    await registrationForm.fillPassword(registrationFormTerms.password);
    await registrationForm.fillConfirmPassword(registrationFormTerms.passwordShort);
    await registrationForm.clickRegisterButton();
    await expect(registrationForm.confirmPasswordError).toHaveText(registrationFormTerms.confirmPasswordMatchError);
  });

  test("[Registration][Positive] Fill in the form fields", async ({ registrationForm, dashboardPage }) => {
    await allure.displayName("Fill in the form fields");
    await allure.description("This test verifies the ability to fill in the form fields on the Registration Form");
    await allure.severity("critical");
    // const email = generateUniqueEmail();
    // const fullName = generateUkrainianFullName();
    // const password = generatePassword();
    // console.log("Email : " + `${email}`);
    // console.log("Full Name : " + `${fullName}`);
    // console.log("Password : " + `${password}`);

    const fakerEmail = faker.internet.email();
    const fakerFullName = faker.person.fullName();
    const fakerPassword = faker.internet.password();
    console.log("Faker Email : " + `${fakerEmail}`);
    console.log("Faker Full Name : " + `${fakerFullName}`);
    console.log("Faker Password : " + `${fakerPassword}`);

    await registrationForm.fillRegistrationForm(
      fakerFullName, 
      fakerEmail, 
      fakerPassword, 
      fakerPassword, 
      registrationFormTerms.currencyGBP
    );
    await dashboardPage.userMenuIsVisible();
  });

  test("[Registration][Positive] Show/Hide password button functionality", async ({ registrationForm }) => {
    await allure.displayName("Show/Hide password button functionality");
    await allure.description("This test verifies the ability to show/hide the password button on the Registration Form");
    await allure.severity("critical");
    await registrationForm.fillPassword(registrationFormTerms.password);
    await registrationForm.verifyPasswordIsHidden();
    await registrationForm.clickShowPasswordButton();
    await registrationForm.verifyPasswordIsVisible();
    await registrationForm.clickShowPasswordButton();
    await registrationForm.verifyPasswordIsHidden();
  });

  test("[Registration][Positive] Switch back to login form", async ({ loginForm, registrationForm }) => {
    await allure.displayName("Switch back to login form");
    await allure.description("This test verifies the ability to switch back to the login form on the Registration Form");
    await allure.severity("critical");
    await registrationForm.clickLoginButton();
    await expect(loginForm.loginForm).toBeVisible();
  });

  test("[Registration][Negative] Verify error message for invalid email format", async ({ registrationForm }) => {
    await allure.displayName("Verify error message for invalid email format");
    await allure.description("This test verifies the error message for the invalid email format on the Registration Form");
    await allure.severity("critical");
    await registrationForm.fillFullName(registrationFormTerms.fullName);
    await registrationForm.fillEmail(registrationFormTerms.invalidEmail);
    await registrationForm.fillPassword(registrationFormTerms.password);
    await registrationForm.fillConfirmPassword(registrationFormTerms.password);
    await registrationForm.clickRegisterButton();
    await registrationForm.verifyEmailInputIsInvalid();
    await registrationForm.verifyEmailValidationMessage();
  });

  test("[Registration][Positive] Select UAH currency", async ({ registrationForm }) => {
    await allure.displayName("Select UAH currency");
    await allure.description("This test verifies the ability to select the UAH currency on the Registration Form");
    await allure.severity("critical");
    await registrationForm.selectMainCurrency(registrationFormTerms.currencyUAH);
    await expect(registrationForm.mainCurrencySelect).toHaveValue(registrationFormTerms.currencyUAH);
  });

  test("[Registration][Positive] Select USD currency", async ({ registrationForm }) => {
    await allure.displayName("Select USD currency");
    await allure.description("This test verifies the ability to select the USD currency on the Registration Form");
    await allure.severity("critical");
    await registrationForm.selectMainCurrency(registrationFormTerms.currencyUSD);
    await expect(registrationForm.mainCurrencySelect).toHaveValue(registrationFormTerms.currencyUSD);
  });

  test("[Registration][Positive] Select EUR currency", async ({ registrationForm }) => {
    await allure.displayName("Select EUR currency");
    await allure.description("This test verifies the ability to select the EUR currency on the Registration Form");
    await allure.severity("critical");
    await registrationForm.selectMainCurrency(registrationFormTerms.currencyEUR);
    await expect(registrationForm.mainCurrencySelect).toHaveValue(registrationFormTerms.currencyEUR);
  });

  test("[Registration][Positive] Select GBP currency", async ({ registrationForm }) => {
    await allure.displayName("Select GBP currency");
    await allure.description("This test verifies the ability to select the GBP currency on the Registration Form");
    await allure.severity("critical");
    await registrationForm.selectMainCurrency(registrationFormTerms.currencyGBP);
    await expect(registrationForm.mainCurrencySelect).toHaveValue(registrationFormTerms.currencyGBP);
  });
});

