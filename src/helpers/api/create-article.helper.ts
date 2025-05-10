import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { ArticleData } from '@_src_api/interfaces/article-data.interface';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export async function createArticle(
  articleData: ArticleData,
  request: APIRequestContext,
  headers: { [key: string]: string },
): Promise<number> {
  let createResponse: APIResponse;
  let getResponse: APIResponse;
  const articles = `/api/articles`;

  // Create article
  await expect(async () => {
    createResponse = await request.post(articles, {
      headers: headers,
      data: articleData,
    });
    expect(createResponse.status()).toBe(HttpStatusCode.Created);
  }).toPass({ timeout: 2_000 });

  const createdArticle = await createResponse.json();
  const createdArticleId = createdArticle.id;

  // Acc. to the GAD authors, there is a delay between POST request and actual creating the asset
  // Check if the article is created in the DB
  await expect(async () => {
    getResponse = await request.get(`${articles}/${createdArticleId}`);
    expect(getResponse.status()).toBe(HttpStatusCode.Ok);
  }).toPass({ timeout: 2_000 });

  return createdArticleId;
}
