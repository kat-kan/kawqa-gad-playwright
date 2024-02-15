# Contributing to Automated QAffe (PL: KawQA z automatu) GAD Playwright

Thank you for considering contributing to KawQA GAD Playwright! This project was created by a small group of test automation enthusiasts (we call ourselves "Automated QAffe" ☕️ - in Polish "KawQA z automatu", hence the project name).

We welcome contributions in several areas, including code improvements, documentation updates, code reviews, architecture advice. BUT FIRST please join our group meetings, it's fun and we have cookies 🍪

## Project goal

- Creating an awesome automation testing project with Playwright and TypeScript
- As automation enthusiasts, we learn from each other in a friendly supporting manner / environment

## How to start

### Run GAD application using free hosting sites or on local environment

All the information can be found in GAD's [README](https://github.com/jaktestowac/gad-gui-api-demo)

### Clone the repository

`git clone https://github.com/kat-kan/kawqa-gad-playwright.git`

### Set up the working area

1. install dependencies:
   `npm install`
2. setup Playwright with:
   `npx playwright install --with-deps chromium`
3. copy `.env-template` file and change its name to `.env`
4. if you use localhost version of the GAD application, `BASE_URL` variable in `.env` file should stay intact, otherwise it should be changed to a proper one
5. add user email and user password to the `.env` file

### Pull Request rules

1. All contributions are welcome, but please: a. Join the group first b. DO NOT create Pull Requests without an issue
2. Please make sure to pull the latest changes from main before you create a PR
3. We encourage to create branches from `main` only to keep things simple
4. Please try to fill in the information in the template carefully. We do not work on this repository on a daily basis and it is very important to provide context and explain your work.
5. Discussion in your PR is a GOOD THING! Asking questions and suggesting improvements is encouraged.
6. Resolving conversations should be done by PR creator and PR should not be merged without conversations being resolved.
7. Minimum of 2 approvals is required to merge.

### Branch naming rules

The agreed format is `<changeType:tests, docs, chore>/issueNumber>_<action:update/add/fix>_test_scenarios`.
Examples:

- `tests/ISSUE-1/articles_fix_tests_scenarios `
- `docs/ISSUE-2/update_readme`
- `chore/ISSUE-3/add_prettier_formatter`.

This format will be required to create a commit (Husky validation).

### Commit naming rules

The agreed format is `<type>(<scope>): <action> <description>` where `<scope>` is optional.
Examples:

- `docs(articles): fix 1 unhappy test scenarios`
- `style(articles): fix formatting`

### Contact

Most of the discussions takes place on Discord and during our bi-weekly meetings. If you are interested in joining the group, please create an issue for it and assign to @kat-kan.
