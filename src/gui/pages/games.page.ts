import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class GamesPage extends BasePage {
  url = '/games/games.html';
  skipButton = this.page.locator('.skip-button');
  hangmanTile = this.page.getByRole('link', {
    name: ' Hangman Guess the word',
  });

  constructor(page: Page) {
    super(page);
  }
}
