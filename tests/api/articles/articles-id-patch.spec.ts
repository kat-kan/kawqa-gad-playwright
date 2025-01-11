import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { UserType } from '@_src_api/enums/user-types.enum';
import { logConsole } from '@_src_api/utils/log-levels';
import { testUsers } from '@_src_fixtures_api/auth';
import {
  createHeaders,
  createInvalidHeaders,
} from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('PATCH articles/{id} endpoint tests', async () => {
  const articles: string = `/api/articles`;
  let setHeadersForRegularUser: { [key: string]: string };
  let setHeaders: { [key: string]: string };
  let randomNumber: string;
  let newTitle: string;
  const newContent =
    'Start with a Feature Description:\nBegin each Gherkin feature file with a high-level description\n of the feature you are testing. This provides context for the scenarios that follow\n Example: \nFeature: User Authentication \nAs a user,\nI want to be able to log in to my account,\nSo that I can access my personalized content.';
  const newTitleExceedingLengthLimit = 'test'.repeat(10001);

  test.beforeAll(async () => {
    randomNumber = Math.random().toString();
    newTitle = `How to start writing effective test cases in Gherkin ${randomNumber}`;
    setHeaders = await createHeaders();
    setHeadersForRegularUser = await createHeaders(UserType.regular);
  });

  test('Returns 200 OK when updating article', async ({ request }) => {
    // When
    const response: APIResponse = await request.patch(`${articles}/1`, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: newTitle,
        body: newContent,
      },
    });
    const body = await response.json();

    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
    expect(body.title).toBe(newTitle);
    expect(body.body).toBe(newContent);
  });

  test('Returns 404 Not Found when trying to update non-existing article', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.patch(`${articles}/0`, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: newTitle,
        body: newContent,
      },
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.NotFound);
  });

  test('Returns 401 Unauthorized when trying to update existing article with incorrect token', async ({
    request,
  }) => {
    // Given
    const setInvalidHeaders: { [key: string]: string } =
      await createInvalidHeaders();
    const expectedErrorMessage = 'Access token not provided!';

    // When
    const response: APIResponse = await request.patch(`${articles}/1`, {
      headers: setInvalidHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: newTitle,
        body: newContent,
      },
    });
    const body = await response.json();

    // Then
    expect(response.status()).toBe(HttpStatusCode.Unauthorized);
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test('Returns 401 Unauthorized when trying to update article added by different user', async ({
    request,
  }) => {
    // Given
    const expectedErrorMessage = 'Access token for given user is invalid!';

    // When
    const response: APIResponse = await request.patch(`${articles}/2`, {
      headers: setHeadersForRegularUser,
      data: {
        user_id: testUsers.regularUser.id,
        title: newTitle,
        body: newContent,
      },
    });
    const body = await response.json();

    // Then
    expect(response.status()).toBe(HttpStatusCode.Unauthorized);
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test('Returns 400 Bad Request when trying to update existing article with malformed JSON', async ({
    request,
  }) => {
    // Given
    // error: missing closing quotation mark
    const malformedJson: string = `{"user_id": "${testUsers.regularUser.id}", "title: "${newTitle}", "body": "${newContent}"}`;

    // When
    const response: APIResponse = await request.patch(`${articles}/1`, {
      headers: setHeadersForRegularUser,
      data: malformedJson,
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.BadRequest);
  });

  test('Returns 422 Unprocessable Entity when trying to update existing article with title exceeding the length limit', async ({
    request,
  }) => {
    // Given
    const expectedErrorMessage =
      'One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "title" longer than "10000"';

    // When
    const response: APIResponse = await request.patch(`${articles}/1`, {
      headers: setHeadersForRegularUser,
      data: {
        user_id: testUsers.regularUser.id,
        title: newTitleExceedingLengthLimit,
      },
    });
    const body = await response.json();

    // Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test('Returns 200 OK when admin updates existing article with title exceeding the length limit set for regular users', async ({
    request,
  }) => {
    // Given
    const setHeadersForAdmin: { [key: string]: string } = await createHeaders(
      UserType.admin,
    );

    // When
    const response: APIResponse = await request.patch(`${articles}/2`, {
      headers: setHeadersForAdmin,
      data: {
        title: newTitleExceedingLengthLimit,
      },
    });
    const body = await response.json();
    logConsole(`Body after Admin patches article: ${body.title}`);

    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
    expect(body.title).toBe(newTitleExceedingLengthLimit);
  });
});
