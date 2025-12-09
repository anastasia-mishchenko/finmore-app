//import { test, expect } from "@playwright/test";
import { LoginForm } from "../pages/LoginForm";
import { loginFormTerms } from "../test-data/loginTerms";
import { RegistrationForm } from "../pages/RegistrationForm";
import * as allure from "allure-js-commons";
import { test, expect} from "../fixtures/pages.fixture";

test.describe("Login Form validation", () => {

  test.beforeEach(async ({ loginForm }) => {
    await loginForm.goto();
    await loginForm.loginFormIsVisible();
  });
  
  test("[Login][Positive] Verify correct title is shown on Login Form", async ({ loginForm }) => {
    await allure.displayName("Verify correct title is shown on Login Form");
    await allure.description("This test verifies the correct title is shown on the Login Form");
    await allure.severity("critical");
    await loginForm.verifyTitle(loginFormTerms.loginFormTitle);
  });

  test("[Login][Positive] Verify placeholders for fields", async ({ loginForm }) => {
    await allure.displayName("Verify placeholders for fields");
    await allure.description("This test verifies the placeholders for the fields on the Login Form");
    await allure.severity("medium");
    await loginForm.verifyPlaceholders();
  });

  test("[Login][Negative] Verify error messages for empty fields", async ({ loginForm }) => {
    await allure.displayName("Verify error messages for empty fields");
    await allure.description("This test verifies the error messages for the empty fields on the Login Form");
    await allure.severity("critical");
    await loginForm.clickLoginButton();
    await expect(loginForm.emailError).toHaveText(loginFormTerms.emailError);
    await expect(loginForm.passwordError).toHaveText(loginFormTerms.passwordError);
  });

  test("[Login][Negative] Verify error message for invalid email format", async ({ loginForm }) => {
    await allure.displayName("Verify error message for invalid email format");
    await allure.description("This test verifies the error message for the invalid email format on the Login Form");
    await allure.severity("medium");
    await loginForm.fillEmail(loginFormTerms.invalidEmail);
    await loginForm.fillPassword(loginFormTerms.password);
    await loginForm.verifyEmailInputIsInvalid();
    await loginForm.verifyEmailValidationMessage();
    await loginForm.clickLoginButton();
    // HTML5 validation prevents form submission, so we should still be on login page
    await expect(loginForm.loginForm).toBeVisible();
  });

  test("[Login][Negative] Verify error message for invalid credentials", async ({ loginForm }) => {
    await allure.displayName("Verify error message for invalid credentials");
    await allure.description("This test verifies the error message for the invalid credentials on the Login Form");
    await allure.severity("critical");
    await loginForm.fillEmail(loginFormTerms.email);
    await loginForm.fillPassword(loginFormTerms.invalidPassword);
    await loginForm.clickLoginButton();
    await expect(loginForm.invalidCredentialsError).toHaveText(loginFormTerms.invalidCredentialsError);
  });

  // test("[Login][Positive] Login with valid credentials", async () => {
  //   await loginForm.fillLoginForm(fakerEmail, fakerPassword);
  //   await loginForm.clickLoginButton();
  //   await dashboardPage.userMenuIsVisible();
  // });

  test("[Login][Positive] Fill in the form fields", async ({ loginForm }) => {
    await allure.displayName("Fill in the form fields");
    await allure.description("This test verifies the ability to fill in the form fields on the Login Form");
    await allure.severity("critical");
    await loginForm.fillEmail(loginFormTerms.email);
    await loginForm.fillPassword(loginFormTerms.password);
    await expect(loginForm.emailInput).toHaveValue(loginFormTerms.email);
    await expect(loginForm.passwordInput).toHaveValue(loginFormTerms.password);
  });

  test("[Login][Positive] Show/Hide password button functionality", async ({ loginForm }) => {
    await allure.displayName("Show/Hide password button functionality");
    await allure.description("This test verifies the ability to show/hide the password button on the Login Form");
    await allure.severity("medium");
    await loginForm.fillPassword(loginFormTerms.password);
    await loginForm.verifyPasswordIsHidden();
    await loginForm.clickShowPasswordButton();
    await loginForm.verifyPasswordIsVisible();
    await loginForm.clickShowPasswordButton();
    await loginForm.verifyPasswordIsHidden();
  });

  test("[Login][Positive] Switch to registration form", async ({ loginForm, registrationForm }) => {
    await allure.displayName("Switch to registration form");
    await allure.description("This test verifies the ability to switch to the registration form on the Login Form");
    await allure.severity("critical");
    await loginForm.clickSwitchToRegistrationButton();
    await expect(registrationForm.registerForm).toBeVisible();
  });
});
