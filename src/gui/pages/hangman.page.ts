import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class HangmanPage extends BasePage {
  url = '/games/hangman.html';
  hangmanPicture = this.page.locator('#hangman');
  soughtWord = this.page.locator('#word');
  startButton = this.page.getByTestId('startButton');
  letterRow = this.page.locator('#letters');

  constructor(page: Page) {
    super(page);
  }
}
