import { faker } from '@faker-js/faker/locale/en';
import { APIRequestContext, APIResponse } from '@playwright/test';

export async function generateUniqueArticleTitle(
  request: APIRequestContext,
): Promise<string> {
  // get list of all article titles
  const articlesJSON = await generateArticlesJSON(request);
  const articleTitleList: string[] = articlesJSON.map(
    (article: { title: string }) => article.title,
  );

  // ensure that the title generated using faker is not equal to any existing article title
  let isUnique: boolean = false;

  let uniqueArticleTitle: string;
  while (!isUnique) {
    uniqueArticleTitle = faker.lorem.sentence();
    // eslint-disable-next-line playwright/no-conditional-in-test
    if (!articleTitleList.includes(uniqueArticleTitle)) {
      isUnique = true;
    }
  }
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
): Promise<{ id: number; title: string }[]> {
  const getAllArticles: APIResponse = await request.get(`/api/articles`);
  const articlesJSON = await getAllArticles.json();
  return articlesJSON;
}
