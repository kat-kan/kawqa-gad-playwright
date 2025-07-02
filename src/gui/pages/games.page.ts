import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class GamesPage extends BasePage {
  readonly skipButton: Locator;
  readonly hangmanTile: Locator;

  readonly url: string;

  constructor(page: Page) {
    super(page);

    this.skipButton = this.page.locator('.skip-button');
    this.hangmanTile = this.page.getByRole('link', {
      name: ' Hangman Guess the word',
    });

    this.url = '/games/games.html';
  }
}
