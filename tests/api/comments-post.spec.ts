import { testUsers } from "@_src_fixtures_api/auth";
import { createHeaders } from "@_src_helpers_api/create-token.helper";
import { test, APIResponse, expect } from "@playwright/test";

test.describe("POST comments tests", async () => {
  const baseUrl: string = process.env.BASE_URL;
  const comments: string = `${baseUrl}/api/comments`;
  const commentBody: string =
    "What a wonderful article!";
  const commentDate: string = "2024-06-30T15:44:31Z";

  //Given there is at least one article
  const article_id: number = 1;
   
  let setHeaders: any;
  let expectedStatusCode: number;

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  test("Returns 201- Created after creating comment", async ({ request }) => {
           
    //Given
    expectedStatusCode = 201;

    //When user sends POST request to Comments endpoint  
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
    //And request body contains JSON:
      data: {
        user_id: testUsers.regularUser.id,
        article_id: article_id,
        body: commentBody,
        date: commentDate,
      },
    });
     const responseBody = JSON.parse(await response.text())

    //Then user should get 201 response:
    expect(response.status()).toBe(expectedStatusCode);
    //And the response should contain user_id in "user_id":
    expect(responseBody.user_id).toBe(testUsers.regularUser.id);
    ////And the response should contain article_id in "article_id":
    expect(responseBody.article_id).toBe(article_id);
    //And the response should contain content of comment in "body":
    expect(responseBody.body).toBe(commentBody);
    //And the response should contain date of comment in "date":
    expect(responseBody.date).toBe(commentDate);
    //And the response should contain id value of a new comment in "id"
    //And the id should not be empty:
    expect(responseBody.id).not.toBeNull;
  });


  test("Returns 400 - Bad request after sending comment with malformed JSON", async ({ request }) => {
    
    //Given 
    expectedStatusCode = 400;
    const malformedJson: string = `{
      user_id: testUsers.regularUser.id,
      article_id: "article_id,  
      body: commentBody,
      date: commentDate,
  }`;

    //When user sends POST request to Comments endpoint  
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
     //And request body contains malformed JSON:
      data: malformedJson,
    });
    
     //Then user should get 400 response:
    expect(response.status()).toBe(expectedStatusCode);
   
  });


  test("Returns 422- Invalid comment supplied after sending comment without body ", async ({ request }) => {
        
    //Given 
    expectedStatusCode = 422;
    
    //When user sends POST request to Comments endpoint  
    const response: APIResponse = await request.post(comments, {
      headers: setHeaders,
     //And request body contains JSON without body:
      data: {
        user_id: testUsers.regularUser.id,
        article_id: article_id,
        date: commentDate,
      },
    });
   
     //Then user should get 404 response:
    expect(response.status()).toBe(expectedStatusCode);
    
  });
});