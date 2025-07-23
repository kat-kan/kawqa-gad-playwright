import { ArticleData } from '@_src_api/interfaces/article.interface';
import { expect } from '@playwright/test';

export function expectResponseEqualsPayload(
  responseBody: ArticleData,
  payload: ArticleData,
): void {
  expect
    .soft(responseBody.user_id.toString())
    .toEqual(payload.user_id.toString());
  expect.soft(responseBody.title).toBe(payload.title);
  expect.soft(responseBody.body).toBe(payload.body);
  expect.soft(responseBody.date).toBe(payload.date);
  expect.soft(responseBody.image).toBe(payload.image);
}
