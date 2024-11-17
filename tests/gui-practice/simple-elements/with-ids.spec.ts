import { expect, test } from '@playwright/test';
import { SimpleElementsWithIdsPage } from 'src/gui/pages/simple-elements-with-ids.page';
import { hexToRgb } from 'src/helpers/gui/color-utils.helper';

test.describe('GUI tests for practice page - simple elements with IDs', () => {
  let simpleElementsWithIdsPage: SimpleElementsWithIdsPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/simple-elements.html');
    simpleElementsWithIdsPage = new SimpleElementsWithIdsPage(page);
  });

  test('Label test', async ({ page }) => {
    // Given
    const labelText = 'Some text for label';
    // Then
    expect(simpleElementsWithIdsPage.label).toHaveText(labelText);
  });

  test('Button test', async ({ page }) => {
    // Given
    const resultText = 'You clicked the button!';
    // When
    await simpleElementsWithIdsPage.button.click();
    // Then
    expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });

  test('Checkbox checked test', async ({ page }) => {
    // Given
    const resultText = 'Checkbox is checked!';
    // When
    await simpleElementsWithIdsPage.checkbox.check();
    // Then
    expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });
  test('Checkbox unchecked test', async ({ page }) => {
    // Given
    const resultText = 'Checkbox is unchecked!';
    // When
    await simpleElementsWithIdsPage.checkbox.check();
    await simpleElementsWithIdsPage.checkbox.uncheck();
    // Then
    expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });
  test('Typing correct value into input area test', async ({ page }) => {
    // Given
    const inputText = 'test';
    const resultText = `Input value changed to: ${inputText}`;
    // When
    await simpleElementsWithIdsPage.input.fill(inputText);
    await simpleElementsWithIdsPage.input.blur();
    // Then
    expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });
  test('Typing correct value into input area without blur test', async ({
    page,
  }) => {
    // Given
    const inputText = 'test';
    // When
    await simpleElementsWithIdsPage.input.fill(inputText);
    // Then
    expect(simpleElementsWithIdsPage.resultsArea).toBeEmpty;
  });
  test('Typing too long value into input area test', async ({ page }) => {
    // Given
    const inputText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod';
    const correctText =
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do ';
    const resultText = `Input value changed to: ${correctText}`;
    // When
    await simpleElementsWithIdsPage.input.fill(inputText);
    await simpleElementsWithIdsPage.input.blur();
    // Then
    expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });
  test('Stretching the text area test', async ({ page }) => {
    //
    const boundingBoxBefore =
      await simpleElementsWithIdsPage.textArea.boundingBox();
    const startX = boundingBoxBefore.x + boundingBoxBefore.width - 5;
    const startY = boundingBoxBefore.y + boundingBoxBefore.height - 5;
    const endX = startX + 50;
    const endY = startY + 50;
    // When
    await simpleElementsWithIdsPage.textAreaStretching(
      startX,
      startY,
      endX,
      endY,
    );
    const boundingBoxAfter =
      await simpleElementsWithIdsPage.textArea.boundingBox();
    // Then
    expect(boundingBoxAfter.width).toBeGreaterThan(boundingBoxBefore.width);
    expect(boundingBoxAfter.height).toBeGreaterThan(boundingBoxBefore.height);
  });
  test('Typing correct value into text area test', async ({ page }) => {
    // Given
    const inputText = 'test';
    const resultText = `Textarea value changed to: ${inputText}`;
    // When
    await simpleElementsWithIdsPage.textArea.fill(inputText);
    await simpleElementsWithIdsPage.textArea.blur();
    // Then
    expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });
  test('Dropdown list test', async ({ page }) => {
    // Given
    const options = ['option2', 'option3', 'option1'];
    const resultText = options.map((option) => `Selected option: ${option}`);
    // When
    for (let i = 0; i < options.length; i++) {
      await simpleElementsWithIdsPage.dropDownList.selectOption(options[i]);
      // Then
      expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText[i]);
    }
  });
  test('RadioButtons test', async ({ page }) => {
    // Given
    const radioButtons = [
      simpleElementsWithIdsPage.radioButtonFirst,
      simpleElementsWithIdsPage.radioButtonSecond,
      simpleElementsWithIdsPage.radioButtonThird,
    ];
    const resultText = [
      'Radio Button 1 clicked!',
      'Radio Button 2 clicked!',
      'Radio Button 3 clicked!',
    ];
    // When
    for (let i = 0; i < radioButtons.length; i++) {
      await radioButtons[i].click();
      // Then
      expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText[i]);
    }
  });
  test('Range bar test', async ({ page }) => {
    // Given
    const ranges = ['50', '100', '0'];
    const resultText = ranges.map(
      (range) => `Range value changed to: ${range}`,
    );
    // When
    for (let i = 0; i < ranges.length; i++) {
      await simpleElementsWithIdsPage.rangeBar.fill(ranges[i]);
      // Then
      expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText[i]);
    }
  });
  test('Label with mouse hover test', async ({ page }) => {
    // Given
    const resultText = 'Mouse over event occurred!';
    // When
    await simpleElementsWithIdsPage.tooltip.hover();

    // Then
    expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });
  test('Select date test', async ({ page }) => {
    // Given
    const dates = ['2024-06-05', '2022-02-09', '2023-04-02'];
    const resultText = dates.map((date) => `Selected date: ${date}`);
    //When
    for (let i = 0; i < dates.length; i++) {
      await simpleElementsWithIdsPage.dateInput.fill(dates[i]);
      // Then
      expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText[i]);
    }
  });
  test('Colors picker test', async ({ page }) => {
    // Given
    const colors = ['#d02525', '#1a7431', '#e07ee7'];
    const resultText = colors.map(
      (color) =>
        `New selected color: ${color} as hex and in RGB: rgb(${hexToRgb(
          color,
        )})`,
    );
    //When
    for (let i = 0; i < colors.length; i++) {
      await simpleElementsWithIdsPage.colorInput.fill(colors[i]);
      // Then
      expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText[i]);
    }
  });
});
