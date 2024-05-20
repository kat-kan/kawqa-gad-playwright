import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, request, test } from '@playwright/test';
import { customDate } from 'test-data/shared/date.generator';

test.describe('PATCH comments/{id} endpoint tests', async () => {
  const comments: string = `/api/comments`;
  let setHeadersForRegularUser;
  let setNewCommentId;
  const newComment = 'I changed my mind';

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
    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
    const body = await response.json();
    expect(body.body).toBe(newComment);
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
