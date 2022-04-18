export interface Environment {
  production: boolean;
  version: string;
  googleMapsApiKey: string;
  googleAnalyticsKey: string;
  googleTagManagerKey: string;
  awsSettings: AWSSettings;
  awsSettingsDissent: AWSSettings;
  backendUrl: string;
  backendCashedUrl: string;
  logging: boolean;
  // sentry.io
  sentryUrl: string;
  sentryEnvironment: string;
  freshchatPixelToken: string;
  assetsUrl: string;
  dataShaderLayerUrl: string;
  featureFlags: string | string[];
}

export interface AWSSettings {
  region: string;
  userPoolId: string;
  clientId: string;
  appClientName?: string;
}
