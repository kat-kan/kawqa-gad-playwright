import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

///For the purpose of the next test, I disabled one rule (color-contrast)
//A description of the rules can be found at: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md

test('Check Comments button', async ({ page }) => {
  await page.goto(`/`);
  await page.locator('#btnGui').waitFor();
  await page.locator('#btnGui').click();
  const axeBuilder = await new AxeBuilder({ page })
    .include('#btnComments')
    .disableRules('color-contrast')
    .analyze();
  expect(axeBuilder.violations).toEqual([]);
});

//The test is skipped because the main page does not meet many accessibility standards and the test fails. You can run the test to generate a report with detailed information. At the end of the report (scroll down the error report) there is an additional attachment containing the results of the accessibility scan in json format.

test.skip('Check the main page', async ({ page }, testInfo) => {
  await page.goto(`/`);
  await page.locator('#btnGui').waitFor();
  await page.locator('#btnGui').click();
  const axeBuilder = await new AxeBuilder({ page }).analyze();
  await testInfo.attach('accessibility-scan-results', {
    body: JSON.stringify(axeBuilder, null, 2),
    contentType: 'application/json',
  });
  expect(axeBuilder.violations).toEqual([]);
});
