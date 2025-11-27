import { Locator, Page, expect } from "@playwright/test";

export class DashboardPage {
    readonly page : Page;
    

    readonly userMenu : Locator;

    constructor(page : Page){
        this.page = page;
        this.userMenu = page.getByTestId('user-menu-trigger');
    }

    async userMenuIsVisible(){
         await expect(this.userMenu).toBeVisible();
    }

};