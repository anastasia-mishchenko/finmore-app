import { Locator, Page, expect } from "@playwright/test";

export class DashboardPage {
    readonly page : Page;
    

    readonly userMenu : Locator;

    constructor(page : Page){
        this.page = page;
        this.userMenu = page.locator("data-testid=user-menu-trigger");
    }

    async userMenuIsVisible(){
         await expect(this.userMenu).toBeVisible();
    }

};