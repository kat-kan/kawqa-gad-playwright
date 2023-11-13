import { request } from "@playwright/test";
import { testUsers } from "@_src_fixtures_api/auth";

export async function createToken(userType: string): Promise<string> {
    let setEmail, setPassword;

    if (userType === 'regular') {
        setEmail = testUsers.regularUser.email;
        setPassword = testUsers.regularUser.password;
    }
    else if (userType === 'admin') {
        setEmail = testUsers.admin.email;
        setPassword = testUsers.admin.password;
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

export async function createHeaders(userType: string = 'regular') {
    let requestHeaders;
    let setTokenInHeaders;

    setTokenInHeaders = await createToken(userType);

    requestHeaders =
    {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${setTokenInHeaders}`
    },

        console.log(`Request Headers are the following: \n`);
    console.log(requestHeaders);
    return requestHeaders;
}

export async function createInvalidHeaders() {
    let requestHeaders;

    requestHeaders = {
        Authorization: "Bearer withInvalidAccessToken",
    };

    return requestHeaders;
}
