import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('PUT articles/{id} endpoint tests', async () => {
  const articles = `/api/articles`;
  const newTitle =
    'How to start writing API tests? ' +
    (Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
  const newContent = 'Join KawQA z automatu';
  const articleDate: string = '2024-07-14T15:44:31Z';
  const articleImage: string =
    'src\\test-data\\images\\Roasted_coffee_beans.jpg';
  const articleId: number = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
  let setHeaders: { [key: string]: string };

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test('Returns 200 OK status code when updating article', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.put(`${articles}/1`, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: newTitle,
        body: newContent,
        date: articleDate,
        image: articleImage,
      },
    });
    const responseBody = JSON.parse(await response.text());

    // Then
    expect.soft(response.status()).toBe(HttpStatusCode.Ok);
    expect
      .soft(responseBody.user_id.toString())
      .toEqual(testUsers.regularUser.id.toString());
    expect.soft(responseBody.title).toBe(newTitle);
    expect.soft(responseBody.body).toBe(newContent);
    expect.soft(responseBody.date).toBe(articleDate);
    expect.soft(responseBody.image).toBe(articleImage);
    expect.soft(typeof responseBody.id === 'number').toBe(true);
  });

  test('Returns 201 OK status code when updating article', async ({
    request,
  }) => {
    // When
    const newTitle2 =
      'How to start writing API tests? ' +
      (Math.floor(Math.random() * (1000 - 100 + 1)) + 100);
    const response: APIResponse = await request.put(
      `${articles}/${articleId}`,
      {
        headers: setHeaders,
        data: {
          user_id: testUsers.regularUser.id,
          title: newTitle2,
          body: newContent,
          date: articleDate,
          image: articleImage,
        },
      },
    );
    const responseBody = JSON.parse(await response.text());
    // Then
    expect.soft(response.status()).toBe(HttpStatusCode.Created);
    expect
      .soft(responseBody.user_id.toString())
      .toEqual(testUsers.regularUser.id.toString());
    expect.soft(responseBody.title).toBe(newTitle2);
    expect.soft(responseBody.body).toBe(newContent);
    expect.soft(responseBody.date).toBe(articleDate);
    expect.soft(responseBody.image).toBe(articleImage);
    expect.soft(typeof responseBody.id === 'number').toBe(true);
  });

  test('Returns 400 Bad Request after sending malformed JSON', async ({
    request,
  }) => {
    // Given
    const malformedJson: string = `{
        "user_id": "${testUsers.regularUser.id}",
        "title: ${newTitle},  // error: missing closing quotation mark
        "body": "${newContent}",
        "date": "${articleDate}",
        "image": "${articleImage}"
    }`;
    // When
    const response: APIResponse = await request.put(articles, {
      headers: setHeaders,
      data: malformedJson,
    });
    // Then
    expect(response.status()).toBe(HttpStatusCode.BadRequest);
  });

  test("Returns 401 Unauthorized when updating another user's article", async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.put(`${articles}/2`, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: newTitle,
        body: newContent,
        date: articleDate,
        image: articleImage,
      },
    });
    // Then
    expect.soft(response.status()).toBe(HttpStatusCode.Unauthorized);
  });

  test('Returns 422 Unprocessable content after updating  article with wrong date format', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.put(articles, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: newTitle,
        body: newContent,
        date: '${articleDate+1}',
        image: articleImage,
      },
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });
});
