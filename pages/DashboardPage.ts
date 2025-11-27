import { Locator, Page, expect } from "@playwright/test";
import { checkVisibility } from "../utils/globalMethods";

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
    readonly totalExpencesCard: Locator;
    readonly balanceCard: Locator;
    readonly budgetUsedCard: Locator;
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
        this.totalExpencesCard = page.getByTestId('total-expences-card');
        this.balanceCard = page.getByTestId('balance-card');
        this.budgetUsedCard = page.getByTestId('budget-used-card');
        this.recentTransactionsWidget = page.getByTestId('recent-transactions-widget');
        this.budgetOverviewWidget = page.getByTestId('budget-overview-widget');
    }

    async userMenuIsVisible(){
         await checkVisibility(this.userMenu, 'User menu');
    }

    async verifyTheLastTransaction(amount: string, category: string, description: string) {
        // Get all transaction elements
        const allTransactions = this.page.getByTestId(new RegExp(`^recent-transaction-\\d+$`));
        const count = await allTransactions.count();
        
        if (count === 0) {
            throw new Error('No transactions found');
        }
        
        // Get the last transaction (most recent)
        const lastTransaction = allTransactions.nth(count - 1);
        
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



};