import { Environment } from './environment.model';

import { getBooleanFromString } from '../app/shared/utils/boolean-from-string.util';

export const environment: Environment = {
  production: true,
  version: 'PROJECT_VERSION',
  googleAnalyticsKey: 'GOOGLE_ANALYTICS_KEY',
  googleTagManagerKey: 'GOOGLE_TAG_MANAGER_KEY',
  googleMapsApiKey: 'GOOGLE_MAPS_API_KEY',
  awsSettings: {
    region: 'AWS_SETTINGS_REGION',
    userPoolId: 'AWS_SETTINGS_USER_POOL_ID',
    clientId: 'AWS_SETTINGS_CLIENT_ID',
  },
  awsSettingsDissent: {
    region: 'AWS_DISSENT_REGION',
    userPoolId: 'AWS_DISSENT_USER_POOL_ID',
    clientId: 'AWS_DISSENT_CLIENT_ID',
  },
  backendUrl: 'BACKEND_URL_V1',
  backendCashedUrl: 'BACKEND_URL_CACHED_V1',
  logging: getBooleanFromString('LOGGING_ENABLED'),
  sentryUrl: 'SENTRY_URL',
  sentryEnvironment: 'SENTRY_ENVIRONMENT',
  freshchatPixelToken: 'FRESHCHAT_PIXEL_TOKEN',
  assetsUrl: 'ASSETS_URL',
  dataShaderLayerUrl: 'DATA_SHADER_LAYER_URL',
  featureFlags: 'FEATURE_FLAGS',
};
