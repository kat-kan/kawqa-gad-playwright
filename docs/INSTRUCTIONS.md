# Table of Contents

1. [GUI tests with authorization](#gui-tests-with-authorization)
2. [Using Faker in tests](#using-faker-in-tests)

# Instructions

## GUI tests with authorization <a id="gui-tests-with-authorization"></a>

**Source**: [Pull Request #168](https://github.com/kat-kan/kawqa-gad-playwright/pull/168)

### Description

The test `tests/gui/setup/login.setup.ts` logs the user in. The test is set as a part of `setup` project in `playwright.config.ts`. The `setup` project is placed in the `dependencies` section of the `chromium-logged-gui` project, which means it is run before each test run with `@logged` tag.

**1. Writing tests**

- To write the test requiring logging in, put tag `@logged` in the test name, e.g.

```typescript
test('Should open the Hangman game @logged', async ({
```

- To write the test without authorization, do not put the tag `@logged` in the test name. Such tests are part of the `chromium` project as defined in `playwright.config.ts`

**2. Running tests in VS Code**  
To run the test, please ensure you've enabled projects `setup` and `chromium-logged-gui`, e.g. in the `Testing` tab in VS Code

**Example of usage**  
Test [Opening the Hangman game with authorization](/tests/gui/games/hangman.spec.ts)

## Using Faker in tests <a id="using-faker-in-tests"></a>

**Source**: [Pull Request #128](https://github.com/kat-kan/kawqa-gad-playwright/pull/128)

### Description

Faker is the library that allows to randomly generate fake data in tests. You can find more data on [FakerJS website](https://fakerjs.dev/).

In the KawQA project, we can use the faker on all testing levels, e.g. for:

- creating random (and fake) user data
- creating random content for articles and comments

**1. Installation**  
To install the faker library, use the command `npm i @faker-js/faker`

**2. Using faker in tests**
Faker requires importing in the test file. I suggest importing only the EN version to improve test performance:

```typescript
import { faker } from '@faker-js/faker/locale/en';
```

Then in the test, use a selected module from fakerJS, e.g.:

```typescript
const userFirstName = faker.person.firstName().replace(/[^A-Za-z]/g, '');
let userLastName = faker.person.lastName().replace(/[^A-Za-z]/g, '');
const userEmail = faker.internet.email({
  firstName: userFirstName,
  lastName: userLastName,
});
const userPassword = faker.internet.password();
```

**Note**: Faker can create names with special characters (e.g. hyphens). If you wish to use only Latin letters, use e.g. `.replace(/[^A-Za-z]/g, '')` (as in the code block above).

**Example of usage**  
Function [generateFakeUserData](/test-data/shared/user.generator.ts)
