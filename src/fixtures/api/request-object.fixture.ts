import { ArticlesRequest } from '@_src_api/requests/articles.request';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { test as baseTest } from '@playwright/test';

interface Requests {
  articlesRequest: ArticlesRequest;
  articlesRequestLogged: ArticlesRequest;
}

export const requestObjectTest = baseTest.extend<Requests>({
  articlesRequest: async ({ request }, use) => {
    const articlesRequest = new ArticlesRequest(request);
    await use(articlesRequest);
  },
  articlesRequestLogged: async ({ request }, use) => {
    const headers = await createHeaders();
    const articlesRequest = new ArticlesRequest(request, headers);
    await use(articlesRequest);
  },
});
