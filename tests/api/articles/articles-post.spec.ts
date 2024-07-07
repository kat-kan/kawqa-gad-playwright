import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { testUsers } from '@_src_fixtures_api/auth';
import { createHeaders } from '@_src_helpers_api/create-token.helper';
import { APIResponse, expect, test } from '@playwright/test';
import { customDate } from 'test-data/shared/date.generator';

const futureDates: string[] = [];
const pastDates: string[] = [];
pastDates.push(customDate.pastDate);
pastDates.push(customDate.pastDateISOFormat);
futureDates.push(customDate.futureDate);
futureDates.push(customDate.futureDateISOFormat);

test.describe('POST articles tests', async () => {
  const articles: string = `/api/articles`;
  const articleTitle: string =
    'Quick Error Handling Guide: What to Do When Coffee Leaks on Your Keyboard';
  const articleBody: string =
    'Ah, the joys of being a programmer - navigating through the intricate world of code with the constant companionship of our trusted caffeinated beverages. But what happens when that comforting cup of coffee turns against us, staging a daring escape onto our precious keyboards? Fear not, for we present to you the Quick Error Handling Guide for such a perilous situation.';
  const articleDate: string = customDate.pastDate;
  const articleImage: string =
    'src\\test-data\\images\\Roasted_coffee_beans.jpg';
  let setHeaders: { [key: string]: string };

  test.beforeAll(async () => {
    setHeaders = await createHeaders();
  });

  for (const date of pastDates) {
    test(`Returns 201 Created after creating article with date ${date}`, async ({
      request,
    }) => {
      // When
      const response: APIResponse = await request.post(articles, {
        headers: setHeaders,
        data: {
          user_id: testUsers.regularUser.id,
          title: articleTitle,
          body: articleBody,
          date: date,
          image: articleImage,
        },
      });
      const responseBody = JSON.parse(await response.text());

      // Then
      expect.soft(response.status()).toBe(HttpStatusCode.Created);
      expect
        .soft(responseBody.user_id.toString())
        .toEqual(testUsers.regularUser.id.toString());
      expect.soft(responseBody.title).toBe(articleTitle);
      expect.soft(responseBody.body).toBe(articleBody);
      expect.soft(responseBody.date).toBe(date);
      expect.soft(responseBody.image).toBe(articleImage);
      expect.soft(typeof responseBody.id === 'number').toBe(true);
    });
  }

  test('Returns 400 Bad Request after sending malformed JSON', async ({
    request,
  }) => {
    // Given
    const malformedJson: string = `{
        "user_id": "${testUsers.regularUser.id}",
        "title: ${articleTitle},  // error: missing closing quotation mark
        "body": "${articleBody}",
        "date": "${articleDate}",
        "image": "${articleImage}"
    }`;

    // When
    const response: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: malformedJson,
    });
    // Then
    expect(response.status()).toBe(HttpStatusCode.BadRequest);
  });

  test('Returns 422 Unprocessable content after sending article with missing required information', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: articleTitle,
        body: articleBody,
        //missing date, image - all keys are required
      },
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });

  test('Returns 422 Unprocessable content after sending article JSON with too long value', async ({
    request,
  }) => {
    // Given
    const exceedingLengthTitle: string = 'a'.repeat(10001);

    // When
    const response: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: {
        user_id: testUsers.regularUser.id,
        title: exceedingLengthTitle,
        body: articleBody,
        date: articleDate,
        image: articleImage,
      },
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });

  test('Returns 422 Unprocessable content after sending article JSON with missing userId', async ({
    request,
  }) => {
    // When
    const response: APIResponse = await request.post(articles, {
      headers: setHeaders,
      data: {
        title: articleTitle,
        body: articleBody,
      },
    });

    // Then
    expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
  });

  for (const invalidDate of futureDates) {
    test(`Returns 422 Unprocessable content after sending article JSON with date from the future ${invalidDate}`, async ({
      request,
    }) => {
      //Given
      const futureDateFormatted: string = invalidDate;

      // When
      const response: APIResponse = await request.post(articles, {
        headers: setHeaders,
        data: {
          user_id: testUsers.regularUser.id,
          title: articleTitle,
          body: articleBody,
          date: futureDateFormatted,
          image: articleImage,
        },
      });

      // Then
      expect(response.status()).toBe(HttpStatusCode.UnprocessableEntity);
    });
  }
});
