import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export async function enableFeatureFlag(
  request: APIRequestContext,
  flagName: string,
  isEnabled: boolean,
): Promise<void> {
  const featuresEndpoint: string = `/api/config/features`;
  const dataJSON: JSON = {} as JSON;
  dataJSON[flagName] = isEnabled;

  const response: APIResponse = await request.post(featuresEndpoint, {
    data: dataJSON,
  });

  expect(response.status()).toBe(HttpStatusCode.Ok);
}
