import { PracticePage } from './practice-page.page';
import { Page } from '@playwright/test';
import { Locator } from '@playwright/test';

export class SimpleElementsWithIdsPage extends PracticePage {
  readonly label: Locator;
  readonly button: Locator;
  readonly checkbox: Locator;
  readonly input: Locator;
  readonly textArea: Locator;
  readonly dropDownList: Locator;
  readonly radioButtonFirst: Locator;
  readonly radioButtonSecond: Locator;
  readonly radioButtonThird: Locator;
  readonly rangeBar: Locator;
  readonly tooltip: Locator;
  readonly dateInput: Locator;
  readonly colorInput: Locator;
  readonly resultsArea: Locator;

  constructor(page: Page) {
    super(page);
    this.label = this.page.getByTestId('dti-label-element');
    this.button = this.page.getByTestId('dti-button-element');
    this.checkbox = this.page.getByTestId('dti-checkbox');
    this.input = this.page.getByTestId('dti-input');
    this.textArea = this.page.getByTestId('dti-textarea');
    this.dropDownList = this.page.getByTestId('dti-dropdown');
    this.radioButtonFirst = this.page.getByTestId('dti-radio1');
    this.radioButtonSecond = this.page.getByTestId('dti-radio2');
    this.radioButtonThird = this.page.getByTestId('dti-radio3');
    this.rangeBar = this.page.getByTestId('dti-range');
    this.tooltip = this.page.getByTestId('dti-tooltip-element');
    this.dateInput = this.page.getByTestId('dti-date');
    this.colorInput = this.page.getByTestId('dti-color');
    this.resultsArea = this.page.getByTestId('dti-results');
  }
}
