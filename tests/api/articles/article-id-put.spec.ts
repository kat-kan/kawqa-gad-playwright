import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { enableFeatureFlag } from '@_src_helpers_api/feature-flags.helper';
import { APIResponse, expect, test } from '@playwright/test';
import {
  generateUniqueArticleId,
  takeMaxArticleId,
} from 'test-data/shared/article.generator';
import { customDate } from 'test-data/shared/date.generator';

test.describe('PUT articles/{id} endpoint tests', async () => {
  const articles = `/api/articles`;
  const randomNumber = Math.floor(Math.random() * (2000 - 1001 + 1)) + 1001;
  const newTitle = 'How to start writing API tests?';
  const newTitle2 = 'How to start writing API tests?' + randomNumber;
  const newTitle3 = 'How to start writing good API tests?' + randomNumber;
  const newTitle4 = 'How to start writing the best API tests?' + randomNumber;
  const oldTitle = 'The difference between Scrum and Kanban';
  const newContent = 'Join KawQA z automatu';
  const articleDate: string = customDate.pastDate;
  const articleImage: string =
    'src\\test-data\\images\\Roasted_coffee_beans.jpg';
  let setHeaders: { [key: string]: string };

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test('Returns 200 OK status code when updating article', async ({
    request,
  }) => {
    //When
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
    //Then
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
    //Given
    const uniqueArticleId = await generateUniqueArticleId(request);
    //When
    const response: APIResponse = await request.put(
      `${articles}/${uniqueArticleId}`,
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
    //Then
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

  test.describe.configure({ mode: 'serial' });
  test.describe('Creating two articles with the same non-existent ID', async () => {
    const articleData = {
      user_id: testUsers.regularUser.id,
      title: newTitle3,
      body: newContent,
      date: articleDate,
      image: articleImage,
    };

    test('Returns two 201 status codes when ID is large enough', async ({
      request,
    }) => {
      // Given
      let response: APIResponse;
      const uniqueArticleId = await generateUniqueArticleId(request);
      const maxArticleId = await takeMaxArticleId(request);

      for (let index = 1; index <= 2; index++) {
        // When
        response = await request.put(`${articles}/${uniqueArticleId}`, {
          headers: setHeaders,
          data: articleData,
        });

        // Then the new article is created
        const responseBody = JSON.parse(await response.text());
        expect.soft(response.status()).toBe(HttpStatusCode.Created);
        // console.log(responseBody.id, uniqueArticleId, maxArticleId + index);
        expect.soft(responseBody.id).toEqual(maxArticleId + index);
      }
    });

    test('Returns 201 and 200 status codes when ID = max(ID) + 1', async ({
      request,
    }) => {
      let response: APIResponse;
      // Given
      const uniqueArticleId = (await takeMaxArticleId(request)) + 1;

      // When
      response = await request.put(`${articles}/${uniqueArticleId}`, {
        headers: setHeaders,
        data: articleData,
      });
      let responseBody;
      //   console.log(uniqueArticleId);
      responseBody = JSON.parse(await response.text());
      //   console.log(responseBody);
      // Then new article is created
      expect.soft(response.status()).toBe(HttpStatusCode.Created);
      expect.soft(responseBody.id).toEqual(uniqueArticleId);

      // When
      response = await request.put(`${articles}/${uniqueArticleId}`, {
        headers: setHeaders,
        data: articleData,
      });
      //   console.log(uniqueArticleId);
      responseBody = JSON.parse(await response.text());
      //   console.log(responseBody);
      // Then the newly created article is updated
      expect.soft(response.status()).toBe(HttpStatusCode.Ok);
      expect.soft(responseBody.id).toEqual(uniqueArticleId);
    });
  });

  test('Returns 400 Bad Request after sending malformed JSON', async ({
    request,
  }) => {
    //Given
    // error: missing closing quotation mark
    const malformedJson: string = `{"user_id": "${testUsers.regularUser.id}", "title: "${newTitle4}", "body": "${newContent}", "date": "${articleDate}", "image": "src\\\\test-data\\\\images\\\\Roasted_coffee_beans.jpg"}`;
    //When
    const response: APIResponse = await request.put(articles, {
      headers: setHeaders,
      data: malformedJson,
    });
    //Then
    expect(response.status()).toBe(HttpStatusCode.BadRequest);
  });

  test("Returns 401 Unauthorized when updating another user's article", async ({
    request,
  }) => {
    //When
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
    //Then
    expect.soft(response.status()).toBe(HttpStatusCode.Unauthorized);
  });

  test('Returns 422 Unprocessable Entity after updating article with wrong date format', async ({
    request,
  }) => {
    //When
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
    //Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });

  test('Returns 422 Unprocessable Entity after updating article with empty body', async ({
    request,
  }) => {
    //When
    const response: APIResponse = await request.put(articles, {
      headers: setHeaders,
      data: {},
    });
    //Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });

  test('Returns 200 OK status code when updating the article with the title equal to another article title', async ({
    request,
  }) => {
    //When
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
    //Then
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
      await enableFeatureFlag(request, 'feature_validate_article_title', true);
    });

    test('Returns 200 OK status code when updating article', async ({
      request,
    }) => {
      //When
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
      //Then
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
      //When
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
      //Then
      const responseBody = JSON.parse(await response.text());

      expect.soft(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
      expect
        .soft(responseBody.error.message)
        .toBe('Field "title" is not unique!');
    });

    test('Returns 201 Created status code when creating article using PUT', async ({
      request,
    }) => {
      //Given
      const uniqueArticleId = await generateUniqueArticleId(request);
      //When
      const response: APIResponse = await request.put(
        `${articles}/${uniqueArticleId}`,
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
      //Then
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
      await enableFeatureFlag(request, 'feature_validate_article_title', false);
    });
  });
});
