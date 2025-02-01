import { expect, test } from '@playwright/test';
import { SimpleElementsMultipleElements } from 'src/gui/pages/simple-elements-multiple-elements.page';

test.describe('GUI tests for multiple elements', () => {
  let simpleElementsMultipleElements: SimpleElementsMultipleElements;

  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/simple-multiple-elements-no-ids.html');
    simpleElementsMultipleElements = new SimpleElementsMultipleElements(page);
  });

  test('checkboxes - check, uncheck and history', async () => {
    //Given
    const numberOfElements =
      await simpleElementsMultipleElements.checkboxes.count();

    const expectedHistory = [];

    for (let i = 0; i < numberOfElements; i++) {
      const checkedText = `Checkbox is checked! (Opt ${i + 1}!)`;
      const uncheckedText = `Checkbox is unchecked! (Opt ${i + 1}!)`;

      // When
      await simpleElementsMultipleElements.checkCheckbox(i);
      expectedHistory.unshift(checkedText);

      // Then
      await expect(
        await simpleElementsMultipleElements.getResultsText(),
      ).toContain(checkedText);

      const historyText = await simpleElementsMultipleElements.getHistoryText();
      await expect(historyText).toContain(expectedHistory.join('\n'));

      // When
      await simpleElementsMultipleElements.uncheckCheckbox(i);
      expectedHistory.unshift(uncheckedText);

      // Then
      await expect(
        await simpleElementsMultipleElements.getResultsText(),
      ).toContain(uncheckedText);

      const historyTextAfterUncheck =
        await simpleElementsMultipleElements.getHistoryText();
      await expect(historyTextAfterUncheck).toContain(
        expectedHistory.join('\n'),
      );
    }
  });
});
