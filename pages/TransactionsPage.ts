import { Locator, Page, expect } from "@playwright/test";
import { checkVisibility, clickElement, selectOptionByValue } from "../utils/globalMethods";

export class TransactionsPage{
    readonly page: Page;

    readonly addTransactionButton: Locator;
    readonly transactionsPageTitle: Locator;
    readonly transactionListTitle: Locator;

    //Transactions filters
    readonly toggleFiltersButton: Locator;
    readonly filterByTypeSelect: Locator;

    readonly filterByCategorySelect: Locator;
    readonly filterDateFrom: Locator;
    readonly filterDateTo: Locator;
    readonly filterSearchByDescription: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addTransactionButton = page.getByTestId('add-transaction-page-button');
        this.transactionsPageTitle = page.getByTestId('transactions-page-title');
        this.transactionListTitle = page.getByTestId('transaction-list-title');
        this.toggleFiltersButton = page.getByTestId('toggle-filters-button');
        this.filterByTypeSelect = page.getByTestId('type-filter');
        this.filterByCategorySelect = page.getByTestId('category-filter');
        this.filterDateFrom = page.getByTestId('date-from-filter');
        this.filterDateTo = page.getByTestId('date-to-filter');
        this.filterSearchByDescription = page.getByTestId('search-filter');
    }
    
    async transactionsPageTitleIsVisible(){
        await checkVisibility(this.transactionsPageTitle, 'Transactions page title');
    }

    async clickAddTransactionButton(){
        await clickElement(this.addTransactionButton, 'Add transaction button');
    }
    async clickToggleFiltersButton(){
        await clickElement(this.toggleFiltersButton, 'Toggle filters button');
    }
    async selectFilterByType(type: 'all' | 'income' | 'expense'){
        await selectOptionByValue(this.filterByTypeSelect, type, 'Filter by type select');
    }
    async selectFilterByCategory(category: 'all' ){
        await selectOptionByValue(this.filterByCategorySelect, category, 'Filter by category select');
    }
    async fillFilterDateFrom(value: string){
        await this.filterDateFrom.fill(value);
    }
    async fillFilterDateTo(value: string){
        await this.filterDateTo.fill(value);
    }

    /**
     * Get transaction ID by matching transaction content
     * Returns the dynamic ID part from data-testid="transaction-item-{id}"
     */
    async getTransactionId(amount: string, category: string, description: string): Promise<string | null> {
        const allTransactions = this.page.getByTestId(new RegExp(`^transaction-item-\\d+$`));
        const count = await allTransactions.count();
        
        for (let i = 0; i < count; i++) {
            const transaction = allTransactions.nth(i);
            
            // Get the data-testid attribute to extract ID
            const testId = await transaction.getAttribute('data-testid');
            console.log(testId);
            if (!testId) continue;
            
            // Verify description (h3 with the description text)
            const descriptionElement = transaction.locator('h3').first();
            const descriptionText = await descriptionElement.textContent();
            if (descriptionText?.trim() !== description) continue;
            
            // Verify category (first p with text-sm class contains category)
            const categoryElement = transaction.locator('p.text-sm').first();
            const categoryText = await categoryElement.textContent();
            if (categoryText?.trim() !== category) continue;
            
            // Verify amount (p with font-bold class should contain the amount)
            const amountElement = transaction.locator('p.font-bold').first();
            const amountText = await amountElement.textContent();
            if (!amountText?.includes(amount)) continue;
            
            // Extract ID from data-testid
            const id = testId.replace('transaction-item-', '');
            console.log(id);
            return id;
        }
        
        return null;
    }

    /**
     * Get locator for a specific transaction by its ID
     */
    getTransactionById(transactionId: string): Locator {
        return this.page.getByTestId(`transaction-item-${transactionId}`);
    }

    /**
     * Verify transaction exists by matching amount, category, and description
     * Returns the transaction ID if found, or throws an error if not found
     */
    async verifyTransactionExists(amount: string, category: string, description: string): Promise<string> {
        const transactionId = await this.getTransactionId(amount, category, description);
        
        if (!transactionId) {
            throw new Error(`Transaction not found with amount: ${amount}, category: ${category}, description: ${description}`);
        }
        
        const transactionLocator = this.getTransactionById(transactionId);
        await expect(transactionLocator).toBeVisible();
        
        return transactionId;
    }

    /**
     * Click edit button for a specific transaction by ID
     */
    async clickEditTransaction(transactionId: string) {
        const transaction = this.getTransactionById(transactionId);
        const editButton = transaction.getByTestId(`edit-transaction-${transactionId}`);
        await clickElement(editButton, `Edit button for transaction ${transactionId}`);
    }

    /**
     * Click delete button for a specific transaction by ID
     */
    async clickDeleteTransaction(transactionId: string) {
        const transaction = this.getTransactionById(transactionId);
        const deleteButton = transaction.getByTestId(`delete-transaction-${transactionId}`);
        await clickElement(deleteButton, `Delete button for transaction ${transactionId}`);
    }

    /**
     * Verify transaction does not exist by ID
     */
    async verifyTransactionNotExists(transactionId: string) {
        const transactionLocator = this.getTransactionById(transactionId);
        await expect(transactionLocator).not.toBeVisible();
    }
}