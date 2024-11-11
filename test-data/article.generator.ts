import { faker } from '@faker-js/faker/locale/en';
import { APIRequestContext, APIResponse } from '@playwright/test';

export async function generateUniqueArticleTitle(
  request: APIRequestContext,
): Promise<string> {
  // get list of all article titles
  const articlesJSON = await generateArticlesJSON(request);
  const articleTitleList: string[] = [];
  for (const articleNumber in articlesJSON) {
    articleTitleList.push(articlesJSON[articleNumber].title);
  }

  // ensure that the title generated using faker is not equal to any existing article title
  let isUnique: boolean = false;

  let uniqueArticleTitle: string;
  while (isUnique == false) {
    uniqueArticleTitle = faker.lorem.sentence();
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!articleTitleList.includes(uniqueArticleTitle)) {
      isUnique = true;
    }
  }
  // TODO: add counter to break the loop after X iterations
  return uniqueArticleTitle;
}

export async function getExistingArticleTitle(
  request: APIRequestContext,
): Promise<string> {
  const articlesJSON = await generateArticlesJSON(request);
  const firstArticleTitle: string = articlesJSON[0].title;
  return firstArticleTitle;
}

export async function generateArticlesJSON(
  request: APIRequestContext,
): Promise<object> {
  const getAllArticles: APIResponse = await request.get(`/api/articles`, {});
  const articlesJSON = await getAllArticles.json();
  return articlesJSON;
}
