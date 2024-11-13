import { APIRequestContext, APIResponse } from '@playwright/test';

// generate unique article ID
export async function generateUniqueArticleId(
  request: APIRequestContext,
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

// function to get articles
export async function generateArticlesJSON(
  request: APIRequestContext,
): Promise<{ id: number; title: string }[]> {
  const getAllArticles: APIResponse = await request.get(`/api/articles`);
  const articlesJSON = await getAllArticles.json();
  return articlesJSON;
}
