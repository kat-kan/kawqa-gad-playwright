# Playwright Tests for GAD application [![Playwright API auto-checks status](https://github.com/kat-kan/kawqa-gad-playwright/actions/workflows/pw-tests.yml/badge.svg?branch=main)](https://github.com/kat-kan/kawqa-gad-playwright/actions/workflows/pw-tests.yml)

## Installation and setup

### Prerequisites

- VS Code IDE installed → https://code.visualstudio.com/
- (optional) VS Code recommended plugins installed:
  </br>→ [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
  </br>→ [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  </br>→ [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  </br>→ [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
  </br>→ [GitLens - Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
  </br>→ [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) for making quick API requests within VS Code
- GIT for your OS installed → https://git-scm.com/downloads
- Node.js installed → https://nodejs.org/en/download
- GAD application is running locally → follow README instructions
  from GAD repository: </br> https://github.com/jaktestowac/gad-gui-api-demo/
- (optional) access to Playwright course https://jaktestowac.pl/playwright

### Test Repository Setup

1. ```
   git clone https://github.com/kat-kan/kawqa-gad-playwright.git
   ```
2. install dependencies:
   `npm install`
3. setup Playwright with:
   `npx playwright install --with-deps chromium`
4. copy `.env-template` file and change its name to `.env`
5. if you use localhost version of the GAD application, `BASE_URL` variable in `.env` file should stay intact, otherwise it should be changed to a proper one
6. add user email and user password to the `.env` file

More info on how to add changes to the repo - see our [Contribution Guidelines](https://github.com/kat-kan/kawqa-gad-playwright/blob/CONTRIBUTION.md/)

### Running Tests

- to run all tests: `npx playwright test`
- to run a specific test: `npx playwright test {testfilename.ts}`
