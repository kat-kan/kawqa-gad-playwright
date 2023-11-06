import { test, expect } from "@playwright/test";

let baseURL = process.env.BASE_URL;
let articlesID = 3;
let articleTitle = "What is agile software development?";
let articleDate = "2021-07-25";

test.only("GET - find comments by ID", async ({ page }) => {
    const response = await page.goto(`${baseURL}/api/articles/${articlesID}`);
    if (response === null) {
        throw new Error("Response is null");
    }
    const responseBody = JSON.parse(await response.text());
    
    expect(response.status()).toBe(200);
    expect(responseBody.title).toBe(articleTitle);
    expect(responseBody.date).toContain(articleDate);
    expect(responseBody.body).toBeTruthy();

    console.log(responseBody);
});
