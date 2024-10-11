import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { APIResponse, expect, test } from '@playwright/test';

test.describe('GET articles/{id} endpoint tests', () => {
  const articles: string = `/api/articles`;

  test('Returns OK status code and correct article data', async ({
    request,
  }) => {
    // Given
    const articleID = 3;
    const articleUserID = 3;
    const articleTitle: string = 'What is agile software development?';
    const articleBody: string =
      'Agile software development is a set of principles and practices that emphasize collaboration, flexibility, and customer value. Agile software development is based on the Agile Manifesto, which states:\n- Individuals and interactions over processes and tools\n- Working software over comprehensive documentation\n- Customer collaboration over contract negotiation\n- Responding to change over following a plan Agile software development uses iterative and incremental methods, such as Scrum, Kanban, or XP, to deliver software in small batches.';
    const articleDate: string = '2021-07-25T13:34:00Z';
    const articleImage: string =
      '.\\data\\images\\256\\jeremy-hynes-HxxNVun8HEc-unsplash.jpg';
    const expectedData = {
      id: articleID,
      user_id: articleUserID,
      title: articleTitle,
      body: articleBody,
      date: articleDate,
      image: articleImage,
    };
    // When
    const response: APIResponse = await request.get(`${articles}/3`);
    const responseBody = await response.json();

    // Then
    expect(response.status()).toBe(HttpStatusCode.Ok);
    expect(responseBody).toEqual(expectedData);
  });

  test('Returns Not Found 404 status code with specific response body', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.get(`${articles}/-1`);
    const responseBody = await response.text();

    // Then
    expect(response.status()).toBe(HttpStatusCode.NotFound);
    expect(responseBody).toBe('{}');
  });
});
