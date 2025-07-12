import { ArticleData } from '@_src_api/interfaces/article-data.interface';
import { ArticlesRequest } from '@_src_api/requests/articles.request';
import { faker } from '@faker-js/faker/locale/en';
import { APIResponse, expect } from '@playwright/test';

// generate unique article ID
export async function generateUniqueArticleId(
  request: ArticlesRequest,
  minRange: number = 1001,
  maxRange: number = 2000,
): Promise<number> {
  // get list of all article IDs
  const articlesJSON = await generateArticlesJSON(request);
  const articleIdList: number[] = articlesJSON.map(
    (article: { id: number }) => article.id,
  );

  // generate unique ID
  let isUnique: boolean = false;
  let uniqueArticleId: number;

  while (!isUnique) {
    uniqueArticleId =
      Math.floor(Math.random() * (maxRange - minRange + 1)) + minRange;
    // id uniqueness check
    if (!articleIdList.includes(uniqueArticleId)) {
      isUnique = true;
    }
  }
  return uniqueArticleId;
}

export async function generateUniqueArticleTitle(
  request: ArticlesRequest,
): Promise<string> {
  // get list of all article titles
  const articlesJSON = await generateArticlesJSON(request);
  const articleTitleList = new Set(
    articlesJSON.map((article: { title: string }) => article.title),
  );

  // ensure that the title generated using faker is not equal to any existing article title
  let uniqueArticleTitle: string;
  do {
    uniqueArticleTitle = faker.lorem.sentence();
  } while (articleTitleList.has(uniqueArticleTitle));

  return uniqueArticleTitle;
}

export async function getExistingArticleTitle(
  request: ArticlesRequest,
): Promise<string> {
  const articlesJSON = await generateArticlesJSON(request);
  const firstArticleTitle: string = articlesJSON[0].title;
  return firstArticleTitle;
}

// function to get articles
export async function generateArticlesJSON(
  request: ArticlesRequest,
): Promise<{ id: number; title: string }[]> {
  const getAllArticles: APIResponse = await request.get();
  const articlesJSON = await getAllArticles.json();
  return articlesJSON;
}

export async function createNewArticle(
  request: ArticlesRequest,
  data: ArticleData,
): Promise<number> {
  const response: APIResponse = await request.post(data);
  const responseBody = JSON.parse(await response.text());
  const getResponse: APIResponse = await request.getOne(responseBody.id); // TODO nic to nie daje, do wywalenia
  const getResponseBody = JSON.parse(await getResponse.text());
  expect.soft(responseBody.title).toBe(data.title);
  expect.soft(responseBody.body).toBe(data.body);
  expect.soft(responseBody.date).toBe(data.date);
  expect.soft(responseBody.image).toBe(data.image);
  return getResponseBody.id;
}
