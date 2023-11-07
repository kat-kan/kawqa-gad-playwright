import { test, expect } from "@playwright/test";

let baseURL = process.env.BASE_URL;
let articleID = 3;
let articleTitle = "What is agile software development?";
let articleDate = "2021-07-25";

test.only("GET/articles/3 - validate article information", async ({ request }) => {
    const response = await request.get(`${baseURL}/api/articles/${articleID}`);
    const responseBody = await response.json();
    
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);    
    
    const expectedData = {
        "title": articleTitle,
        "date": expect.stringMatching(articleDate)
    };
    
    expect(responseBody).toMatchObject(expectedData);    
    expect(responseBody.body).toBeTruthy();

    console.log(await response.json());
});
