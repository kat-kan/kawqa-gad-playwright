// import { testUser1 } from '@_src/test-data/user.data';
import { expect, test as setup } from '@playwright/test';
import { STORAGE_STATE } from 'playwright.config';
import { LoginPage } from 'src/gui/pages/login.page';
import { testUsers } from 'src/shared/fixtures/auth';

setup('login and save session', async ({ page }) => {
  // Arrange
  const loginPage = new LoginPage(page);

  // Act
  await page.goto(loginPage.url);
  const welcomePage = await loginPage.login(testUsers.regularUser);

  // Assert
  await expect(welcomePage.title).toHaveText(
    `Hi ${testUsers.regularUser.email}!`,
  );

  await page.context().storageState({ path: STORAGE_STATE });
});
