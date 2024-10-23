import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import {
  createHeaders,
  createInvalidHeaders,
} from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, request, test } from '@playwright/test';
import { customDate } from 'test-data/shared/date.generator';

test.describe('PATCH comments/{id} endpoint tests', async () => {
  const comments: string = `/api/comments`;
  let setHeadersForRegularUser: { [key: string]: string };
  let setNewCommentId: number;
  const newComment: string = 'I changed my mind';

  test.beforeAll(async () => {
    setHeadersForRegularUser = await createHeaders('regular');
    setNewCommentId = await createNewComment(setHeadersForRegularUser, 1);
  });

  test('Returns 200 OK status code when updating comment', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.patch(
      `${comments}/${setNewCommentId}`,
      {
        headers: setHeadersForRegularUser,
        data: {
          article_id: 1,
          user_id: testUsers.regularUser.id,
          body: newComment,
        },
      },
    );
    const body = await response.json();
    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
    expect(body.body).toBe(newComment);
  });

  test('Returns 404 Not Found status code when trying to update a non-existing comment', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.patch(`${comments}/0`, {
      headers: setHeadersForRegularUser,
      data: {
        article_id: 1,
        user_id: testUsers.regularUser.id,
        body: newComment,
      },
    });
    // Then
    expect(response.status()).toBe(HttpStatusCode.NotFound);
  });

  test('Returns 401 Unauthorized status code when trying to update an existing comments with random text as token', async ({
    request,
  }) => {
    // Given
    const expectedErrorMessage = 'Access token not provided!';
    const setInvalidHeaders = await createInvalidHeaders();
    // When
    const response: APIResponse = await request.patch(
      `${comments}/${setNewCommentId}`,
      {
        headers: setInvalidHeaders,
        data: {
          article_id: 1,
          user_id: testUsers.regularUser.id,
          body: newComment,
        },
      },
    );
    const body = await response.json();
    // Then
    expect(response.status()).toBe(HttpStatusCode.Unauthorized);
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test('Returns 401 Unauthorized status code when trying to update comment added by different user', async ({
    request,
  }) => {
    // Given
    const expectedErrorMessage = 'Access token for given user is invalid!';
    // When
    const response: APIResponse = await request.patch(`${comments}/1`, {
      headers: setHeadersForRegularUser,
      data: {
        article_id: 1,
        user_id: testUsers.regularUser.id,
        body: newComment,
      },
    });
    const body = await response.json();
    // Then
    expect(response.status()).toBe(HttpStatusCode.Unauthorized);
    expect(body.error.message).toBe(expectedErrorMessage);
  });

  test('Returns 400 Bad Request status code when trying to update existing comments with malformed JSON', async ({
    request,
  }) => {
    // Given
    // error: missing closing quotation mark
    const malformedJson: string = `{"article_id": 1, "user_id: "${testUsers.regularUser.id}", "body": "${newComment}"}`;
    // When
    const response: APIResponse = await request.patch(
      `${comments}/${setNewCommentId}`,
      {
        headers: setHeadersForRegularUser,
        data: malformedJson,
      },
    );
    // Then
    expect(response.status()).toBe(HttpStatusCode.BadRequest);
  });

  test('Returns 422 Unprocessable Entity status code when trying to update an existing comments with a new one with wrong date format', async ({
    request,
  }) => {
    // Given
    const expectedErrorMessage =
      'One of field is invalid (empty, invalid or too long) or there are some additional fields: Field validation: "date" has invalid format!';
    // When
    const response: APIResponse = await request.patch(
      `${comments}/${setNewCommentId}`,
      {
        headers: setHeadersForRegularUser,
        data: {
          article_id: 1,
          user_id: testUsers.regularUser.id,
          body: newComment,
          date: '20424-04-20T11:24:52.370Z',
        },
      },
    );
    const body = await response.json();
    // Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
    expect(body.error.message).toBe(expectedErrorMessage);
  });
});

async function createNewComment(
  setHeadersForRegularUser,
  article_id,
): Promise<number> {
  const commentDate: string = customDate.pastDate;
  const newCommentRequest = await request.newContext();
  const response: APIResponse = await newCommentRequest.post('/api/comments', {
    headers: setHeadersForRegularUser,
    data: {
      user_id: testUsers.regularUser.id,
      article_id: article_id,
      body: 'test',
      date: commentDate,
    },
  });
  const responseBody = JSON.parse(await response.text());

  return responseBody.id;
}
