# Playwright Tests for GAD application
 
## Installation and setup
### Prerequisites
- VS Code IDE installed → https://code.visualstudio.com/
- (optional) VS Code recommended plugins installed:
</br>→ [Playwright Test for VSCode](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright)
</br>→ [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
</br>→ [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
</br>→ [vscode-icons](https://marketplace.visualstudio.com/items?itemName=vscode-icons-team.vscode-icons)
</br>→ [GitLens - Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
- GIT for your OS installed → https://git-scm.com/downloads
- Node.js installed → https://nodejs.org/en/download
- GAD application is running locally → follow README instructions
from GAD repository: </br> https://github.com/jaktestowac/gad-gui-api-demo/
- (optional) access to Playwright course https://jaktestowac.pl/playwright

### Test Repository Setup
1. ```
   git clone https://github.com/kat-kan/kawqa-gad-playwright.git
   ```
3. install dependencies:
   ```
   npm install
   ```

more info on how to add changes to the repo - see our [Contribution Guidlines](https://github.com/kat-kan/kawqa-gad-playwright/blob/CONTRIBUTION.md/)

### Running Tests
- to run all tests:
```
npx playwright test
```
- to run a specific test:
```
npx playwright test {testfilename.ts}
```
