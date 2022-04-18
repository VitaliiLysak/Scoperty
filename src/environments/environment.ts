import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  version: 'develop',
  googleAnalyticsKey: 'UA-106243613-1',
  googleTagManagerKey: 'GTM-NNB7B8V',
  googleMapsApiKey: 'AIzaSyDLBpOwfG2Vfl7W2p2gxTcfX9u6v1FHkUY',
  awsSettings: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_CsnGAbQEA',
    clientId: '18djtif97g6anh8s829eeg9hu7',
    appClientName: 'DevIaCognitoClientWeb',
  },
  awsSettingsDissent: {
    region: 'eu-central-1',
    userPoolId: 'eu-central-1_Ml2f0ENUl',
    clientId: '7foshmiggehrl9go5ts8spji31',
    appClientName: 'DevIaCognitoDissentClientWeb',
  },
  backendUrl: 'https://api.dev.scoperty.de/api/v1',
  backendCashedUrl: 'https://api-cache.dev.scoperty.de/api/v1',
  logging: true,
  sentryUrl: null,
  sentryEnvironment: null,
  featureFlags: ['vwo-pixel'],
  freshchatPixelToken: '92b59e5b-fac2-4967-8033-ba41d68baae2',
  assetsUrl: 'https://dev-ia-big-assets-store.s3.eu-central-1.amazonaws.com',
  dataShaderLayerUrl: 'https://dev-ia-datashader-tiles.s3.eu-central-1.amazonaws.com',
};
