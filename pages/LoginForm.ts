import { expect, Locator, Page } from "@playwright/test";
import { checkVisibility, clickElement, fillElement, verifyInputIsInvalid, verifyInputValidationMessage, verifyInputValue } from "../utils/globalMethods";
import { loginFormTerms } from "../test-data/loginTerms";

export class LoginForm {
    readonly page : Page;
    readonly loginForm : Locator;
    readonly loginTitle : Locator;
    readonly emailInput : Locator;
    readonly passwordInput : Locator;
    readonly showPasswordButton : Locator;
    readonly loginButton : Locator;
    readonly switchToRegistrationButton : Locator;
    
    //login form errors
    readonly emailError : Locator;
    readonly passwordError : Locator;
    readonly invalidCredentialsError : Locator;

    constructor(page : Page) {
        this.page = page;
        this.loginForm = page.getByTestId('login-form');
        this.loginTitle = page.getByTestId('login-title');
        this.emailInput = page.getByTestId('login-email-input');
        this.passwordInput = page.getByTestId('login-password-input');
        this.showPasswordButton = page.getByTestId('toggle-password-visibility');
        this.loginButton = page.getByTestId('login-submit-button');
        this.switchToRegistrationButton = page.getByTestId('switch-to-register-button');

        this.emailError = page.getByTestId('email-error');
        this.passwordError = page.getByTestId('password-error');
        this.invalidCredentialsError = page.getByTestId('login-error');
    }
    async goto() {
        await this.page.goto('/');
    }

    async fillEmail(email : string) {
        await this.emailInput.fill(email);
        await expect(this.emailInput).toHaveValue(email);
    }

    async fillPassword(password : string) {
        await this.passwordInput.fill(password);
        await expect(this.passwordInput).toHaveValue(password);
    }
    
    async clickLoginButton() {
        await clickElement(this.loginButton, 'Send button');
    }

    async clickSwitchToRegistrationButton() {
        await clickElement(this.switchToRegistrationButton, 'Registration link');
    }

    async fillLoginForm(email : string, password : string) {
        await fillElement(this.emailInput, email, 'Email field');
        await fillElement(this.passwordInput, password, 'Password field');
    }
    
    async loginFormIsVisible() {
        await checkVisibility(this.loginForm, 'Login form');
    }

    async verifyTitle(expectedTitle: string) {
        await verifyInputValue(this.loginTitle, expectedTitle, 'Login title');
    }

    async verifyPlaceholders() {
        await expect(this.emailInput).toHaveAttribute('placeholder', loginFormTerms.placeholderEmail);
        await expect(this.passwordInput).toHaveAttribute('placeholder', loginFormTerms.placeholderPassword);
    }

    async clickShowPasswordButton() {
        await clickElement(this.showPasswordButton, 'Show password button');
    }

    async verifyPasswordIsVisible() {
        await expect(this.passwordInput).toHaveAttribute('type', 'text');
    }

    async verifyPasswordIsHidden() {
        await expect(this.passwordInput).toHaveAttribute('type', 'password');
    }

    async verifyEmailInputIsInvalid() {
        await verifyInputIsInvalid(this.emailInput, 'Email input');
    }

    async verifyEmailValidationMessage() {
        await verifyInputValidationMessage(this.emailInput, 'Email input');
    }
}