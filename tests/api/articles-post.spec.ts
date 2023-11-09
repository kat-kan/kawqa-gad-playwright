import test from "@playwright/test";

test.describe("POST articles tests", async () => {
  test("Returns 201 Created after creating article", async ({
    request,
  }) => {});
  test("Returns 400 Bad Request after sending malformed JSON", async ({
    request,
  }) => {});
  test("Returns 422 Unprocessable content after sending invalid article", async ({
    request,
  }) => {});
});
