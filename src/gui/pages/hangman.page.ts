import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class HangmanPage extends BasePage {
  url = '/games/hangman.html';
  hangmanPicture = this.page.locator('#hangman');
  mySolutionWord = this.page.locator('#word');
  startButton = this.page.getByTestId('startButton');
  letterRow = this.page.locator('#letters');

  constructor(page: Page) {
    super(page);
  }

  async clickStartButtonWithGameSolution(endpointUrl: string): Promise<string> {
    const responsePromise = this.page.waitForResponse((response) => {
      return response.url().includes(endpointUrl) && response.status() === 200;
    });
    await this.startButton.click();
    const response = await responsePromise;
    const responseJson = await response.json();
    const finalWord = responseJson.word;
    return finalWord;
  }
}
