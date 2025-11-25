import { test, expect } from "@playwright/test";
import { LoginForm } from "../pages/LoginForm";
import { loginFormTerms } from "../test-data/loginTerms";
import { DashboardPage } from "../pages/DashboardPage";
import { faker } from "@faker-js/faker";
import { RegistrationForm } from "../pages/RegistrationForm";
import { registrationFormTerms } from "../test-data/registrationFormTerms";

test.describe("Login Form validation", () => {  
  let loginForm: LoginForm;
  let dashboardPage: DashboardPage;
  let registrationForm: RegistrationForm;
  let fakerEmail: string;
  let fakerPassword: string;
  let fakerFullName: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();

    // Register a test user once before all tests
    fakerEmail = faker.internet.email();
    fakerPassword = faker.internet.password();
    fakerFullName = faker.person.fullName();
    console.log("Faker Email : " + `${fakerEmail}`);
    console.log("Faker Password : " + `${fakerPassword}`);
    
    loginForm = new LoginForm(page);
    dashboardPage = new DashboardPage(page);
    registrationForm = new RegistrationForm(page);
    await loginForm.goto();
    await loginForm.clickSwitchToRegistrationButton();
    await registrationForm.fillRegistrationForm(fakerFullName, fakerEmail, fakerPassword, fakerPassword, registrationFormTerms.currencyGBP);
    await loginForm.fillLoginForm(fakerEmail, fakerPassword);
    await dashboardPage.userMenuIsVisible();
    
    await context.close();
  });

  test.beforeEach(async ({ page }) => {
    loginForm = new LoginForm(page);
    dashboardPage = new DashboardPage(page);
    await loginForm.goto();
    await expect(loginForm.loginForm).toBeVisible();
  });

  test("[Login][Positive] Verify correct title is shown on Login Form", async () => {
    await expect(loginForm.loginTitle).toHaveText(loginFormTerms.loginFormTitle);
  });

  test("[Login][Positive] Verify placeholders for fields", async () => {
    await expect(loginForm.emailInput).toHaveAttribute(
      "placeholder",
      loginFormTerms.placeholderEmail
    );
    await expect(loginForm.passwordInput).toHaveAttribute(
      "placeholder",
      loginFormTerms.placeholderPassword
    );
  });

  test("[Login][Negative] Verify error messages for empty fields", async () => {
    await loginForm.clickLoginButton();
    await expect(loginForm.emailError).toHaveText(loginFormTerms.emailError);
    await expect(loginForm.passwordError).toHaveText(loginFormTerms.passwordError);
  });

  test("[Login][Negative] Verify error message for invalid email format", async () => {
    await loginForm.fillEmail(loginFormTerms.invalidEmail);
    await loginForm.fillPassword(loginFormTerms.password);
    await loginForm.clickLoginButton();

    const invalidEmailValidation = await loginForm.emailInput.evaluate(
      (el: any) => el.validationMessage
    );
    console.log("Invalid email validation:", invalidEmailValidation);
    expect(invalidEmailValidation).not.toBe("");
    });


  test("[Login][Negative] Verify error message for invalid credentials", async () => {
    await loginForm.fillEmail(loginFormTerms.email);
    await loginForm.fillPassword(loginFormTerms.invalidPassword);
    await loginForm.clickLoginButton();
    await expect(loginForm.invalidCredentialsError).toHaveText(loginFormTerms.invalidCredentialsError);
  });

  test("[Login][Positive] Login with valid credentials from registration", async () => {
    await loginForm.fillLoginForm(
      fakerEmail,
      fakerPassword
    );
    await loginForm.clickLoginButton();
    await dashboardPage.userMenuIsVisible();
  });

  test("[Login][Positive] Fill in the form fields", async () => {
    await loginForm.fillEmail(loginFormTerms.email);
    await loginForm.fillPassword(loginFormTerms.password);
    await expect(loginForm.emailInput).toHaveValue(loginFormTerms.email);
    await expect(loginForm.passwordInput).toHaveValue(loginFormTerms.password);
  });
});

