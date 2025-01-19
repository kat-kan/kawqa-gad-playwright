import { Locator, Page } from '@playwright/test';

export class PracticePage {
  protected page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async textAreaStretching(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  ): Promise<void> {
    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, endY, { steps: 10 });
    await this.page.mouse.up();
  }
  async uploadFile(fileInput: Locator, filePath: string): Promise<void> {
    await fileInput.setInputFiles(filePath);
  }
}
