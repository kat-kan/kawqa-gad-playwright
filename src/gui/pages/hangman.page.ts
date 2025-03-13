import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class HangmanPage extends BasePage {
  url = '/games/hangman.html';
  hangmanPicture = this.page.locator('#hangman');
  mySolutionWord = this.page.locator('#word');
  startButton = this.page.getByTestId('startButton');
  letterRow = this.page.locator('#letters');
  hangmanSequence = [
    '_________ | | | | | _|_',
    '_________ | | | O | | _|_',
    '_________ | | | O | | | _|_',
    '_________ | | | O | /| | _|_',
    '_________ | | | O | /|\\ | _|_',
    '_________ | | | O | /|\\ | / _|_',
    '_________ | | | O | /|\\ | / \\ _|_',
  ];
  letters = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'SPACE',
  ];

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
