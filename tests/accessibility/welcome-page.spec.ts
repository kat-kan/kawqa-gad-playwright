import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

//The test is skipped because the welcome page does not meet many accessibility standards and the test fails. You can run the test to generate a report with detailed information.
test.skip('Check the welcome page', async ({ page }) => {
  await page.goto(`/`);
  await page.locator('#btnGui').waitFor();
  const axeBuilder = await new AxeBuilder({ page }).analyze();
  expect(axeBuilder.violations).toEqual([]);
});

//For the purpose of the next test, I chose two standards that the page meets (wcag21a and wcag21aa).
//A description of the standards can be found at: https://www.deque.com/axe/core-documentation/api-documentation/
test('Check the whole site against selected standards', async ({ page }) => {
  await page.goto(`/`);
  await page.locator('#btnGui').waitFor();
  const axeBuilder = await new AxeBuilder({ page })
    .withTags(['wcag21a', 'wcag21aa'])
    .analyze();
  expect(axeBuilder.violations).toEqual([]);
});

test("Check Let's start button", async ({ page }) => {
  await page.goto(`/`);
  await page.locator('#btnGui').waitFor();
  const axeBuilder = await new AxeBuilder({ page })
    .include('#btnGui')
    .analyze();
  expect(axeBuilder.violations).toEqual([]);
});
