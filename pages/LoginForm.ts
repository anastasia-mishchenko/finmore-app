import { Locator, Page } from "@playwright/test";

export class LoginForm {
    readonly page : Page;
    readonly loginForm : Locator;
    readonly loginTitle : Locator;
    readonly emailInput : Locator;
    readonly passwordInput : Locator;
    readonly loginButton : Locator;
    readonly switchToRegistrationButton : Locator;
    
    //login form errors
    readonly emailError : Locator;
    readonly passwordError : Locator;
    readonly invalidCredentialsError : Locator;

    constructor(page : Page) {
        this.page = page;
        this.loginForm = page.locator('data-testid=login-form');
        this.loginTitle = page.locator('data-testid=login-title');
        this.emailInput = page.locator('data-testid=login-email-input');
        this.passwordInput = page.locator('data-testid=login-password-input');
        this.loginButton = page.locator('data-testid=login-submit-button');
        this.switchToRegistrationButton = page.locator('data-testid=switch-to-register-button');

        //login form errors
        this.emailError = page.locator('data-testid=email-error');
        this.passwordError = page.locator('data-testid=password-error');
        this.invalidCredentialsError = page.locator('data-testid=login-error');
    }
    async goto() {
        await this.page.goto('/');
    }

    async fillEmail(email : string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password : string) {
        await this.passwordInput.fill(password);
    }
    
    async clickLoginButton() {
        await this.loginButton.click();
    }

    async clickSwitchToRegistrationButton() {
        await this.switchToRegistrationButton.click();
    }

    async fillLoginForm(email : string, password : string) {
        await this.fillEmail(email);
        await this.fillPassword(password);
    }
}