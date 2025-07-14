import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { FeatureFlags } from '@_src_api/enums/feature-flags.enum';
import { enableFeatureFlag } from '@_src_helpers_api/feature-flags.helper';
import { APIResponse, expect, test } from '@playwright/test';

test.describe.configure({ mode: 'serial' });
test.describe('GET article labels tests', async () => {
  const articleLabels: string = `/api/article-labels/articles`;

  test.beforeAll(async ({ request }) => {
    await enableFeatureFlag(request, FeatureFlags.Labels, true);
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
    await enableFeatureFlag(request, FeatureFlags.Labels, false);
  });
});
