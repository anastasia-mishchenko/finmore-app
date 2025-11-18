import { expect, Locator, Page } from "@playwright/test";   
import { registrationFormTerms } from "../test-data/registrationFormTerms";

export class RegistrationForm {
    readonly page : Page;
    readonly registerForm : Locator;
    readonly registerTitle : Locator;
    readonly fullNameInput : Locator;
    readonly emailInput : Locator;
    readonly passwordInput : Locator;
    readonly confirmPasswordInput : Locator;

    //currency select with options
    readonly mainCurrencySelect : Locator;
    readonly currencyUAH : Locator;
    readonly currencyUSD : Locator;
    readonly currencyEUR : Locator;
    readonly currencyGBP : Locator;

    //register button 
    readonly registerButton : Locator;

    //register form errors
    readonly emailError : Locator;
    readonly passwordError: Locator;
    readonly confirmPasswordError: Locator;

    //login button
    readonly loginButton : Locator;
    

    constructor(page : Page) {
        this.page = page;
        this.registerForm = page.locator('data-testid=register-form');
        this.registerTitle = page.locator('data-testid=register-title');
        this.fullNameInput = page.locator('data-testid=register-name-input');
        this.emailInput = page.locator('data-testid=register-email-input')
        this.passwordInput = page.locator('data-testid=register-password-input');
        this.confirmPasswordInput = page.locator('data-testid=register-confirm-password-input');

        //currency select with options
        this.mainCurrencySelect = page.locator('data-testid=register-currency-select');
        this.currencyUAH = page.locator('data-testid=curency-option-UAH');
        this.currencyUSD = page.locator('data-testid=curency-option-USD');
        this.currencyEUR = page.locator('data-testid=curency-option-EUR');
        this.currencyGBP = page.locator('data-testid=curency-option-GBP');

        //register button
        this.registerButton = page.locator('data-testid=register-submit-button');

        //register form errors
        this.emailError = page.locator('data-testid=email-error');
        this.passwordError = page.locator('data-testid=password-error');
        this.confirmPasswordError = page.locator('data-testid=confirm-password-error');

        //login button
        this.loginButton = page.locator('data-testid=switch-to-login-button');
        
    }

    async verifyPlaceholders() {
        await expect(this.fullNameInput).toHaveAttribute('placeholder', registrationFormTerms.placeholderFullName);
        await expect(this.emailInput).toHaveAttribute('placeholder', registrationFormTerms.placeholderEmail);
        await expect(this.passwordInput).toHaveAttribute('placeholder', registrationFormTerms.placeholderPassword);
        await expect(this.confirmPasswordInput).toHaveAttribute('placeholder', registrationFormTerms.placeholderConfirmPassword);
    }

    async fillFullName(fullName : string) {
        await this.fullNameInput.fill(fullName);
    }

    async fillEmail(email : string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password : string) {
        await this.passwordInput.fill(password);
    }

    async fillConfirmPassword(confirmPassword : string) {
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    async selectMainCurrency(currency : string) {
        await this.mainCurrencySelect.selectOption(currency);
    }

    async clickRegisterButton() {
        await this.registerButton.click();
    }

    async clickLoginButton() {
        await this.loginButton.click();
    }

    async fillRegistrationForm(fullName : string, email : string, password : string, confirmPassword : string, currency : string) {
        await this.fillFullName(fullName);
        await this.fillEmail(email);
        await this.fillPassword(password);
        await this.fillConfirmPassword(confirmPassword);
        await this.selectMainCurrency(currency);
        await this.clickRegisterButton();
    }

}

