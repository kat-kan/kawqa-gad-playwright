import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';
import { customDate } from 'test-data/shared/date.generator';

test.describe('POST comments tests', async () => {
  const comments: string = `/api/comments`;
  const commentBody: string = 'What a wonderful article!';
  const commentDate: string = customDate.pastDate;
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
        user_id: testUsers.regularUser.id,
        article_id: article_id,
        body: commentBody,
        date: commentDate,
      },
    });
    const responseBody = JSON.parse(await response.text());
    //Then
    expect(response.status()).toBe(HttpStatusCode.Created);
    expect(responseBody.user_id.toString()).toBe(
      testUsers.regularUser.id.toString(),
    );
    expect(responseBody.article_id).toEqual(article_id);
    expect(responseBody.body).toBe(commentBody);
    expect(responseBody.date).toBe(commentDate);
    expect(typeof responseBody.id === 'number').toBe(true);
  });

  test('Returns 400 - Bad request after sending comment with malformed JSON', async ({
    request,
  }) => {
    //Given
    // error: missing closing quotation mark
    const malformedJson: string = `{"user_id": "${testUsers.regularUser.id}", "article_id: "${article_id}", "body": "${commentBody}", "date": "${commentDate}"}`;
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

  test('Returns 422 - Date field is invalid! after posting a comment with future date', async ({
    request,
  }) => {
    //When
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        article_id: article_id,
        body: commentBody,
        date: customDate.futureDate,
      },
    });
    const responseBody = JSON.parse(await response.text());
    //Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
    expect(responseBody.error.message.toString()).toContain(
      'Date field is invalid',
    );
  });
});
