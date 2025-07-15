import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { FeatureFlags } from '@_src_api/enums/feature-flags.enum';
import { ArticleData } from '@_src_api/interfaces/article-data.interface';
import { enableFeatureFlag } from '@_src_helpers_api/feature-flags.helper';
import { APIResponse, expect } from '@playwright/test';
import { requestObjectTest as test } from 'src/fixtures/api/request-object.fixture';
import { testUsers } from 'src/shared/fixtures/auth';
import {
  createNewArticle,
  generateUniqueArticleId,
} from 'test-data/shared/article.generator';
import { customDate } from 'test-data/shared/date.generator';

test.describe('PUT articles/{id} endpoint tests with enabled feature_validate_article_title @validate-article-title @flag', async () => {
  let newTitle: string;
  const oldTitle = 'The difference between Scrum and Kanban';
  const newContent = 'Join KawQA z automatu';
  const articleDate: string = customDate.pastDate;
  const articleImage: string =
    'src\\test-data\\images\\Roasted_coffee_beans.jpg';
  let properArticleData: ArticleData;

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

  test.beforeAll(async ({ request }) => {
    await enableFeatureFlag(request, FeatureFlags.ValidateArticleTitle, true);
  });

  test('Returns 200 OK status code when updating article', async ({
    articlesRequestLogged,
  }) => {
    //Given
    const newArticleId = await createNewArticle(
      articlesRequestLogged,
      properArticleData,
    );

    //When
    const response: APIResponse = await articlesRequestLogged.put(
      newArticleId,
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

  test('Returns 422 status code when updating the article with the title equal to another article title', async ({
    articlesRequestLogged,
  }) => {
    //Given
    const newArticleId = await createNewArticle(
      articlesRequestLogged,
      properArticleData,
    );
    const articleDataExistingTitle = properArticleData;
    articleDataExistingTitle.title = oldTitle;

    //When
    const response: APIResponse = await articlesRequestLogged.put(
      newArticleId,
      articleDataExistingTitle,
    );
    const responseBody = JSON.parse(await response.text());

    //Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
    expect(responseBody.error.message).toBe('Field "title" is not unique!');
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

  test.afterAll(async ({ request }) => {
    await enableFeatureFlag(request, FeatureFlags.ValidateArticleTitle, false);
  });
});
