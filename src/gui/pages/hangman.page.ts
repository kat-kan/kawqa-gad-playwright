import { BasePage } from './base.page';
import { Locator, Page } from '@playwright/test';

export class HangmanPage extends BasePage {
  readonly hangmanPicture: Locator;
  readonly mySolutionWord: Locator;
  readonly startButton: Locator;
  readonly letterRow: Locator;
  readonly infoContainer: Locator;

  readonly url: string;
  readonly hangmanSequence: string[];

  readonly letters: string[];

  constructor(page: Page) {
    super(page);
    this.hangmanPicture = this.page.locator('#hangman');
    this.mySolutionWord = this.page.locator('#word');
    this.startButton = this.page.getByTestId('startButton');
    this.letterRow = this.page.locator('#letters');
    this.infoContainer = this.page.locator('#info-container');

    this.url = '/games/hangman.html';
    this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    this.letters.push('SPACE');
    this.hangmanSequence = [
      '_________ | | | | | _|_',
      '_________ | | | O | | _|_',
      '_________ | | | O | | | _|_',
      '_________ | | | O | /| | _|_',
      '_________ | | | O | /|\\ | _|_',
      '_________ | | | O | /|\\ | / _|_',
      '_________ | | | O | /|\\ | / \\ _|_',
    ];
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

  async getSolutionLetters(): Promise<string[]> {
    const gameSolution = await this.clickStartButtonWithGameSolution(
      '/api/hangman/random',
    );
    const solutionLetters = [];
    for (let i = 0; i < gameSolution.length; i++) {
      solutionLetters.push(gameSolution.charAt(i));
    }
    return solutionLetters;
  }

  async clickLetter(letter: string): Promise<void> {
    await this.page.locator(`#btn-${letter}`).click();
  }

  async clickLetterInSolution(currentLetter: string): Promise<void> {
    currentLetter = currentLetter == ' ' ? 'SPACE' : currentLetter;
    await this.clickLetter(currentLetter);
  }

  async clickLetterNotInSolution(solutionLetters: string[]): Promise<void> {
    let letterNumber = -1;
    let currentLetter: string;
    do {
      letterNumber += 1;
      currentLetter = this.letters[letterNumber].toLowerCase();
      currentLetter = currentLetter == 'SPACE' ? ' ' : currentLetter;
    } while (solutionLetters.indexOf(currentLetter) > -1);
    if (letterNumber < this.letters.length) {
      currentLetter = currentLetter == ' ' ? 'SPACE' : currentLetter;
      await this.clickLetter(currentLetter);
    }
  }
}
