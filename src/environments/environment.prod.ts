import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  version: 'PROJECT_VERSION',
  googleAnalyticsKey: 'UA-106243613-1',
  googleTagManagerKey: 'GTM-WXZTQK8',
  googleMapsApiKey: 'AIzaSyDLBpOwfG2Vfl7W2p2gxTcfX9u6v1FHkUY',
  awsSettings: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_CsnGAbQEA',
    clientId: '18djtif97g6anh8s829eeg9hu7',
  },
  awsSettingsDissent: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_Ml2f0ENUl',
    clientId: '7foshmiggehrl9go5ts8spji31',
  },
  backendUrl: 'https://api.dev.scoperty.de/api/v1',
  backendCashedUrl: 'https://api-cache.dev.scoperty.de/api/v1',
  logging: false,
  sentryUrl: null,
  sentryEnvironment: null,
  featureFlags: [],
  freshchatPixelToken: '92b59e5b-fac2-4967-8033-ba41d68baae2',
  assetsUrl: 'https://dev-ia-big-assets-store.s3.eu-central-1.amazonaws.com',
  dataShaderLayerUrl: 'https://dev-ia-datashader-tiles.s3.eu-central-1.amazonaws.com',
};
