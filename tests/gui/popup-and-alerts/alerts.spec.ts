import { expect, test } from '@playwright/test';
import { AlertsPage } from 'src/gui/pages/alerts.page';

test.describe('GUI tests for practice page - popup and alerts', () => {
  let alertsPage: AlertsPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/alerts-1.html');
    alertsPage = new AlertsPage(page);
  });

  test('Simple alert box test', async ({}) => {
    // Given
    const expectedMessage = 'Alert box invoked by button click!';

    // When
    const capturedAlertMessage = alertsPage.handleAlert();
    await alertsPage.simpleAlertButton.click();
    const alertMessage = await capturedAlertMessage;

    // Then
    await expect(alertMessage).toBe(expectedMessage);
  });

  test('Simple alert (with fade out) test', async ({}) => {
    // Given
    const numberOfClicks = 3;
    const expectedMessage = 'Button clicked!';

    // When
    for (let i = 1; i <= numberOfClicks; i++) {
      await alertsPage.alertWithFadeOutButton.click();
      await expect(alertsPage.alertWithFadeOut).toHaveCount(i);

      // Then
      for (let j = 0; j < i; j++) {
        await expect(alertsPage.alertWithFadeOut.nth(j)).toHaveText(
          expectedMessage,
        );
        await alertsPage.alertWithFadeOut.nth(j).waitFor({ state: 'hidden' });
        await expect(alertsPage.alertWithFadeOut.nth(j)).toBeHidden();
      }
    }
  });

  test('Simple alert (with counter) test', async ({}) => {
    // Given
    const numberOfClicks = 3;

    // When
    for (let i = 1; i <= numberOfClicks; i++) {
      await alertsPage.alertWithCounterButton.click();
      const alert = alertsPage.getAlertWithCounterLocator(i);

      // Then
      const expectedMessage = `Button clicked ${i} times`;
      await expect(alert).toHaveText(expectedMessage);
    }
  });

  test('Simple alert (with random fade out) test', async ({}) => {
    // Given
    const numberOfClicks = 3;

    // When
    for (let i = 1; i <= numberOfClicks; i++) {
      await alertsPage.alertWithRandomFadeOutButton.click();
      const alert = alertsPage.getAlertWithRandomFadeOutLocator(i);

      // Then
      const expectedMessage = `${i} click(s)!`;
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
      await alertsPage.firstAlertWithCustomMessage.click();
    }

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
      await alertsPage.firstAlertWithCustomMessage.click();
    }

    await expect(alertsPage.nextAlertWithCustomMessage).toHaveCount(
      numberOfClicks,
    );
  });
});
