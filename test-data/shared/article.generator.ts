import { getArticlesJSON } from './article.fetcher';
import { faker } from '@faker-js/faker/locale/en';
import { APIRequestContext } from '@playwright/test';

// generate unique article ID
export async function generateUniqueArticleId(
  request: APIRequestContext,
  minRange: number = 1001,
  maxRange: number = 2000,
): Promise<number> {
  // get list of all article IDs
  const articlesJSON = await getArticlesJSON(request);
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
  request: APIRequestContext,
): Promise<string> {
  // get list of all article titles
  const articlesJSON = await getArticlesJSON(request);
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
