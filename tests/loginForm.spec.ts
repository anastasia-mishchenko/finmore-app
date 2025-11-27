import { test, expect } from "@playwright/test";
import { LoginForm } from "../pages/LoginForm";
import { loginFormTerms } from "../test-data/loginTerms";
import { RegistrationForm } from "../pages/RegistrationForm";

test.describe("Login Form validation", () => {
  let loginForm: LoginForm;
  let registrationForm: RegistrationForm;

  test.beforeEach(async ({ page }) => {
    loginForm = new LoginForm(page);
    registrationForm = new RegistrationForm(page);
    await loginForm.goto();
    await loginForm.loginFormIsVisible();
  });
  
  test("[Login][Positive] Verify correct title is shown on Login Form", async () => {
    await loginForm.verifyTitle(loginFormTerms.loginFormTitle);
  });

  test("[Login][Positive] Verify placeholders for fields", async () => {
    await loginForm.verifyPlaceholders();
  });

  test("[Login][Negative] Verify error messages for empty fields", async () => {
    await loginForm.clickLoginButton();
    await expect(loginForm.emailError).toHaveText(loginFormTerms.emailError);
    await expect(loginForm.passwordError).toHaveText(loginFormTerms.passwordError);
  });

  test("[Login][Negative] Verify error message for invalid email format", async () => {
    await loginForm.fillEmail(loginFormTerms.invalidEmail);
    await loginForm.fillPassword(loginFormTerms.password);
    await loginForm.verifyEmailInputIsInvalid();
    await loginForm.verifyEmailValidationMessage();
    await loginForm.clickLoginButton();
    // HTML5 validation prevents form submission, so we should still be on login page
    await expect(loginForm.loginForm).toBeVisible();
  });

  test("[Login][Negative] Verify error message for invalid credentials", async () => {
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

  test("[Login][Positive] Fill in the form fields", async () => {
    await loginForm.fillEmail(loginFormTerms.email);
    await loginForm.fillPassword(loginFormTerms.password);
    await expect(loginForm.emailInput).toHaveValue(loginFormTerms.email);
    await expect(loginForm.passwordInput).toHaveValue(loginFormTerms.password);
  });

  test("[Login][Positive] Show/Hide password button functionality", async () => {
    await loginForm.fillPassword(loginFormTerms.password);
    await loginForm.verifyPasswordIsHidden();
    await loginForm.clickShowPasswordButton();
    await loginForm.verifyPasswordIsVisible();
    await loginForm.clickShowPasswordButton();
    await loginForm.verifyPasswordIsHidden();
  });

  test("[Login][Positive] Switch to registration form", async () => {
    await loginForm.clickSwitchToRegistrationButton();
    await expect(registrationForm.registerForm).toBeVisible();
  });
});
