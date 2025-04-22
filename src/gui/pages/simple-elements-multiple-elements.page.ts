import { PracticePage } from './practice-page.page';
import { Locator, Page } from '@playwright/test';

export class SimpleElementsMultipleElements extends PracticePage {
  readonly checkboxes: Locator;
  readonly resultsHistoryContainer: Locator;
  readonly url: string;

  constructor(page: Page) {
    super(page);

    this.checkboxes = this.page.getByRole('checkbox');
    this.resultsHistoryContainer = this.page.locator(
      '#results-history-container',
    );
    this.url = '/practice/simple-multiple-elements-no-ids.html';
  }

  async checkCheckbox(index: number): Promise<void> {
    const checkbox = this.checkboxes.nth(index);
    await checkbox.check();
  }

  async uncheckCheckbox(index: number): Promise<void> {
    const checkbox = this.checkboxes.nth(index);
    await checkbox.uncheck();
  }

  async getResultsText(): Promise<string> {
    return await this.resultsArea.textContent();
  }

  async getHistoryText(): Promise<string> {
    return await this.resultsHistoryContainer.inputValue();
  }
}
