import { expect, Locator, Page } from "@playwright/test";   
import { registrationFormTerms } from "../test-data/registrationFormTerms";
import { clickElement, fillElement, verifyInputIsInvalid, verifyInputValidationMessage, verifyInputValue } from "../utils/globalMethods";

export class RegistrationForm {
    readonly page : Page;
    readonly registerForm : Locator;
    readonly registerTitle : Locator;
    readonly fullNameInput : Locator;
    readonly emailInput : Locator;
    readonly passwordInput : Locator;
    readonly showPasswordButton : Locator;
    readonly confirmPasswordInput : Locator;
    readonly showConfirmPasswordButton : Locator;

    //currency select with options
    readonly mainCurrencySelect : Locator;
    readonly currencyUAH : Locator;
    readonly currencyUSD : Locator;
    readonly currencyEUR : Locator;
    readonly currencyGBP : Locator;

    //register button 
    readonly registerButton : Locator;

    //register form errors
    readonly fullNameError : Locator;
    readonly emailError : Locator;
    readonly passwordError: Locator;
    readonly confirmPasswordError: Locator;

    //login button
    readonly loginButton : Locator;
    

    constructor(page : Page) {
        this.page = page;
        this.registerForm = page.getByTestId('register-form');
        this.registerTitle = page.getByTestId('register-title');
        this.fullNameInput = page.getByTestId('register-name-input');
        this.emailInput = page.getByTestId('register-email-input');
        this.passwordInput = page.getByTestId('register-password-input');
        this.showPasswordButton = page.locator('[data-testid="register-password-input"]').locator('..').locator('..').getByTestId('toggle-password-visibility').first();
        this.confirmPasswordInput = page.getByTestId('register-confirm-password-input');
        this.showConfirmPasswordButton = page.locator('[data-testid="register-confirm-password-input"]').locator('..').locator('..').getByTestId('toggle-password-visibility').first();

        this.mainCurrencySelect = page.getByTestId('register-currency-select');
        this.currencyUAH = page.getByTestId('curency-option-UAH');
        this.currencyUSD = page.getByTestId('curency-option-USD');
        this.currencyEUR = page.getByTestId('curency-option-EUR');
        this.currencyGBP = page.getByTestId('curency-option-GBP');

        this.registerButton = page.getByTestId('register-submit-button');

        this.fullNameError = page.getByTestId('name-error');
        this.emailError = page.getByTestId('email-error');
        this.passwordError = page.getByTestId('password-error');
        this.confirmPasswordError = page.getByTestId('confirm-password-error');

        this.loginButton = page.getByTestId('switch-to-login-button');
    }

    async verifyPlaceholders() {
        await expect(this.fullNameInput).toHaveAttribute('placeholder', registrationFormTerms.placeholderFullName);
        await expect(this.emailInput).toHaveAttribute('placeholder', registrationFormTerms.placeholderEmail);
        await expect(this.passwordInput).toHaveAttribute('placeholder', registrationFormTerms.placeholderPassword);
        await expect(this.confirmPasswordInput).toHaveAttribute('placeholder', registrationFormTerms.placeholderConfirmPassword);
    }

    async fillFullName(fullName : string) {
        await fillElement(this.fullNameInput, fullName, 'Full name input');
        await verifyInputValue(this.fullNameInput, fullName, 'Full name input');
    }

    async fillEmail(email : string) {
        await fillElement(this.emailInput, email, 'Email input');
        await verifyInputValue(this.emailInput, email, 'Email input');
    }

    async fillPassword(password : string) {
        await fillElement(this.passwordInput, password, 'Password input');
        await verifyInputValue(this.passwordInput, password, 'Password input');
    }

    async fillConfirmPassword(confirmPassword : string) {
        await fillElement(this.confirmPasswordInput, confirmPassword, 'Confirm password input');
        await verifyInputValue(this.confirmPasswordInput, confirmPassword, 'Confirm password input');
    }

    async selectMainCurrency(currency : string) {
        await this.mainCurrencySelect.selectOption(currency);
    }

    async clickRegisterButton() {
        await clickElement(this.registerButton, 'Register button');
    }

    async clickLoginButton() {
        await clickElement(this.loginButton, 'Login button');
    }

    async fillRegistrationForm(fullName : string, email : string, password : string, confirmPassword : string, currency : string) {
        await fillElement(this.fullNameInput, fullName, 'Full name input');
        await fillElement(this.emailInput, email, 'Email input');
        await fillElement(this.passwordInput, password, 'Password input');
        await fillElement(this.confirmPasswordInput, confirmPassword, 'Confirm password input');
        await this.mainCurrencySelect.selectOption(currency);
        await clickElement(this.registerButton, 'Register button');
    }

    async clickShowPasswordButton() {
        await clickElement(this.showPasswordButton, 'Show password button');
    }

    async clickShowConfirmPasswordButton() {
        await clickElement(this.showConfirmPasswordButton, 'Show confirm password button');
    }

    async verifyPasswordIsVisible() {
        await expect(this.passwordInput).toHaveAttribute('type', 'text');
    }

    async verifyPasswordIsHidden() {
        await expect(this.passwordInput).toHaveAttribute('type', 'password');
    }

    async verifyConfirmPasswordIsVisible() {
        await expect(this.confirmPasswordInput).toHaveAttribute('type', 'text');
    }

    async verifyConfirmPasswordIsHidden() {
        await expect(this.confirmPasswordInput).toHaveAttribute('type', 'password');
    }

    async verifyEmailInputIsInvalid() {
        await verifyInputIsInvalid(this.emailInput, 'Email input');
    }

    async verifyEmailValidationMessage() {
        await verifyInputValidationMessage(this.emailInput, 'Email input');
    }

}

