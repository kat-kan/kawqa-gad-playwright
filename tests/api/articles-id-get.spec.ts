import { test, expect, APIResponse } from "@playwright/test";

test.describe.skip("GET/articles/{id} Get by ID", () => {
  const baseURL: string = process.env.BASE_URL;

  test("returns OK status code and correct article data", async ({ request }) => {
    const statusCode = 200;
    const articleID = 3;
    const articleUserID = 3;
    const articleTitle: string = "What is agile software development?";
    const articleBody: string =
      "Agile software development is a set of principles and practices that emphasize collaboration, flexibility, and customer value. Agile software development is based on the Agile Manifesto, which states:\n- Individuals and interactions over processes and tools\n- Working software over comprehensive documentation\n- Customer collaboration over contract negotiation\n- Responding to change over following a plan Agile software development uses iterative and incremental methods, such as Scrum, Kanban, or XP, to deliver software in small batches.";
    const articleDate: string = "2021-07-25T13:34:00Z";
    const articleImage: string =
      ".\\data\\images\\256\\jeremy-hynes-HxxNVun8HEc-unsplash.jpg";

    const response: APIResponse = await request.get(`${baseURL}/api/articles/3`);
    const responseBody = await response.json();

    expect(response.status()).toBe(statusCode);

    const expectedData = {
      id: articleID,
      user_id: articleUserID,
      title: articleTitle,
      body: articleBody,
      date: articleDate,
      image: articleImage,
    };

    expect(responseBody).toEqual(expectedData);
  });

  test("returns 404 code with specific response body", async ({ request }) => {
    const statusCode = 404;

    const response: APIResponse = await request.get(`${baseURL}/api/articles/-1`);

    expect(response.status()).toBe(statusCode);

    const responseBody = await response.text();
    expect(responseBody).toBe("{}");
  });
});
