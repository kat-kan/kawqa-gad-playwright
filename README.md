# Playwright Tests for GAD application

[![Playwright API auto-checks status](https://github.com/kat-kan/kawqa-gad-playwright/actions/workflows/pw-tests.yml/badge.svg?branch=main)](https://github.com/kat-kan/kawqa-gad-playwright/actions/workflows/pw-tests.yml)

## Installation and setup

### Prerequisites

- VS Code IDE installed → https://code.visualstudio.com/
- (optional) VS Code recommended plugins installed:
  - [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for uniform formatting of the code
  - [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  - [GitLens - Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) adding set of useful features supporting code versioning
  - [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) for making quick API requests within VS Code
  - [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons) - repository of all icons used in Visual Studio Code (for VS Code customization)
- GIT for your OS installed → https://git-scm.com/downloads
- Node.js installed → https://nodejs.org/en/download
- GAD application is running locally → follow README instructions
  from GAD repository: </br> https://github.com/jaktestowac/gad-gui-api-demo/
- (optional) access to Playwright course https://jaktestowac.pl/playwright

### Test Repository Setup

Please check information in our [contribution guidelines](https://github.com/kat-kan/kawqa-gad-playwright/blob/main/CONTRIBUTING.md)

### Running Tests

- to run all tests: `npx playwright test`
- to run a specific test: `npx playwright test {testfilename.ts}`
