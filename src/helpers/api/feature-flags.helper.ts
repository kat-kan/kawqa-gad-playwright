import { HttpStatusCode } from '@_src_api/enums/api-status-code.enum';
import { FeatureFlags } from '@_src_api/enums/feature-flags.enum';
import { APIRequestContext, APIResponse, expect } from '@playwright/test';

/**
 * Enables or disables the selected feature flags for API tests
 * @param request Pass `request` fixture to the function
 * @param flagName Name of the flag from `FeatureFlags` enum, e.g. FeatureFlags.labels to select `feature-labels` flag
 * @param isEnabled `True`: enable flag, `False`: disable flag
 *
 * @example
 * ```
 * await enableFeatureFlag(request, FeatureFlags.labels, false);
 * ```
 */
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
