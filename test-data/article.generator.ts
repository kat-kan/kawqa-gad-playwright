import { faker } from '@faker-js/faker/locale/en';
import { APIRequestContext, APIResponse } from '@playwright/test';

export async function generateUniqueArticleTitle(
  request: APIRequestContext,
): Promise<string> {
  const getAllArticles: APIResponse = await request.get(`/api/articles`, {});
  const articlesJson = await getAllArticles.json();
  const articleTitleList: string[] = [];
  for (const articleNumber in articlesJson) {
    articleTitleList.push(articlesJson[articleNumber].title);
  }
  let checker: boolean = true;
  let uniqueArticleTitle: string;

  while (checker == true) {
    uniqueArticleTitle = faker.book.title();
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!articleTitleList.includes(uniqueArticleTitle)) {
      checker = false;
    }
  }
  return uniqueArticleTitle;
}

export async function getExistingArticleTitle(
  request: APIRequestContext,
): Promise<string> {
  const getAllArticles: APIResponse = await request.get(`/api/articles`, {});
  const articlesJson = await getAllArticles.json();
  const existingArticleTitle: string = articlesJson[1].title;
  return existingArticleTitle;
}
