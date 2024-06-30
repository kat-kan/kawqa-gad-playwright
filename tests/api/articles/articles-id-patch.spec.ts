import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
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
    setHeadersForRegularUser = await createHeaders('regular');
  });

  test('Returns 200 OK status code when updating article', async ({
    request,
  }) => {
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

  test('Returns 404 Not Found status code when trying to update non-existing article', async ({
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

  test('Returns 401 Unauthorized status code when trying to update existing article with random text as token', async ({
    request,
  }) => {
    // Given
    const setInvalidHeaders: { [key: string]: string } =
      await createInvalidHeaders();
    const expectedErrorMessage = 'Access token not provided!';

    // When
    const response: APIResponse = await request.patch(`/api/articles/1`, {
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

  test('Returns 401 Unauthorized status code when trying to update article added by different user', async ({
    request,
  }) => {
    // Given
    const expectedErrorMessage = 'Access token for given user is invalid!';

    // When
    const response: APIResponse = await request.patch(`/api/articles/2`, {
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

  test('Returns 400 Bad Request status code when trying to update existing article with malformed JSON', async ({
    request,
  }) => {
    // Given
    const malformedJson: string = `{
        "user_id": "${testUsers.regularUser.id}",
        "title: ${newTitle},
        "body": "${newContent}" 
      }`;

    // When
    const response: APIResponse = await request.patch(`/api/articles/1`, {
      headers: setHeadersForRegularUser,
      data: malformedJson,
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.BadRequest);
  });

  test('Returns 422 Unprocessable Entity status code when trying to update existing article with title that exceeds length limit', async ({
    request,
  }) => {
    // Given
    const expectedErrorMessage =
      'One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "title" longer than "10000"';

    // When
    const response: APIResponse = await request.patch(`/api/articles/1`, {
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

  test('Returns 200 OK status code when updating as admin existing article with title that normally exceeds length limit', async ({
    request,
  }) => {
    // Given
    const setHeadersForAdmin: { [key: string]: string } =
      await createHeaders('admin');

    // When
    const response: APIResponse = await request.patch(`/api/articles/2`, {
      headers: setHeadersForAdmin,
      data: {
        title: newTitleExceedingLengthLimit,
      },
    });
    const body = await response.json();
    logConsole('Body after Admin patches article: ', body);

    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
    expect(body.title).toBe(newTitleExceedingLengthLimit);
  });
});
