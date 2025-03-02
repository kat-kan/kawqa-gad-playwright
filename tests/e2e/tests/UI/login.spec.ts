import { HomePage } from '../../../../src/e2e/pages/home.page';
import { LoginPage } from '../../../../src/e2e/pages/login.page';
import { UserPage } from '../../../../src/e2e/pages/user.page';
import { loginData1 } from '../../../../test-data/e2e/UI/login.data';
import {
  invalidEmails,
  invalidPasswords,
} from '../../../../test-data/e2e/UI/test.data';
import { generateRandomValidUser } from '../../data-generators/testDataHelpers';
import { faker } from '@faker-js/faker';
import { expect, test } from '@playwright/test';

test.describe('User Authentication Tests. User Registration, Login and Deletion Test', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let userPage: UserPage;

  test.beforeEach(async ({ page }) => {
    userPage = new UserPage(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);

    await page.goto('/register.html');
  });
  // 1
  // Retrieves user data declared in the login.data.ts file for better data control.
  test(
    'should register a new user successfully, log in and deletion',
    { tag: ['@e2e', '@registration', '@login', '@deletion'] },
    async ({ page }) => {
      // Arrange
      const { firstName, lastName, email, password } = loginData1;
      const userCreated = 'User created';

      // Act - Register
      await userPage.createUser(firstName, lastName, email, password);

      // Assert - Registration - added locator (PR)
      await expect(loginPage.alertPopUp).toHaveText(`${userCreated}`);

      // Act - Login
      await loginPage.login(email, password);

      // Assert - Login
      await expect(loginPage.userName).toHaveText(`Hi ${email}!`);

      // Act & Assert - Deletion
      await homePage.deleteUser();
    },
  );

  // 2a
  test(
    'should not register user with missing required field: firstName',
    { tag: ['@smoke', '@registration'] },
    async ({ page }) => {
      // Arrange
      const { lastName, email, password } = loginData1;
      const firstNameEmpty = '';
      // Act - Register
      await userPage.createUser(firstNameEmpty, lastName, email, password);

      // Assert - Registration
      await expect(page.getByText('This field is required')).toHaveText(
        'This field is required',
      );
    },
  );

  // 2b
  test(
    'should not register user with missing required field: lastName',
    { tag: ['@smoke', '@registration'] },
    async ({ page }) => {
      // Arrange
      const { firstName, email, password } = loginData1;
      const lastNameEmpty = '';
      // Act - Register
      await userPage.createUser(firstName, lastNameEmpty, email, password);

      // Assert - Registration
      await expect(page.getByText('This field is required')).toHaveText(
        'This field is required',
      );
    },
  );

  // 2c
  test(
    'should not register user with missing required field: email',
    { tag: ['@smoke', '@registration'] },
    async ({ page }) => {
      // Arrange
      const { firstName, lastName, password } = loginData1;
      const emailEmpty = '';
      // Act - Register
      await userPage.createUser(firstName, lastName, emailEmpty, password);

      // Assert - Registration
      await expect(page.getByText('This field is required')).toHaveText(
        'This field is required',
      );
    },
  );

  // 2d
  test(
    'should not register user with missing required field: password',
    { tag: ['@smoke', '@registration'] },
    async ({ page }) => {
      // Arrange
      const { firstName, lastName, email } = loginData1;
      const passwordEmpty = '';
      // Act - Register
      await userPage.createUser(firstName, lastName, email, passwordEmpty);

      // Assert - Registration
      await expect(page.getByText('This field is required')).toHaveText(
        'This field is required',
      );
    },
  );

  // 3 replaces test group no. 3

  invalidEmails.forEach((incorrectEmail) => {
    test(
      `should not register user with invalid email format: ${incorrectEmail}`,
      { tag: ['@smoke', '@registration'] },
      async ({ page }) => {
        // Arrange
        const password = faker.internet.password();
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();

        // Act - Register
        await userPage.createUser(
          firstName,
          lastName,
          incorrectEmail,
          password,
        );

        // Assert - Registration
        await expect(page.getByText('Please provide a valid email')).toHaveText(
          'Please provide a valid email address',
        );
      },
    );
  });

  // 4
  test(
    'should not register user with an existing email',
    { tag: ['@e2e', '@registration', '@login'] },
    async ({ page }) => {
      // Arrange
      const userData = generateRandomValidUser();
      const password2 = '456$456';
      const userCreated = 'User created';
      const userNotCreated = 'User not created! Email not unique';

      // Act - Register
      await userPage.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
      );

      // Assert - Registration - added locator (PR)
      await expect(loginPage.alertPopUp).toHaveText(`${userCreated}`);

      // Act - Login
      await loginPage.login(userData.email, userData.password);

      // Assert - Login
      await expect(loginPage.userName).toHaveText(`Hi ${userData.email}!`);

      // Act - Logout
      await homePage.logout();

      // Act - Register at the same email
      await page.goto('/register.html');
      await userPage.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        password2,
      );

      // Assert - Registration - added locator (PR)
      await expect(loginPage.alertPopUp).toHaveText(`${userNotCreated}`);
    },
  );

  // 5 replaces test group no. 5
  // Currently, there is no password validation - accounts can be created with single-character passwords.
  // These tests may fail once password validation is implemented.

  invalidPasswords.forEach((password) => {
    test(
      `should validate password requirements during registration: ${password}`,
      { tag: ['@smoke', '@registration', '@login'] },
      async ({ page }) => {
        // Arrange
        const email = faker.internet.email();
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const userCreated = 'User created';

        // Act - Register
        await userPage.createUser(firstName, lastName, email, password);

        // Assert - Registration - added locator (PR)
        await expect(loginPage.alertPopUp).toHaveText(`${userCreated}`);

        // Act - Login
        await loginPage.login(email, password);

        // Assert - Login
        await expect(loginPage.userName).toHaveText(`Hi ${email}!`);
      },
    );
  });

  // 6
  test(
    'should not allow login after account deletion',
    { tag: ['@e2e', '@registration', '@login', '@deletion'] },
    async ({ page }) => {
      // Arrange
      const userData = generateRandomValidUser();
      const userCreated = 'User created';

      // Act - Register
      await userPage.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
      );

      // Assert - Registration - added locator (PR)
      await expect(loginPage.alertPopUp).toHaveText(`${userCreated}`);

      // Act - Login
      await loginPage.login(userData.email, userData.password);

      // Assert - Login
      await expect(loginPage.userName).toHaveText(`Hi ${userData.email}!`);

      // Act & Assert - Deletion
      await homePage.deleteUser();

      // Act - Re-Login
      await page.waitForTimeout(2000); // 2 second delay to re-login
      await page.goto('/login/');
      await loginPage.login(userData.email, userData.password);

      // Assert - Login
      await expect(page.getByTestId('login-error')).toHaveText(
        `Invalid username or password`,
      );
    },
  );

  // 7a
  test(
    'should not login user with invalid email',
    { tag: ['@e2e', '@registration', '@login'] },
    async ({ page }) => {
      // Arrange
      const userData = generateRandomValidUser();
      const emailInvalid = 'a@h.com';
      const userCreated = 'User created';

      // Act - Register
      await userPage.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
      );

      // Assert - Registration - added locator (PR)
      await expect(loginPage.alertPopUp).toHaveText(`${userCreated}`);

      // Act - Invalid Login
      await loginPage.login(emailInvalid, userData.password);

      // Assert - Login
      await expect(page.getByTestId('login-error')).toHaveText(
        `Invalid username or password`,
      );
    },
  );

  // 7b
  test(
    'should not login user with invalid password',
    { tag: ['@e2e', '@registration', '@login'] },
    async ({ page }) => {
      // Arrange
      const userData = generateRandomValidUser();
      const passwordInvalid = '45!5';
      const userCreated = 'User created';

      // Act - Register
      await userPage.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
      );

      // Assert - Registration - added locator (PR)
      await expect(loginPage.alertPopUp).toHaveText(`${userCreated}`);

      // Act - Invalid password
      await loginPage.login(userData.email, passwordInvalid);

      // Assert - Login
      await expect(page.getByTestId('login-error')).toHaveText(
        `Invalid username or password`,
      );
    },
  );

  // 7c
  test(
    'should not login user with empty email',
    { tag: ['@e2e', '@registration', '@login'] },
    async ({ page }) => {
      // Arrange
      const userData = generateRandomValidUser();
      const emailInvalid = '';
      const userCreated = 'User created';

      // Act - Register
      await userPage.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
      );
      // Assert - Registration - added locator (PR)
      await expect(loginPage.alertPopUp).toHaveText(`${userCreated}`);

      // Act - Invalid Login
      await loginPage.login(emailInvalid, userData.password);

      // Assert - Login
      await expect(page.getByTestId('login-error')).toHaveText(
        `Invalid username or password`,
      );
    },
  );

  // 7d
  test(
    'should not login user with empty password',
    { tag: ['@e2e', '@registration', '@login'] },
    async ({ page }) => {
      // Arrange
      const userData = generateRandomValidUser();
      const passwordInvalid = '';
      const userCreated = 'User created';

      // Act - Register
      await userPage.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
      );

      // Assert - Registration - added locator (PR)
      await expect(loginPage.alertPopUp).toHaveText(`${userCreated}`);

      // Act - Invalid Login
      await loginPage.login(userData.email, passwordInvalid);

      // Assert - Login
      await expect(page.getByTestId('login-error')).toHaveText(
        `Invalid username or password`,
      );
    },
  );

  // 8
  test(
    'should log out user successfully. Successful registration, login, logout and relogin',
    {
      tag: ['@e2e', '@registration', '@login', '@logout'],
    },
    async ({ page }) => {
      // Arrange
      const userData = generateRandomValidUser();
      const userCreated = 'User created';

      // Act - Register
      await userPage.createUser(
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.password,
      );

      // Assert - Registration - added locator (PR)
      await expect(loginPage.alertPopUp).toHaveText(`${userCreated}`);

      // Act - Login
      await loginPage.login(userData.email, userData.password);

      // Assert - Login
      await expect(loginPage.userName).toHaveText(`Hi ${userData.email}!`);

      // Act - Logout
      await homePage.logout();

      // Act - Login
      await loginPage.login(userData.email, userData.password);

      // Assert - Login
      await expect(loginPage.userName).toHaveText(`Hi ${userData.email}!`);
    },
  );
});
