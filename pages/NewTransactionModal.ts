import { expect, Locator, Page } from "@playwright/test";
import { checkVisibility, clickElement, fillElement, selectOptionByValue, verifyInputValue } from "../utils/globalMethods";

export class NewTransactionModal {
    readonly page: Page;
    
    // Modal container
    readonly modal: Locator;
    readonly modalTitle: Locator;
    readonly closeButton: Locator;
    
    // Transaction type toggle
    readonly expenseTypeButton: Locator;
    readonly incomeTypeButton: Locator;
    
    // Form fields
    readonly amountInput: Locator;

    // category select with options
    readonly categorySelect: Locator;
    readonly categoryOptionProducts: Locator;
    readonly categoryOptionTransport: Locator;
    readonly categoryOptionEntertainment: Locator;
    readonly categoryOptionServices: Locator;
    readonly categoryOptionHealth: Locator;

    readonly descriptionInput: Locator;
    readonly dateInput: Locator;

    // account select with options
    readonly accountSelect: Locator;
    readonly accountOptionCash: Locator;
    readonly accountOptionPrivatBank: Locator;
    readonly accountOptionMonoBank: Locator;
    readonly accountOptionOschadBank: Locator;

    readonly tagsInput: Locator;
    readonly addTagButton: Locator;
    
    // Action buttons
    readonly cancelButton: Locator;
    readonly createButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.modal = page.getByTestId('transaction-form-modal');
        this.modalTitle = page.getByTestId('transaction-form-title');
        this.closeButton = page.getByTestId('transaction-form-close');
        
        this.expenseTypeButton = page.getByTestId('expense-type-button');
        this.incomeTypeButton = page.getByTestId('income-type-button');
        
        this.amountInput = page.getByTestId('transaction-amount-input');

        this.categorySelect = page.getByTestId('transaction-category-select');
        this.categoryOptionProducts = page.getByTestId('category-option-4');
        this.categoryOptionTransport = page.getByTestId('category-option-5');
        this.categoryOptionEntertainment = page.getByTestId('category-option-6');
        this.categoryOptionServices = page.getByTestId('category-option-7');
        this.categoryOptionHealth = page.getByTestId('category-option-8');

        this.descriptionInput = page.getByTestId('transaction-description-input');
        this.dateInput = page.getByTestId('transaction-date-input');

        this.accountSelect = page.getByTestId('transaction-account-select');
        this.accountOptionCash = page.getByTestId('account-option-0');
        this.accountOptionPrivatBank = page.getByTestId('account-option-1');
        this.accountOptionMonoBank = page.getByTestId('account-option-2');
        this.accountOptionOschadBank = page.getByTestId('account-option-3');

        this.tagsInput = page.getByTestId('new-tag-input');
        this.addTagButton = page.getByTestId('add-tag-button');
        
        this.cancelButton = page.getByTestId('transaction-form-cancel');
        this.createButton = page.getByTestId('transaction-form-submit');
    }

    async modalIsVisible() {
        await checkVisibility(this.modal, 'New transaction modal');
    }

    async verifyTitle(expectedTitle: string) {
        await verifyInputValue(this.modalTitle, expectedTitle, 'Modal title');
    }

    async selectExpenseType() {
        await clickElement(this.expenseTypeButton, 'Expense type button');
    }

    async selectIncomeType() {
        await clickElement(this.incomeTypeButton, 'Income type button');
    }

    async fillAmount(amount: string) {
        await fillElement(this.amountInput, amount, 'Amount input');
    }

    async selectExpenseCategory(category: 'Продукти' | 'Транспорт' | 'Розваги' | 'Комунальні' | 'Здоров\'я') {
        await selectOptionByValue(this.categorySelect, category, 'Category select');
        await expect(this.categorySelect).toHaveValue(category);
    }

    async selectIncomeCategory(category: 'Зарплата' | 'Фриланс' | 'Інвестиції') {
        await selectOptionByValue(this.categorySelect, category, 'Category select');
        await expect(this.categorySelect).toHaveValue(category);
    }

    async fillDescription(description: string) {
        await fillElement(this.descriptionInput, description, 'Description input');
        await expect(this.descriptionInput).toHaveValue(description);
    }

    async fillDate(date: string) {
        await fillElement(this.dateInput, date, 'Date input');
        await expect(this.dateInput).toHaveValue(date);
    }

    async selectAccount(account: 'Готівка' | 'Картка ПриватБанку' | 'Картка Монобанку' | 'Ощадний рахунок') {
        await selectOptionByValue(this.accountSelect, account, 'Account select');
        await expect(this.accountSelect).toHaveValue(account);
    }
    async fillTag(tag: string) {
        await fillElement(this.tagsInput, tag, 'Tags input');
    }

    async clickAddTagButton() {
        await clickElement(this.addTagButton, 'Add tag button');
    }

    // Get tag locator by index (tag-0, tag-1, etc.)
    getTagByIndex(index: number): Locator {
        return this.page.getByTestId(`tag-${index}`);
    }

    // Get tag locator by text content
    getTagByText(tagText: string): Locator {
        return this.page.getByTestId(new RegExp(`^tag-\\d+$`)).filter({ hasText: tagText });
    }

    // Get remove tag button by index
    getRemoveTagButtonByIndex(index: number): Locator {
        return this.page.getByTestId(`remove-tag-${index}`);
    }

    // Get remove tag button by tag text
    getRemoveTagButtonByText(tagText: string): Locator {
        const tagLocator = this.getTagByText(tagText);
        return tagLocator.locator('button[data-testid^="remove-tag-"]');
    }

    // Get count of all tags
    async getTagsCount(): Promise<number> {
        return await this.page.getByTestId(new RegExp(`^tag-\\d+$`)).count();
    }

    // Verify tag exists by text
    async verifyTagExists(tagText: string) {
        const tagLocator = this.getTagByText(tagText);
        await checkVisibility(tagLocator, `Tag "${tagText}"`);
    }

    // Add tag and verify it was created
    async addTag(tag: string) {
        await this.fillTag(tag);
        await this.clickAddTagButton();
        await this.verifyTagExists(tag);
    }

    // Remove tag by text
    async removeTag(tagText: string) {
        const removeButton = this.getRemoveTagButtonByText(tagText);
        await clickElement(removeButton, `Remove tag "${tagText}"`);
    }

    // Remove tag by index
    async removeTagByIndex(index: number) {
        const removeButton = this.getRemoveTagButtonByIndex(index);
        await clickElement(removeButton, `Remove tag at index ${index}`);
    }

    async clickCancelButton() {
        await clickElement(this.cancelButton, 'Cancel button');
    }

    async clickCreateButton() {
        await clickElement(this.createButton, 'Create button');
    }

    async clickSaveButton() {
        await clickElement(this.createButton, 'Save button');
    }

    async clickCloseButton() {
        await clickElement(this.closeButton, 'Close button');
    }

    async fillTransactionForm(
        type: 'Витрата' | 'Дохід',
        amount: string,
        category: 'Продукти' | 'Транспорт' | 'Розваги' | 'Комунальні' | 'Здоров\'я' | 'Зарплата' | 'Фриланс' | 'Інвестиції',
        description: string,
        date: string,
        account: 'Готівка' | 'Картка ПриватБанку' | 'Картка Монобанку' | 'Ощадний рахунок'
    ) {
        if (type === 'Витрата') {
            await this.selectExpenseType();
            await this.selectExpenseCategory(category as 'Продукти' | 'Транспорт' | 'Розваги' | 'Комунальні' | 'Здоров\'я');
        } else if (type === 'Дохід') {
            await this.selectIncomeType();
            await this.selectIncomeCategory(category as 'Зарплата' | 'Фриланс' | 'Інвестиції');
        } else {
            throw new Error(`Invalid transaction type: ${type}`);
        }
        await this.fillAmount(amount);
        await this.fillDescription(description);
        await this.fillDate(date);
        await this.selectAccount(account);
    }

    async modalIsNotVisible() {
        await expect(this.modal).not.toBeVisible();
    }
}
