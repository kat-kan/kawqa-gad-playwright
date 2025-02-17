import test, { expect } from '@playwright/test';
import { GamesPage } from 'src/gui/pages/games.page';
import { HangmanPage } from 'src/gui/pages/hangman.page';

test('Opening the game with authorization @logged', async ({ page }) => {
  // Given user opened Games homepage
  const gamesPage = new GamesPage(page);
  await page.goto(gamesPage.url);
  await expect(gamesPage.skipButton).toHaveText('Skip');
  await gamesPage.skipButton.click();

  // When
  await gamesPage.hangmanTile.click();

  // Then
  const hangmanPage = new HangmanPage(page);
  await expect(hangmanPage.hangmanPicture).toBeVisible();
});

test('Starting the game @logged', async ({ page }) => {
  // Given
  const hangmanPage = new HangmanPage(page);
  await page.goto(hangmanPage.url);

  // When
  const gameSolution = await hangmanPage.clickStartButtonWithGameSolution(
    '/api/hangman/random',
  );
  const mySolution = await hangmanPage.mySolutionWord.textContent();

  // Then
  await expect
    .soft(hangmanPage.hangmanPicture)
    .toHaveText(hangmanPage.hangmanSequence[0]);
  expect.soft(mySolution).not.toMatch(/[A-Z]/);
  expect.soft(mySolution).toContain('_ ');
  expect.soft(mySolution).toHaveLength(gameSolution.length * 2 - 1);
  await expect.soft(hangmanPage.letterRow).toBeVisible();
});

// eslint-disable-next-line playwright/expect-expect
test('Failed game has proper sequence of hangman pictures @logged', async ({
  page,
}) => {
  // Given
  const hangmanPage = new HangmanPage(page);
  await page.goto(hangmanPage.url);
  const gameSolution = await hangmanPage.clickStartButtonWithGameSolution(
    '/api/hangman/random',
  );

  let letterNumber = 0;
  for (let index = 0; index < hangmanPage.hangmanSequence.length; index++) {
    if (hangmanPage.letters[letterNumber] in gameSolution) {

    }
    const element = hangmanPage.hangmanSequence[index];
  }

  // hangmanPage.hangmanSequence
});
