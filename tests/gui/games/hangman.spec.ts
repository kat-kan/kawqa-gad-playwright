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
  await hangmanPage.startButton.click();

  // Then
  await expect
    .soft(hangmanPage.hangmanPicture)
    .toHaveText('_________\n|\n|\n|\n|\n|\n_|_');
  await expect.soft(hangmanPage.soughtWord).not.toContainText(/[A-Z]/);
  await expect.soft(hangmanPage.soughtWord).toContainText('_ ');
  await expect.soft(hangmanPage.letterRow).toBeVisible();
});
