import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { FeatureFlags } from '@_src_api/enums/feature-flags.enum';
import { ArticleData } from '@_src_api/interfaces/article-data.interface';
import { ArticlesRequest } from '@_src_api/requests/articles.request';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { enableFeatureFlag } from '@_src_helpers_api/feature-flags.helper';
import { APIResponse, expect } from '@playwright/test';
import { requestObjectTest as test } from 'src/fixtures/api/request-object.fixture';
import { testUsers } from 'src/shared/fixtures/auth';
import { generateUniqueArticleId } from 'test-data/shared/article.generator';
import { customDate } from 'test-data/shared/date.generator';

test.describe('PUT articles/{id} endpoint tests', async () => {
  let newTitle: string;
  let setHeaders: { [key: string]: string };
  const articles = `/api/articles`;
  const oldTitle = 'The difference between Scrum and Kanban';
  const newContent = 'Join KawQA z automatu';
  const articleDate: string = customDate.pastDate;
  const articleImage: string =
    'src\\test-data\\images\\Roasted_coffee_beans.jpg';
  let properArticleData: ArticleData;

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test.beforeEach(async ({ articlesRequest }) => {
    newTitle =
      'How to start writing API tests?' + articlesRequest.getRandomNumber();
    properArticleData = {
      user_id: testUsers.regularUser.id,
      title: newTitle,
      body: newContent,
      date: articleDate,
      image: articleImage,
    };
  });

  test('Returns 200 OK status code when updating article', async ({
    articlesRequestLogged,
  }) => {
    const existingArticleId = 1;
    //When
    const response: APIResponse = await articlesRequestLogged.put(
      existingArticleId,
      properArticleData,
    );

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
    articlesRequest,
    articlesRequestLogged,
  }) => {
    //Given
    const uniqueArticleId = await generateUniqueArticleId(articlesRequest);
    //When
    const response: APIResponse = await articlesRequestLogged.put(
      uniqueArticleId,
      properArticleData,
    );

    const responseBody = JSON.parse(await response.text());
    //Then
    expect(response.status()).toBe(HttpStatusCode.Created);
    expect
      .soft(responseBody.user_id.toString())
      .toEqual(testUsers.regularUser.id.toString());
    expect.soft(responseBody.title).toBe(newTitle);
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
    const malformedJson: string = `{"user_id": "${testUsers.regularUser.id}", "title: "${newTitle}", "body": "${newContent}", "date": "${articleDate}", "image": "src\\\\test-data\\\\images\\\\Roasted_coffee_beans.jpg"}`;
    //When
    const response: APIResponse = await request.put(articles, {
      headers: setHeaders,
      data: malformedJson,
    });
    //Then
    expect(response.status()).toBe(HttpStatusCode.BadRequest);
  });

  test("Returns 401 Unauthorized when updating another user's article", async ({
    articlesRequestLogged,
  }) => {
    //Given
    const otherUserArticleId = 2;

    //When
    const response: APIResponse = await articlesRequestLogged.put(
      otherUserArticleId,
      properArticleData,
    );

    //Then
    expect(response.status()).toBe(HttpStatusCode.Unauthorized);
  });

  test('Returns 422 Unprocessable Entity after updating article with wrong date format', async ({
    articlesRequestLogged,
  }) => {
    //Given
    const existingArticleId = 1;
    const articleDataWrongDate = properArticleData;
    articleDataWrongDate.date = '${articleDate+1}';
    //When
    const response: APIResponse = await articlesRequestLogged.put(
      existingArticleId,
      articleDataWrongDate,
    );

    //Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });

  test('Returns 422 Unprocessable Entity after updating article with empty body', async ({
    request,
  }) => {
    //Given
    const existingArticleId = 1;
    //When
    const response: APIResponse = await request.put(
      `${articles}/${existingArticleId}`,
      {
        headers: setHeaders,
        data: {},
      },
    );
    //Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });

  test.fixme(
    'Returns 200 OK status code when updating the article with the title equal to another article title',
    async ({ articlesRequestLogged }) => {
      //Given
      const existingArticleId = 1;
      const articleDataExistingTitle = properArticleData;
      articleDataExistingTitle.title = oldTitle;
      //When
      const response: APIResponse = await articlesRequestLogged.put(
        existingArticleId,
        articleDataExistingTitle,
      );

      const responseBody = JSON.parse(await response.text());
      console.log(responseBody);
      //Then
      expect(response.status()).toBe(HttpStatusCode.Ok);
      expect
        .soft(responseBody.user_id.toString())
        .toEqual(testUsers.regularUser.id.toString());
      expect.soft(responseBody.title).toBe(oldTitle);
      expect.soft(responseBody.body).toBe(newContent);
      expect.soft(responseBody.date).toBe(articleDate);
      expect.soft(responseBody.image).toBe(articleImage);
      expect.soft(typeof responseBody.id === 'number').toBe(true);
    },
  );

  test.describe('PUT articles/{id} endpoint tests with enabled feature_validate_article_title', async () => {
    test.beforeAll(async ({ request }) => {
      await enableFeatureFlag(request, FeatureFlags.ValidateArticleTitle, true);
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
      const uniqueArticleId = await generateUniqueArticleId(request);
      //When
      const response: APIResponse = await request.put(
        `${articles}/${uniqueArticleId}`,
        {
          headers: setHeaders,
          data: {
            user_id: testUsers.regularUser.id,
            title: newTitle,
            body: newContent,
            date: articleDate,
            image: articleImage,
          },
        },
      );
      const responseBody = JSON.parse(await response.text());
      //Then
      expect(response.status()).toBe(HttpStatusCode.Created);
      expect
        .soft(responseBody.user_id.toString())
        .toEqual(testUsers.regularUser.id.toString());
      expect.soft(responseBody.title).toBe(newTitle);
      expect.soft(responseBody.body).toBe(newContent);
      expect.soft(responseBody.date).toBe(articleDate);
      expect.soft(responseBody.image).toBe(articleImage);
      expect.soft(typeof responseBody.id === 'number').toBe(true);
    });

    test.afterAll(async ({ request }) => {
      await enableFeatureFlag(
        request,
        FeatureFlags.ValidateArticleTitle,
        false,
      );
    });
  });
});
