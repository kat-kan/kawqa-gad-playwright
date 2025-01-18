import { Locator, Page } from '@playwright/test';

export class HomePage {
  logoutButton: Locator;
  deleteUserButton: Locator;

  constructor(private page: Page) {
    this.logoutButton = this.page.getByTestId('logoutButton');
    this.deleteUserButton = this.page.getByTestId('deleteButton');
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async deleteUser(): Promise<void> {
    // Handle the dialog
    this.page.once('dialog', async (dialog) => {
      console.log(`Dialog message: ${dialog.message()}`);
      await dialog.accept();
    });

    await this.deleteUserButton.click();
  }
}
