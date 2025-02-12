import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class HangmanPage extends BasePage {
  url = '/games/hangman.html';
  hangmanPicture = this.page.locator('#hangman');

  constructor(page: Page) {
    super(page);
  }
}
