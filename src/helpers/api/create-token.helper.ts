import { createUser } from './create-user.helper';
import { UserType } from '@_src_api/enums/user-types.enum';
import { logConsole } from '@_src_api/utils/log-levels';
import { request } from '@playwright/test';
import { testUsers } from 'src/shared/fixtures/auth';
import { UserData } from 'test-data/models/user.model';

export async function createToken(userType: string): Promise<string> {
  let setEmail: string, setPassword: string;
  const tokenContextRequest = await request.newContext();

  if (userType === UserType.regular) {
    setEmail = testUsers.regularUser.email;
    setPassword = testUsers.regularUser.password;
  } else if (userType === UserType.admin) {
    setEmail = testUsers.admin.email;
    setPassword = testUsers.admin.password;
  } else if (userType === UserType.custom) {
    const userData: UserData = await createUser(tokenContextRequest);
    setEmail = userData.email;
    setPassword = userData.password;
    logConsole(
      `Logging in as ${userType} user ${userData.firstname} ${userData.lastname} (email: ${setEmail})\n`,
    );
  }

  const response = await tokenContextRequest.post(`/api/login`, {
    data: {
      email: setEmail,
      password: setPassword,
    },
  });

  const body = await response.json();
  const accessToken = body.access_token;
  return accessToken;
}

export async function createHeaders(
  userType: string = UserType.regular,
): Promise<{ [key: string]: string }> {
  const setTokenInHeaders = await createToken(userType);
  const requestHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${setTokenInHeaders}`,
  };
  logConsole(
    `Request Headers for ${userType} user are the following: \n ${JSON.stringify(
      requestHeaders,
      null,
      2,
    )} \n ----`,
  );
  return requestHeaders;
}

export async function createInvalidHeaders(): Promise<{
  [key: string]: string;
}> {
  const requestHeaders = {
    Authorization: `Bearer 'withInvalidAccessToken'`,
  };
  return requestHeaders;
}
