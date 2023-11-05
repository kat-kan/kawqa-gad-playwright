import { test, expect } from "@playwright/test";

test.describe("Testing the Articles section", () => {
    let baseURL = process.env.BASE_URL;

    test("GET - find comments by ID", async ({ request }) => {
        const response = await request.get(`${baseURL}/api/articles/3`);
        expect(response.status()).toBe(200);

        const responseBody = JSON.parse(await response.text());
        console.log(responseBody);
    });
});
