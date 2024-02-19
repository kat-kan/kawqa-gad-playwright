import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('POST comments tests', async () => {
  const comments: string = `/api/comments`;
  const commentBody: string = 'What a wonderful article!';
  const commentDate: string = '2024-06-30T15:44:31Z';
  const article_id: number = 1;
  let setHeaders: { [key: string]: string };

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test('Returns 201 - Created after creating comment', async ({ request }) => {
    //When
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
      data: {
        user_id: Number(testUsers.regularUser.id),
        article_id: article_id,
        body: commentBody,
        date: commentDate,
      },
    });
    const responseBody = JSON.parse(await response.text());
    //Then
    expect(response.status()).toBe(HttpStatusCode.Created);
    expect(responseBody.user_id).toEqual(testUsers.regularUser.id);
    expect(responseBody.article_id).toBe(article_id);
    expect(responseBody.body).toBe(commentBody);
    expect(responseBody.date).toBe(commentDate);
    expect(responseBody.id).toBeTruthy();
  });

  test('Returns 400 - Bad request after sending comment with malformed JSON', async ({
    request,
  }) => {
    //Given
    const malformedJson: string = `{
      user_id: testUsers.regularUser.id,
      article_id: "article_id,  
      body: commentBody,
      date: commentDate,
  }`;
    //When
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
      data: malformedJson,
    });
    //Then
    expect(response.status()).toBe(HttpStatusCode.BadRequest);
  });

  test('Returns 422 - Invalid comment supplied after sending comment without body', async ({
    request,
  }) => {
    //When
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        article_id: article_id,
        date: commentDate,
      },
    });
    //Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });
});
