import { BasePage } from './base.page';
import { APIRequestContext, Page } from '@playwright/test';

export class HangmanPage extends BasePage {
  url = '/games/hangman.html';
  hangmanPicture = this.page.locator('#hangman');
  soughtWord = this.page.locator('#word');
  startButton = this.page.getByTestId('startButton');
  letterRow = this.page.locator('#letters');

  constructor(page: Page) {
    super(page);
  }

  async checkGameSolution(request: APIRequestContext): Promise<string> {
    const response = await request.get('/api/hangman/random');
    const jsonReworked = JSON.parse(JSON.stringify(await response.json()));
    return jsonReworked.word;
  }
}
