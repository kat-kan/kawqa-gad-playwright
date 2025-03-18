import { expect, test } from '@playwright/test';
import * as fs from 'fs/promises';
import * as path from 'path';
import { DragAndDropPage } from 'src/gui/pages/drag&drop-v1.page';

test.describe('GUI tests for drag&drop page', () => {
  let dragAndDropPage: DragAndDropPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/drag-and-drop-1.html');
    dragAndDropPage = new DragAndDropPage(page);
  });

  test('File upload test using browse button', async ({}) => {
    //Given
    const filePath = path.resolve('test-files', 'upload.json');
    // Read the contents of a JSON file
    const jsonFile = await fs.readFile(filePath, 'utf-8');
    const jsonObject = JSON.parse(jsonFile);
    // Create the expected result as formatted JSON
    const expectedResult = JSON.stringify(jsonObject).replace(':', ': ');
    const resultsContainer = dragAndDropPage.resultsArea;

    //When
    await dragAndDropPage.browseButton.click();
    await dragAndDropPage.uploadFile(dragAndDropPage.fileInput, filePath);
    await dragAndDropPage.uploadButton.click();
    // Then
    await expect(resultsContainer).toContainText(
      `File uploaded! ${expectedResult}`,
    );
  });
});
