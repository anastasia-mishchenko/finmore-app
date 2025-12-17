import { Locator, Page, expect } from "@playwright/test";
import { checkVisibility, clickElement, verifyInputValue, verifyTextContent } from "../utils/globalMethods";

export class DashboardPage {
    readonly page : Page;
    

    readonly userMenu : Locator;
    readonly themeChangeButton: Locator;
    readonly addTransactionButton: Locator;
    readonly dashboardTitle: Locator;
    readonly sidebarToggle: Locator;
    readonly appTitle: Locator;
    readonly navDashboard: Locator;
    readonly navTransactions: Locator;
    readonly navCategories: Locator;
    readonly navBudgets: Locator;
    readonly navAccounts: Locator;
    readonly navReports: Locator;
    readonly navAnalytics: Locator;
    readonly navSettings: Locator;
    readonly totalIncomeCard: Locator;
    readonly totalIncomeAmount: Locator;
    readonly totalExpensesCard: Locator;
    readonly totalExpensesAmount: Locator;
    readonly balanceCard: Locator;
    readonly balanceAmount: Locator;
    readonly budgetUsedCard: Locator;
    readonly budgetUsedAmount: Locator;
    readonly recentTransactionsWidget: Locator;
    readonly budgetOverviewWidget: Locator;


    constructor(page : Page){
        this.page = page;
        this.userMenu = page.getByTestId('user-menu-trigger');
        this.themeChangeButton = page.getByTestId('theme-toggle');
        this.addTransactionButton = page.getByTestId('add-transaction-button');
        this.dashboardTitle = page.getByTestId('dashboard-title');
        this.sidebarToggle = page.getByTestId('sidebar-toggle');
        this.appTitle = page.getByTestId('app-title');
        this.navDashboard = page.getByTestId('nav-dashboard');
        this.navTransactions = page.getByTestId('nav-transactions');
        this.navCategories = page.getByTestId('nav-categories');
        this.navBudgets = page.getByTestId('nav-budgets');
        this.navAccounts = page.getByTestId('nav-accounts');
        this.navReports = page.getByTestId('nav-reports');
        this.navAnalytics = page.getByTestId('nav-analytics');
        this.navSettings = page.getByTestId('nav-settings');
        this.totalIncomeCard = page.getByTestId('total-income-card');
        this.totalIncomeAmount = page.getByTestId('total-income-card-value');
        this.totalExpensesCard = page.getByTestId('total-expenses-card');
        this.totalExpensesAmount = page.getByTestId('total-expenses-card-value');
        this.balanceCard = page.getByTestId('balance-card');
        this.balanceAmount = page.getByTestId('balance-card-value');
        this.budgetUsedCard = page.getByTestId('budget-used-card');
        this.budgetUsedAmount = page.getByTestId('budget-used-card-value');
        this.recentTransactionsWidget = page.getByTestId('recent-transactions-widget');
        this.budgetOverviewWidget = page.getByTestId('budget-overview-widget');
    }

    async userMenuIsVisible(){
         await checkVisibility(this.userMenu, 'User menu');
    }

    async isUserLoggedIn(): Promise<boolean> {
        try {
            return await this.userMenu.isVisible({ timeout: 2000 });
        } catch {
            return false;
        }
    }

    async waitForDashboardReady() {
        await this.userMenuIsVisible();
        await this.addTransactionButton.waitFor({ state: "visible", timeout: 10000 });
    }

    async navigateToTransactionsPage(){
        await clickElement(this.navTransactions, 'Navigate to transactions page');
    }

    async navigateToCategoriesPage(){
        await clickElement(this.navCategories, 'Navigate to categories page');
    }

    async navigateToBudgetsPage(){
        await clickElement(this.navBudgets, 'Navigate to budgets page');
    }

    async navigateToAccountsPage(){
        await clickElement(this.navAccounts, 'Navigate to accounts page');
    }

    async navigateToReportsPage(){
        await clickElement(this.navReports, 'Navigate to reports page');
    }

    async navigateToAnalyticsPage(){
        await clickElement(this.navAnalytics, 'Navigate to analytics page');
    }

    async navigateToSettingsPage(){
        await clickElement(this.navSettings, 'Navigate to settings page');
    }

    async clickAddTransactionButton(){
        await clickElement(this.addTransactionButton, 'Add transaction button');
    }

    async verifyTheLastTransaction(amount: string, category: string, description: string) {
        // Get all transaction elements
        const allTransactions = this.page.getByTestId(new RegExp(`^recent-transaction-\\d+$`));
        const count = await allTransactions.count();
        
        if (count === 0) {
            throw new Error('No transactions found');
        }
        
        // Get the last transaction (most recent)
        const lastTransaction = allTransactions.first();
        
        // Verify description (first p with font-medium class)
        const descriptionElement = lastTransaction.locator('p.font-medium').first();
        await expect(descriptionElement).toHaveText(description);
        
        // Verify category (p with text-sm class)
        const categoryElement = lastTransaction.locator('p.text-sm').first();
        await expect(categoryElement).toHaveText(category);
        
        // Verify amount (p with font-bold class, should contain the amount)
        const amountElement = lastTransaction.locator('p.font-bold').first();
        const amountText = await amountElement.textContent();
        expect(amountText).toContain(amount);
    }

    async verifyTotalIncome(amount: string) {
        await verifyTextContent(this.totalIncomeAmount, amount, 'Total income amount');
    }
    async verifyTotalExpenses(amount: string) {
        await verifyTextContent(this.totalExpensesAmount, amount, 'Total expenses amount');
    }
    async verifyBalance(amount: string) {
        await verifyTextContent(this.balanceAmount, amount, 'Balance amount');
    }
    async verifyBudgetUsed(amount: string) {
        await verifyTextContent(this.budgetUsedAmount, amount, 'Budget used amount');
    }



};