/* eslint-disable playwright/expect-expect */
import { expect, test } from '@playwright/test';

test.describe('Testing Hangman game', () => {
  //   test('The game cannot be open without authorization', async ({ page }) => {
  // });
  test('Opening the game with authorization @logged', async ({ page }) => {
    page.goto('http://localhost:3000/games/games.html');
    await expect(page.locator('.skip-button')).toHaveText('Skip');
    await page.locator('.skip-button').click();
    await page.getByRole('link', { name: ' Hangman Guess the word' }).click();
    await expect(page.locator('#hangman')).toBeVisible();
    //prepare login
    // await page.goto(
    //   'http://localhost:3000/login/?redirectURL=/games/hangman.html',
    // );
    // await page.getByText('Skip').click();
    // await page.getByRole('link', { name: ' Hangman Guess the word' }).click();
    // When you click the Hangman button
    // Then Hangman page will open and Hangman will be drawn in full
  });
  test('Starting the game', async ({}) => {
    // Given you are on Hangman page
    // When you press Start button
    // Then empty hangman graph, empty word and full list of letters will appear
  });
  test.describe('Smoke tests for individual features', () => {
    test('Selection of correct character', async ({}) => {
      await test.step('Letter appears in the word after selection', async () => {
        // Given you started the game and you know the solution
        // When you press the correct letter
        // Then the letter will appear in the word
      });
      await test.step('Nothing changes after selection of the same correct character second time', async () => {
        // Given you started the game, you know the solution and selected the correct letter
        // When you press the same letter second time
        // Then nothing will change
      });
    });
    test('Selection of wrong character', async ({}) => {
      await test.step('Line is drawn on hangman after selection', async () => {
        // Given you started the game and you know the solution
        // When you press the wrong letter
        // Then the state of hangman will change to the next in order
      });
      await test.step('Next line is drawn on hangman after second selection of the same wrong character', async () => {
        // Given you started the game, you know the solution and selected the wrong letter
        // When you press the same letter second time
        // Then the state of hangman will again change to the next in order
      });
    });
  });
  test.describe('E2E tests for the whole game', () => {
    test('Tests if all hangman states are drawn in order in case of only wrong selections', async ({}) => {
      // Given
      // When
      // Then
    });
    test('Tests if game ends with success in case of only good selections', async ({}) => {
      // Given
      // When
      // Then
    });
  });
});
