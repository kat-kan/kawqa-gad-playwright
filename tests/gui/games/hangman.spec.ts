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

test('Successful game ends with success message @logged', async ({ page }) => {
  // Given
  const hangmanPage = new HangmanPage(page);
  const successMessage = 'Congratulations! Only 0 attempts!';
  await page.goto(hangmanPage.url);

  const solutionLetters = await hangmanPage.getSolutionLetters();
  const uniqueSolutionLetters = [...new Set(solutionLetters)];

  for (let index = 0; index < uniqueSolutionLetters.length; index++) {
    // When
    const currentLetter = uniqueSolutionLetters[index].toUpperCase();
    await hangmanPage.clickLetterInSolution(currentLetter);

    //Then
    await expect(hangmanPage.mySolutionWord).toContainText(currentLetter);
  }

  await expect.soft(hangmanPage.infoContainer).toContainText(successMessage);
  await expect
    .soft(hangmanPage.hangmanPicture)
    .toContainText(hangmanPage.hangmanSequence[0]);
});

test('Failed game has proper sequence of hangman pictures @logged', async ({
  page,
}) => {
  // Given
  const hangmanPage = new HangmanPage(page);
  await page.goto(hangmanPage.url);

  const solutionLetters = await hangmanPage.getSolutionLetters();

  for (let step = 1; step < hangmanPage.hangmanSequence.length; step++) {
    // When
    await hangmanPage.clickLetterNotInSolution(solutionLetters);
    const hangmanState = hangmanPage.hangmanSequence[step];

    // Then
    await expect(hangmanPage.hangmanPicture).toContainText(hangmanState);
  }
});
