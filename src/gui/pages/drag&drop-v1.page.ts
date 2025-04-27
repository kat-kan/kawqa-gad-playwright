import { PracticePage } from './practice-page.page';
import { Locator, Page } from '@playwright/test';

export class DragAndDropPage extends PracticePage {
  readonly browseButton: Locator;
  readonly uploadButton: Locator;
  readonly resultsArea: Locator;
  readonly fileInput: Locator;

  readonly url: string;

  constructor(page: Page) {
    super(page);

    this.browseButton = this.page.locator('#browsebutton');
    this.uploadButton = this.page.getByTestId('uploadBtn');
    this.resultsArea = this.page.locator('#results-container');
    this.fileInput = this.page.locator('#dragdropfile');

    this.url = '/practice/drag-and-drop-1.html';
  }
}
