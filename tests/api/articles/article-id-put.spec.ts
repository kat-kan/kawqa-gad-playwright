import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { ArticleResponseBody } from '@_src_api/interfaces/article-response-body.interface';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { enableFeatureFlag } from '@_src_helpers_api/feature-flags.helper';
import { APIResponse, expect, test } from '@playwright/test';
import { testUsers } from 'src/shared/fixtures/auth';
import {
  getExistingArticleTitle,
  getMaxArticleId,
} from 'test-data/shared/article.fetcher';
import { generateUniqueArticleId } from 'test-data/shared/article.generator';
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
    expect(response.status()).toBe(HttpStatusCode.Ok);
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
    let response: APIResponse;
    const uniqueArticleId = await generateUniqueArticleId(request);
    //When
    await expect(async () => {
      response = await request.put(`${articles}/${uniqueArticleId}`, {
        headers: setHeaders,
        data: {
          user_id: testUsers.regularUser.id,
          title: newTitle2,
          body: newContent,
          date: articleDate,
          image: articleImage,
        },
      });
      //Then
      expect(response.status()).toBe(HttpStatusCode.Created);
    }).toPass({ timeout: 2_000 });

    const responseBody = JSON.parse(await response.text());
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
    expect(response.status()).toBe(HttpStatusCode.Unauthorized);
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
    //Given
    let response: APIResponse;

    //When
    const articleTitle = await getExistingArticleTitle(request, 2);
    const articleData = {
      user_id: testUsers.regularUser.id,
      title: articleTitle,
      body: newContent,
      date: articleDate,
      image: articleImage,
    };
    await expect(async () => {
      response = await request.put(`${articles}/1`, {
        headers: setHeaders,
        data: articleData,
      });
      //Then
      expect(response.status()).toBe(HttpStatusCode.Ok);
    }).toPass({ timeout: 2_000 });

    const responseBody = JSON.parse(await response.text());
    expect
      .soft(responseBody.user_id.toString())
      .toEqual(testUsers.regularUser.id.toString());
    expect.soft(responseBody.title).toBe(articleTitle);
    expect.soft(responseBody.body).toBe(newContent);
    expect.soft(responseBody.date).toBe(articleDate);
    expect.soft(responseBody.image).toBe(articleImage);
    expect.soft(typeof responseBody.id === 'number').toBe(true);
  });

  test.describe('PUT articles/{id} endpoint tests with enabled feature_validate_article_title @serial', async () => {
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
      expect(response.status()).toBe(HttpStatusCode.Ok);
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

      expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
      expect(responseBody.error.message).toBe('Field "title" is not unique!');
    });

    test('Returns 201 Created status code when creating article using PUT', async ({
      request,
    }) => {
      //Given
      let response: APIResponse;
      const uniqueArticleId = await generateUniqueArticleId(request);
      //When
      await expect(async () => {
        response = await request.put(`${articles}/${uniqueArticleId}`, {
          headers: setHeaders,
          data: {
            user_id: testUsers.regularUser.id,
            title: newTitle3,
            body: newContent,
            date: articleDate,
            image: articleImage,
          },
        });
        expect(response.status()).toBe(HttpStatusCode.Created);
      }).toPass({
        timeout: 2_000,
      });
      const responseBody = JSON.parse(await response.text());
      //Then
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

  test.describe('Creating two articles in a row with the same non-existent ID @serial', async () => {
    // The PUT method allows to create the article if the article_id doesn't indicate any existing article. The new article is created with ID = max(ID) of the existing articles + 1
    // Before GAD 2.7.10 two consecutive runs of the same PUT test to the same article endpoint generated different statuses (201 and 422, accordingly)
    // The current tests check if fix introduced in 2.7.10 is still working and PUT method works as designed in case of consecutive runs
    let response: APIResponse;
    let responseBody: ArticleResponseBody;
    const articleData = {
      user_id: testUsers.regularUser.id,
      title: newTitle3,
      body: newContent,
      date: articleDate,
      image: articleImage,
    };

    test('Returns two 201 status codes - two articles are created when ID is large enough', async ({
      request,
    }) => {
      // Given the uniqueArticleId is much bigger than max(ID) of the existing articles
      const uniqueArticleId = await generateUniqueArticleId(request);
      let maxArticleId: number;

      for (let index = 1; index <= 2; index++) {
        // When the PUT request is sent with large ID
        await expect(async () => {
          maxArticleId = await getMaxArticleId(request);
          response = await request.put(`${articles}/${uniqueArticleId}`, {
            headers: setHeaders,
            data: articleData,
          });
          expect(response.status()).toBe(HttpStatusCode.Created);
        }, 'Article should be properly created in the GAD database').toPass({
          timeout: 2_000,
        });

        // Then
        responseBody = JSON.parse(await response.text());
        expect(
          responseBody.id,
          `Article ID - expected: ${maxArticleId + 1}, received: ${
            responseBody.id
          }`,
        ).toEqual(maxArticleId + 1);
      }
    });

    test('Returns 201 and 200 status codes - the article is created and then updated when ID = max(ID) + 1', async ({
      request,
    }) => {
      // Given
      const uniqueArticleId = (await getMaxArticleId(request)) + 1;

      const expectedResponses = [
        {
          // When first PUT request is sent with the unique ID = max(ID) + 1
          // then the new article is created
          operation: 'create',
          expectedStatus: HttpStatusCode.Created,
          description: 'First request should create a new article',
        },
        {
          // When second PUT request is sent with the same unique ID
          // then the newly created article is updated
          operation: 'update',
          expectedStatus: HttpStatusCode.Ok,
          description: 'Second request should update the existing article',
        },
      ];

      for (const {
        operation,
        expectedStatus,
        description,
      } of expectedResponses) {
        // When
        await expect(async () => {
          response = await request.put(`${articles}/${uniqueArticleId}`, {
            headers: setHeaders,
            data: articleData,
          });
          expect(response.status(), description).toBe(expectedStatus);
        }, 'Article should be properly created in the GAD database').toPass({
          timeout: 2_000,
        });

        // Then
        responseBody = JSON.parse(await response.text());
        expect(
          responseBody.id,
          `ID of the ${operation}d article should be equal to the set article ID`,
        ).toEqual(uniqueArticleId);

        // Assert that the article is really present
        // To remove flakiness due to delay in creating an article in the DB
        await expect(async () => {
          const responseArticleCreated = await request.get(
            `${articles}/${uniqueArticleId}`,
          );
          const responseBodyArticleCreated = JSON.parse(
            await responseArticleCreated.text(),
          );
          expect(responseArticleCreated.status()).toBe(HttpStatusCode.Ok);
          expect(responseBodyArticleCreated.id).toEqual(uniqueArticleId);
        }, 'Article should be properly created in the GAD database').toPass({
          timeout: 2_000,
        });
      }
    });
  });
});
