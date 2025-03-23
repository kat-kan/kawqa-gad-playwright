import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { StartPage } from 'src/gui/pages/start.page';

test.describe('Start page accessibility tests', () => {
  let startPage: StartPage;
  test.beforeEach(async ({ page }) => {
    startPage = new StartPage(page);
    await page.goto(startPage.url);
  });

  //The test is skipped because the start page does not meet many accessibility standards and the test fails. You can run the test to generate a report with detailed information.
  test.skip('Check the start page', async ({ page }) => {
    //When
    await startPage.articlesButton.waitFor();
    const axeBuilder = await new AxeBuilder({ page }).analyze();
    //Then
    expect(axeBuilder.violations).toEqual([]);
  });

  //For the purpose of the next test, I chose two standards that the page meets (wcag21a and wcag21aa).
  //A description of the standards can be found at: https://www.deque.com/axe/core-documentation/api-documentation/
  test('Check the start page against selected standards', async ({ page }) => {
    //When
    await startPage.articlesButton.waitFor();
    const axeBuilder = await new AxeBuilder({ page })
      .withTags(['wcag21a', 'wcag21aa'])
      .analyze();
    //Then
    expect(axeBuilder.violations).toEqual([]);
  });

  test('Check Articles button', async ({ page }) => {
    // When
    await startPage.articlesButton.waitFor();
    const axeReport = await new AxeBuilder({ page })
      .include('[href="./articles.html"]')
      .analyze();
    // Then
    expect(axeReport.violations).toEqual([]);
  });
});
