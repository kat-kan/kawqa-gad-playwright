import { request } from "@playwright/test";
import { testUsers } from "@_src_fixtures_api/auth";
import { logConsole } from "@_src_api/utils/log-levels";

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
    let requestHeaders: { [key: string]: string; };
    let setTokenInHeaders:string;

    setTokenInHeaders = await createToken(userType);

    requestHeaders =
    {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${setTokenInHeaders}`
    },

        logConsole(`Request Headers for ${userType} user are the following: \n ${JSON.stringify(requestHeaders, null, 2)} \n ----`);
    return requestHeaders;
}

export async function createInvalidHeaders() {
    let requestHeaders:{ [key: string]: string; };

    requestHeaders = {
        Authorization: "Bearer withInvalidAccessToken",
    };

    return requestHeaders;
}

