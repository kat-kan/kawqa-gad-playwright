import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { APIRequestContext, expect } from '@playwright/test';
import { UserData } from 'test-data/models/user.model';
import { generateFakeUserData } from 'test-data/shared/user.generator';

export async function createUser(
  request: APIRequestContext,
): Promise<UserData> {
  // Given
  const userData = await generateFakeUserData(request);

  //When
  const response = await request.post(`api/users`, {
    data: userData,
  });

  //Then
  const code = response.status();
  expect(code).toBe(HttpStatusCode.Created);

  return userData;
}
