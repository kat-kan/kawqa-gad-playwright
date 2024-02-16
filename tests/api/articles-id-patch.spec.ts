import { test, APIResponse, expect } from '@playwright/test';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';

test.describe('PATCH articles/{id} endpoint tests', async () => {
  let setHeaders;
  const articles = `/api/articles`;
  const newTitle = 'How to start writing effective test cases in Gherkin';
  const newContent =
    'Start with a Feature Description:\nBegin each Gherkin feature file with a high-level description\n of the feature you are testing. This provides context for the scenarios that follow\n Example: \nFeature: User Authentication \nAs a user,\nI want to be able to log in to my account,\nSo that I can access my personalized content.';

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
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

    // Then
    const code = response.status();
    expect(code).toBe(HttpStatusCode.Ok);

    // When
    const body = await response.json();

    // Then
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

    // Then
    const code = response.status();
    expect(code).toBe(HttpStatusCode.NotFound);
  });
});
