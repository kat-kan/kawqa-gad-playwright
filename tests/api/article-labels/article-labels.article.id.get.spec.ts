import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('GET article labels tests', async () => {
  const articleLabels: string = `/api/article-labels/articles`;
  const features: string = `/api/config/features`;
  let setHeaders: { [key: string]: string };

  test.beforeAll(async ({ request }) => {
    setHeaders = await createHeaders();
    //enable feature: labels
    const response: APIResponse = await request.post(features, {
      headers: setHeaders,
      data: {
        feature_labels: true,
      },
    });
    expect(response.status()).toBe(HttpStatusCode.Ok);
  });

  test('Returns 200 OK after getting labels for existing article', async ({
    request,
  }) => {
    //Given
    const existingArticleId: number = 1;
    // When
    const response: APIResponse = await request.get(
      `${articleLabels}/${existingArticleId}`,
    );
    const body = await response.json();

    // Then
    expect.soft(response.status()).toBe(HttpStatusCode.Ok);
    expect.soft(typeof body.id === 'number').toBe(true);
    expect.soft(body.label_ids).toContain(1);
    expect.soft(body.article_id).toBe(existingArticleId);
  });

  test('Returns 404 Not Found after getting labels for non-existing article', async ({
    request,
  }) => {
    //Given
    const nonExistingArticleId: number = 500000000;
    // When
    const response: APIResponse = await request.get(
      `${articleLabels}/${nonExistingArticleId}`,
    );

    // Then
    expect.soft(response.status()).toBe(HttpStatusCode.NotFound);
  });

  test.afterAll(async ({ request }) => {
    //disable feature: labels
    const response: APIResponse = await request.post(features, {
      headers: setHeaders,
      data: {
        feature_labels: false,
      },
    });
    expect(response.status()).toBe(HttpStatusCode.Ok);
  });
});
