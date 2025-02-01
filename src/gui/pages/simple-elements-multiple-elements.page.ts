import { PracticePage } from './practice-page.page';
import { Locator, Page } from '@playwright/test';

export class SimpleElementsMultipleElements extends PracticePage {
  readonly checkboxes: Locator;
  readonly resultsContainer: Locator;
  readonly resultsHistoryContainer: Locator;

  constructor(page: Page) {
    super(page);

    this.checkboxes = this.page.getByRole('checkbox');
    this.resultsContainer = this.page.locator('#results');
    this.resultsHistoryContainer = this.page.locator(
      '#results-history-container',
    );
  }

  async checkCheckbox(index: number): Promise<void> {
    const checkbox = this.checkboxes.nth(index);
    await checkbox.check();
  }

  async uncheckCheckbox(index: number): Promise<void> {
    const checkbox = this.checkboxes.nth(index);
    await checkbox.uncheck();
  }

  async getHistoryText(): Promise<string> {
    return await this.resultsHistoryContainer.inputValue();
  }

  async getResultsText(): Promise<string> {
    return await this.resultsContainer.textContent();
  }
}
