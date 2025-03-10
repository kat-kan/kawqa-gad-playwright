import { APIRequestContext, APIResponse } from '@playwright/test';

export async function getMaxArticleId(
  request: APIRequestContext,
): Promise<number> {
  // get list of all article IDs
  const articlesJSON = await getArticlesJSON(request);
  const articleIdList: number[] = articlesJSON.map(
    (article: { id: number }) => article.id,
  );

  // return maximum ID
  return Math.max(...articleIdList);
}

export async function getExistingArticleTitle(
  request: APIRequestContext,
): Promise<string> {
  const articlesJSON = await getArticlesJSON(request);
  const firstArticleTitle: string = articlesJSON[0].title;
  return firstArticleTitle;
}

// function to get articles
export async function getArticlesJSON(
  request: APIRequestContext,
): Promise<{ id: number; title: string }[]> {
  const getAllArticles: APIResponse = await request.get(`/api/articles`);
  const articlesJSON = await getAllArticles.json();
  return articlesJSON;
}
