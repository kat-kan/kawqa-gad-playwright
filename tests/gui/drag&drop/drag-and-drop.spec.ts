import { expect, test } from '@playwright/test';
import * as path from 'path';
import { DragAndDropPage } from 'src/gui/pages/drag&drop-v1.page';

test.describe('GUI tests for drag&drop page', () => {
  let dragAndDropPage: DragAndDropPage;

  test.beforeEach(async ({ page }) => {
    await page.goto('/practice/drag-and-drop-1.html');
    dragAndDropPage = new DragAndDropPage(page);
  });

  test('drag&drop', async ({}) => {
    //Given
    const filePath = path.resolve('test-files\\upload.json');
    const resultsContainer = dragAndDropPage.resultsArea;
    //When
    await dragAndDropPage.browseButton.click();
    await dragAndDropPage.uploadFile(filePath);
    await dragAndDropPage.uploadButton.click();
    // Then
    await expect(resultsContainer).toContainText(
      'File uploaded! {"name": "John"}',
    );
  });
});
