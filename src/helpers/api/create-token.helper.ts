import { APIRequestContext, request } from "@playwright/test";
import { testUser } from "@_src_fixtures_api/auth";

export async function createToken(setEmail?: string, setPassword?: string): Promise<string> {
    if (!setEmail) {
        setEmail = testUser.userEmail;
    }
    if (!setPassword) {
        setPassword = testUser.userPassword;
    }

    let accessToken;
    let baseURL = process.env.BASE_URL;

    const tokenContextRequest = await request.newContext();
    const response = await tokenContextRequest.post(`${baseURL}/api/login`, {
        data: {
            email: setEmail,
            password: setPassword,
        },
    });

    const body = await response.json();
    accessToken = body.access_token;
    return accessToken;
}

export async function createHeaders(): Promise<APIRequestContext> {
    let requestHeaders;
    let setTokenInHeaders;

    setTokenInHeaders = await createToken(testUser.userEmail, testUser.userPassword);

    requestHeaders =
    {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${setTokenInHeaders}`
    },

        console.log(`Request Headers are the following: \n`);
    console.log(requestHeaders);
    return requestHeaders;
}

export async function createInvalidHeaders(): Promise<APIRequestContext> {
    let requestHeaders;

    requestHeaders = {
        Authorization: "Bearer withInvalidAccessToken",
    };

    return requestHeaders;
}
