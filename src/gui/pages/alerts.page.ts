import { PracticePage } from './practice-page.page';
import { Locator, Page } from '@playwright/test';

export class AlertsPage extends PracticePage {
  readonly simpleAlertButton: Locator;
  readonly alertWithFadeOutButton: Locator;
  readonly alertWithFadeOut: Locator;
  readonly alertWithCounterButton: Locator;
  readonly alertWithRandomFadeOutButton: Locator;
  readonly simplePopupModalButton: Locator;
  readonly acceptModalButton: Locator;
  readonly cancelModalButton: Locator;
  readonly firstAlertWithCustomMessage: Locator;
  readonly nextAlertWithCustomMessage: Locator;

  readonly url: string;

  constructor(page: Page) {
    super(page);

    this.simpleAlertButton = this.page.locator('#alert-box-btn');
    this.alertWithFadeOutButton = this.page.locator('#alert-btn');
    this.alertWithFadeOut = this.page.locator(
      '.simple-alert-on-left-1.alert-gad-emoji',
    );
    this.alertWithCounterButton = this.page.locator('#alert-counter-btn');
    this.alertWithRandomFadeOutButton = this.page.locator(
      '#alert-random-fade-out-btn',
    );
    this.simplePopupModalButton = this.page.locator('#popup-modal-btn');
    this.acceptModalButton = this.page.getByRole('button', { name: 'Accept' });
    this.cancelModalButton = this.page.getByRole('button', { name: 'Cancel' });
    this.firstAlertWithCustomMessage = this.page.locator(
      '#simple-alert-with-custom-message',
    );
    this.nextAlertWithCustomMessage = this.page.locator(
      '#simple-alert-with-random-flavour',
    );

    this.url = '/practice/alerts-1.html';
  }

  getAlertWithCounterLocator(index: number): Locator {
    return this.page.locator(`#alert-counter-${index}`);
  }

  getAlertWithRandomFadeOutLocator(index: number): Locator {
    return this.page.locator(`#alert-2-${index}`);
  }
}
