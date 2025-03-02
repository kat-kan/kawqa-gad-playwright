import { Locator, Page } from '@playwright/test';

export class HomePage {
  logoutButton: Locator;
  deleteUserButton: Locator;
  myArticlesButton: Locator;

  constructor(private page: Page) {
    this.logoutButton = this.page.getByTestId('logoutButton');
    this.deleteUserButton = this.page.getByTestId('deleteButton');
    this.myArticlesButton = this.page.getByRole('button', {
      name: 'My articles',
    });
  }

  async logout(): Promise<void> {
    await this.logoutButton.click();
  }

  async deleteUser(): Promise<void> {
    // Handle the dialog
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });

    await this.deleteUserButton.click();
  }
  async myArticles(): Promise<void> {
    await this.myArticlesButton.click();
  }
}
