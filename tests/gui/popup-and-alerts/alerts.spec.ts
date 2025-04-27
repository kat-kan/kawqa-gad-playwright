import { expect, test } from '@playwright/test';
import { AlertsPage } from 'src/gui/pages/alerts.page';

test.describe('GUI tests for practice page - popup and alerts', () => {
  let alertsPage: AlertsPage;

  test.beforeEach(async ({ page }) => {
    alertsPage = new AlertsPage(page);
    await page.goto(alertsPage.url);
  });

  test('Simple alert box test', async ({}) => {
    // Given
    const expectedMessage = 'Alert box invoked by button click!';
    const capturedAlertMessage = alertsPage.handleAlert();

    // When
    await alertsPage.simpleAlertButton.click();
    const alertMessage = await capturedAlertMessage;

    // Then
    await expect(alertMessage).toBe(expectedMessage);
  });

  test('Simple alert (with fade out) test', async ({}) => {
    // Given
    const numberOfClicks = 3;
    const expectedMessage = 'Button clicked!';

    for (let i = 1; i <= numberOfClicks; i++) {
      // When
      await alertsPage.alertWithFadeOutButton.click();

      // Then
      await expect(alertsPage.alertWithFadeOut).toHaveCount(i);

      for (let j = 0; j < i; j++) {
        // When
        await expect(alertsPage.alertWithFadeOut.nth(j)).toHaveText(
          expectedMessage,
        );

        // Then
        await alertsPage.alertWithFadeOut.nth(j).waitFor({ state: 'hidden' });
        await expect(alertsPage.alertWithFadeOut.nth(j)).toBeHidden();
      }
    }
  });

  test('Simple alert (with counter) test', async ({}) => {
    // Given
    const numberOfClicks = 3;

    for (let i = 1; i <= numberOfClicks; i++) {
      // When
      await alertsPage.alertWithCounterButton.click();
      const alert = alertsPage.getAlertWithCounterLocator(i);
      const expectedMessage = `Button clicked ${i} times`;

      // Then
      await expect(alert).toHaveText(expectedMessage);
    }
  });

  test('Simple alert (with random fade out) test', async ({}) => {
    // Given
    const numberOfClicks = 3;

    for (let i = 1; i <= numberOfClicks; i++) {
      // When
      await alertsPage.alertWithRandomFadeOutButton.click();
      const alert = alertsPage.getAlertWithRandomFadeOutLocator(i);
      const expectedMessage = `${i} click(s)!`;

      // Then
      await expect(alert).toHaveText(expectedMessage);
      await alert.waitFor({ state: 'hidden' });
      await expect(alert).toBeHidden();
    }
  });

  test('Simple popup modal (with accept) test', async ({}) => {
    // Given
    const numberOfClicks = 3;
    const expectedMessage = 'Modal was accepted by user! 🎉';

    // When
    await alertsPage.simplePopupModalButton.click();
    await alertsPage.acceptModalButton.click();

    // Then
    await expect(alertsPage.firstAlertWithCustomMessage).toHaveText(
      expectedMessage,
    );

    for (let i = 0; i < numberOfClicks; i++) {
      // When
      await alertsPage.firstAlertWithCustomMessage.click();
    }
    // Then
    await expect(alertsPage.nextAlertWithCustomMessage).toHaveCount(
      numberOfClicks,
    );
  });

  test('Simple popup modal (with cancel) test', async ({}) => {
    // Given
    const numberOfClicks = 3;
    const expectedMessage = 'Modal was cancelled by user! 🚫';

    // When
    await alertsPage.simplePopupModalButton.click();
    await alertsPage.cancelModalButton.click();

    // Then
    await expect(alertsPage.firstAlertWithCustomMessage).toHaveText(
      expectedMessage,
    );

    for (let i = 0; i < numberOfClicks; i++) {
      // When
      await alertsPage.firstAlertWithCustomMessage.click();
    }
    // Then
    await expect(alertsPage.nextAlertWithCustomMessage).toHaveCount(
      numberOfClicks,
    );
  });
});
