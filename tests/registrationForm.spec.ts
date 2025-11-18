import { test, expect } from '@playwright/test';
import { RegistrationForm } from '../pages/RegistrationForm';
import { registrationFormTerms } from '../test-data/registrationFormTerms';
import { LoginForm } from '../pages/LoginForm';

test.describe("Registration Form validation", () => {
    let loginForm : LoginForm;
    let registrationForm : RegistrationForm;

    test.beforeEach(async ({ page }) => {
        loginForm = new LoginForm(page);
        registrationForm = new RegistrationForm(page);
        await loginForm.goto();
        await expect(loginForm.loginForm).toBeVisible();
        await loginForm.clickSwitchToRegistrationButton();
        await expect(registrationForm.registerForm).toBeVisible();
    })

    test ("[Registration][Positive] Verify correct title is shown on Registration Form", async () => {
        await expect(registrationForm.registerTitle).toHaveText(registrationFormTerms.registrationFormTitle);
    })

    test ("[Registration][Positive] Verify placeholders for fields", async () => {
        await registrationForm.verifyPlaceholders();
    })

    test ("[Registration][Negative] Verify error messages for fields", async () => {
        await registrationForm.clickRegisterButton();
        await expect(registrationForm.fullNameError).toHaveText(registrationFormTerms.fullNameError);
        await expect(registrationForm.emailError).toHaveText(registrationFormTerms.emailError);
        await expect(registrationForm.passwordError).toHaveText(registrationFormTerms.passwordError);
        await expect(registrationForm.confirmPasswordError).toHaveText(registrationFormTerms.confirmPasswordError);
    })

    test ("[Registration][Negative] Verify error message for password min length", async () => {
        await registrationForm.fillFullName(registrationFormTerms.fullName);
        await registrationForm.fillEmail(registrationFormTerms.email);
        await registrationForm.fillPassword(registrationFormTerms.passwordShort);
        await registrationForm.clickRegisterButton();
        await expect(registrationForm.passwordError).toHaveText(registrationFormTerms.passwordMinLengthError);
    })

    test ("[Registration][Negative] Verify error message for confirm password match", async () => {
        await registrationForm.fillFullName(registrationFormTerms.fullName);
        await registrationForm.fillEmail(registrationFormTerms.email);
        await registrationForm.fillPassword(registrationFormTerms.password);
        await registrationForm.fillConfirmPassword(registrationFormTerms.passwordShort);
        await registrationForm.clickRegisterButton();
        await expect(registrationForm.confirmPasswordError).toHaveText(registrationFormTerms.confirmPasswordMatchError);
    })

    

});




