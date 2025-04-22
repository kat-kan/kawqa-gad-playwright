import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { FeatureFlags } from '@_src_api/enums/feature-flags.enum';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

export async function enableFeatureFlag(
  request: APIRequestContext,
  flagName: FeatureFlags,
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
