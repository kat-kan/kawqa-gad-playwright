import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import {
  createHeaders,
  createInvalidHeaders,
} from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('PATCH articles/{id} endpoint tests', async () => {
  const articles: string = `/api/articles`;
  let setHeadersForRegularUser;
  let setHeadersForAdmin;
  let setInvalidHeaders;
  let setHeaders;
  const newTitle = 'How to start writing effective test cases in Gherkin';
  const newContent =
    'Start with a Feature Description:\nBegin each Gherkin feature file with a high-level description\n of the feature you are testing. This provides context for the scenarios that follow\n Example: \nFeature: User Authentication \nAs a user,\nI want to be able to log in to my account,\nSo that I can access my personalized content.';
  let newTitleExceedingLengthLimit = 'test'.repeat(10001);

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
    setHeadersForRegularUser = await createHeaders('regular');
    setHeadersForAdmin = await createHeaders('admin');
    setInvalidHeaders = await createInvalidHeaders();
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
    const code = response.status();
    const body = await response.json();

    // Then
    expect(code).toBe(HttpStatusCode.Ok);
    expect(body.title).toBe(newTitle);
    expect(body.body).toBe(newContent);
  });

  test('Returns 404 NotFound status code when trying to update non-existing article', async ({
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
    const code = response.status();

    // Then
    expect(code).toBe(HttpStatusCode.NotFound);
  });

  test('Returns 401 Unauthorized status code when trying to update existing article with random text as token', async ({
    request,
  }) => {
    // Given
    const expectedResponseCode = HttpStatusCode.Unauthorized;
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
    const code = response.status();
    const body = await response.json();

    // Then
    expect(code).toBe(expectedResponseCode);
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test('Returns 401 Unauthorized status code when trying to update article added by different user', async ({
    request,
  }) => {
    // Given
    const expectedResponseCode = HttpStatusCode.Unauthorized;
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

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
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
    const expectedResponseCode = HttpStatusCode.BadRequest;

    // When
    const response: APIResponse = await request.patch(`/api/articles/1`, {
      headers: setHeadersForRegularUser,
      data: malformedJson,
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);
  });

  test('Returns 422 Unprocessable Entity status code when trying to update existing article with title that exceeds length limit', async ({
    request,
  }) => {
    // Given
    const expectedResponseCode = HttpStatusCode.UnprocessableEntity;
    const expectedErrorMessage =
      'One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "title" longer than "10000"';

    // When
    const response: APIResponse = await request.patch(`/api/articles/1`, {
      headers: setHeadersForRegularUser,
      data: {
        user_id: testUsers.regularUser.id,
        title: `${newTitleExceedingLengthLimit}`,
      },
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test('Returns 200 OK status code when updating as admin existing article with title that normally exceeds length limit', async ({
    request,
  }) => {
    // Given
    const expectedResponseCode = HttpStatusCode.Ok;

    // When
    const response: APIResponse = await request.patch(`/api/articles/1`, {
      headers: setHeadersForAdmin,
      data: {
        title: `${newTitleExceedingLengthLimit}`,
      },
    });

    // Then
    const code = response.status();
    expect(code).toBe(expectedResponseCode);

    const body = await response.json();
    expect(body.title).toBe(newTitleExceedingLengthLimit);
  });
});
