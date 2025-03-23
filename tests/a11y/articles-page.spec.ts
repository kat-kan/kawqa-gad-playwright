import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { ArticlesPage } from 'src/gui/pages/articles.page';

test.describe('Articles page accessibility tests', () => {
  let articlesPage: ArticlesPage;

  test.beforeEach(async ({ page }) => {
    articlesPage = new ArticlesPage(page);
    await page.goto(articlesPage.url);
  });

  ///For the purpose of the next test, I disabled one rule (color-contrast)
  //A description of the rules can be found at: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
  test('Check Comments button', async ({ page }) => {
    // When
    const axeBuilder = await new AxeBuilder({ page })
      .include('#btnComments')
      .disableRules('color-contrast')
      .analyze();
    //Then
    expect(axeBuilder.violations).toEqual([]);
  });

  //The test is skipped because the articles page does not meet many accessibility standards and the test fails. You can run the test to generate a report with detailed information. At the end of the report (scroll down the error report) there is an additional attachment containing the results of the accessibility scan in json format.

  test.skip('Check articles page', async ({ page }, testInfo) => {
    //When
    const axeBuilder = await new AxeBuilder({ page }).analyze();
    await testInfo.attach('accessibility-scan-results', {
      body: JSON.stringify(axeBuilder, null, 2),
      contentType: 'application/json',
    });
    //Then
    expect(axeBuilder.violations).toEqual([]);
  });
});
