import { expect, test } from '@playwright/test';
import { SimpleElementsWithIdsPage } from 'src/gui/pages/simple-elements-with-ids.page';
import { hexToRgb } from 'src/helpers/gui/color-utils.helper';

test.describe('GUI tests for practice page - simple elements with IDs', () => {
  let simpleElementsWithIdsPage: SimpleElementsWithIdsPage;

  test.beforeEach(async ({ page }) => {
    simpleElementsWithIdsPage = new SimpleElementsWithIdsPage(page);
    await page.goto(simpleElementsWithIdsPage.url);
  });

  test('Label test', async ({}) => {
    // Given
    const labelText = 'Some text for label';
    // Then
    await expect(simpleElementsWithIdsPage.label).toHaveText(labelText);
  });

  test('Button test', async ({}) => {
    // Given
    const resultText = 'You clicked the button!';
    // When
    await simpleElementsWithIdsPage.button.click();
    // Then
    await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });

  test('Checkbox checked test', async ({}) => {
    // Given
    const resultText = 'Checkbox is checked!';
    // When
    await simpleElementsWithIdsPage.checkbox.check();
    // Then
    await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });

  test('Checkbox unchecked test', async ({}) => {
    // Given
    const resultText = 'Checkbox is unchecked!';
    // When
    await simpleElementsWithIdsPage.checkbox.check();
    await simpleElementsWithIdsPage.checkbox.uncheck();
    // Then
    await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });

  test('Typing correct value into input area test', async ({}) => {
    // Given
    const inputText = 'test';
    const resultText = `Input value changed to: ${inputText}`;
    // When
    await simpleElementsWithIdsPage.input.fill(inputText);
    await simpleElementsWithIdsPage.input.blur();
    // Then
    await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });

  test('Typing correct value into input area without blur test', async ({}) => {
    // Given
    const inputText = 'test';
    // When
    await simpleElementsWithIdsPage.input.fill(inputText);
    // Then
    await expect(simpleElementsWithIdsPage.resultsArea).toBeHidden();
  });

  test('Typing too long value into input area test', async ({}) => {
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
    await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });

  test('Stretching the text area test', async ({}) => {
    // Given
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
    expect
      .soft(boundingBoxAfter.width)
      .toBeGreaterThan(boundingBoxBefore.width);
    expect
      .soft(boundingBoxAfter.height)
      .toBeGreaterThan(boundingBoxBefore.height);
  });

  test('Typing correct value into text area test', async ({}) => {
    // Given
    const inputText = 'test';
    const resultText = `Textarea value changed to: ${inputText}`;
    // When
    await simpleElementsWithIdsPage.textArea.fill(inputText);
    await simpleElementsWithIdsPage.textArea.blur();
    // Then
    await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });

  test('Dropdown list test', async ({}) => {
    // Given
    const options = ['option2', 'option3', 'option1'];
    const resultText = options.map((option) => `Selected option: ${option}`);
    // When
    for (let i = 0; i < options.length; i++) {
      await simpleElementsWithIdsPage.dropDownList.selectOption(options[i]);
      // Then
      await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(
        resultText[i],
      );
    }
  });

  test('RadioButtons test', async ({}) => {
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
      await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(
        resultText[i],
      );
    }
  });

  test('Range bar test', async ({}) => {
    // Given
    const ranges = ['50', '100', '0'];
    const resultText = ranges.map(
      (range) => `Range value changed to: ${range}`,
    );
    // When
    for (let i = 0; i < ranges.length; i++) {
      await simpleElementsWithIdsPage.rangeBar.fill(ranges[i]);
      // Then
      await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(
        resultText[i],
      );
    }
  });

  test('Label with mouse hover test', async ({}) => {
    // Given
    const resultText = 'Mouse over event occurred!';
    // When
    await simpleElementsWithIdsPage.tooltip.hover();

    // Then
    await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(resultText);
  });

  test('Select date test', async ({}) => {
    // Given
    const dates = ['2024-06-05', '2022-02-09', '2023-04-02'];
    const resultText = dates.map((date) => `Selected date: ${date}`);
    //When
    for (let i = 0; i < dates.length; i++) {
      await simpleElementsWithIdsPage.dateInput.fill(dates[i]);
      // Then
      await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(
        resultText[i],
      );
    }
  });

  test('Colors picker test', async ({}) => {
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
      await expect(simpleElementsWithIdsPage.resultsArea).toHaveText(
        resultText[i],
      );
    }
  });
});
