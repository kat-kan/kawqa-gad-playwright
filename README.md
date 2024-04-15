# Playwright Tests for GAD application

## Installation and setup

### Prerequisites

- VS Code IDE installed → https://code.visualstudio.com/
- (optional) VS Code recommended plugins installed:
  </br>→ [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
  </br>→ [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) for uniform formatting of the code
  </br>→ [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
  </br>→ [GitLens - Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens) adding set of useful features supporting code versioning
  </br>→ [Thunder Client](https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client) for making quick API requests within VS Code
    </br>→ [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons) - repository of all icons used in Visual Studio Code (for VS Code customization)
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
