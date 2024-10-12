import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';
import { customDate } from 'test-data/shared/date.generator';

test.describe('PUT articles/{id} endpoint tests', async () => {
  const articles = `/api/articles`;
  const randomNumber = Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
  const newTitle = 'How to start writing API tests?';
  const newTitle2 = 'How to start writing API tests?' + randomNumber;
  const newTitle3 = 'How to start writing good API tests?' + randomNumber;
  const newTitle4 = 'How to start writing the best API tests?' + randomNumber;
  const oldTitle = 'The difference between Scrum and Kanban';
  const newContent = 'Join KawQA z automatu';
  const articleDate: string = customDate.pastDate;
  const articleImage: string =
    'src\\test-data\\images\\Roasted_coffee_beans.jpg';
  const articleId: number = randomNumber;
  const articleId2: number = randomNumber + 1;
  const features: string = `/api/config/features`;
  let setHeaders: { [key: string]: string };

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test('Returns 200 OK status code when updating article', async ({
    request,
  }) => {
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

  test('Returns 201 Created status code when creating article using PUT', async ({
    request,
  }) => {
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
    const malformedJson: string = `{"user_id": "${testUsers.regularUser.id}", "title: "${newTitle4}", "body": "${newContent}", "date": "${articleDate}", "image": "src\\\\test-data\\\\images\\\\Roasted_coffee_beans.jpg"}`;

    const response: APIResponse = await request.put(articles, {
      headers: setHeaders,
      data: malformedJson,
    });

    expect(response.status()).toBe(HttpStatusCode.BadRequest);
  });

  test("Returns 401 Unauthorized when updating another user's article", async ({
    request,
  }) => {
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

    expect.soft(response.status()).toBe(HttpStatusCode.Unauthorized);
  });

  test('Returns 422 Unprocessable Entity after updating article with wrong date format', async ({
    request,
  }) => {
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

    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });

  test('Returns 422 Unprocessable Entity after updating article with empty body', async ({
    request,
  }) => {
    const response: APIResponse = await request.put(articles, {
      headers: setHeaders,
      data: {},
    });

    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });

  test('Returns 200 OK status code when updating the article with the title equal to another article title', async ({
    request,
  }) => {
    const response: APIResponse = await request.put(`${articles}/1`, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: oldTitle,
        body: newContent,
        date: articleDate,
        image: articleImage,
      },
    });
    const responseBody = JSON.parse(await response.text());

    expect.soft(response.status()).toBe(HttpStatusCode.Ok);
    expect
      .soft(responseBody.user_id.toString())
      .toEqual(testUsers.regularUser.id.toString());
    expect.soft(responseBody.title).toBe(oldTitle);
    expect.soft(responseBody.body).toBe(newContent);
    expect.soft(responseBody.date).toBe(articleDate);
    expect.soft(responseBody.image).toBe(articleImage);
    expect.soft(typeof responseBody.id === 'number').toBe(true);
  });

  test.describe('PUT articles/{id} endpoint tests with enabled feature_validate_article_title', async () => {
    test.beforeAll(async ({ request }) => {
      const response: APIResponse = await request.post(features, {
        headers: setHeaders,
        data: {
          feature_validate_article_title: true,
        },
      });
      expect(response.status()).toBe(HttpStatusCode.Ok);
    });

    test('Returns 200 OK status code when updating article', async ({
      request,
    }) => {
      const response: APIResponse = await request.put(`${articles}/1`, {
        headers: setHeaders,
        data: {
          user_id: testUsers.regularUser.id,
          title: newTitle4,
          body: newContent,
          date: articleDate,
          image: articleImage,
        },
      });
      const responseBody = JSON.parse(await response.text());

      expect.soft(response.status()).toBe(HttpStatusCode.Ok);
      expect
        .soft(responseBody.user_id.toString())
        .toEqual(testUsers.regularUser.id.toString());
      expect.soft(responseBody.title).toBe(newTitle4);
      expect.soft(responseBody.body).toBe(newContent);
      expect.soft(responseBody.date).toBe(articleDate);
      expect.soft(responseBody.image).toBe(articleImage);
      expect.soft(typeof responseBody.id === 'number').toBe(true);
    });

    test('Returns 422 status code when updating the article with the title equal to another article title', async ({
      request,
    }) => {
      const response: APIResponse = await request.put(`${articles}/1`, {
        headers: setHeaders,
        data: {
          user_id: testUsers.regularUser.id,
          title: oldTitle,
          body: newContent,
          date: articleDate,
          image: articleImage,
        },
      });
      const responseBody = JSON.parse(await response.text());

      expect.soft(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
      expect
        .soft(responseBody.error.message)
        .toBe('Field "title" is not unique!');
    });

    test('Returns 201 Created status code when creating article using PUT', async ({
      request,
    }) => {
      const response: APIResponse = await request.put(
        `${articles}/${articleId2}`,
        {
          headers: setHeaders,
          data: {
            user_id: testUsers.regularUser.id,
            title: newTitle3,
            body: newContent,
            date: articleDate,
            image: articleImage,
          },
        },
      );
      const responseBody = JSON.parse(await response.text());

      expect.soft(response.status()).toBe(HttpStatusCode.Created);
      expect
        .soft(responseBody.user_id.toString())
        .toEqual(testUsers.regularUser.id.toString());
      expect.soft(responseBody.title).toBe(newTitle3);
      expect.soft(responseBody.body).toBe(newContent);
      expect.soft(responseBody.date).toBe(articleDate);
      expect.soft(responseBody.image).toBe(articleImage);
      expect.soft(typeof responseBody.id === 'number').toBe(true);
    });

    test.afterAll(async ({ request }) => {
      const response: APIResponse = await request.post(features, {
        headers: setHeaders,
        data: {
          feature_validate_article_title: false,
        },
      });
      expect(response.status()).toBe(HttpStatusCode.Ok);
    });
  });
});
