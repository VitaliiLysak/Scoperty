frontend
=====

Frontend repository containing Angular web app code.

# TOC

* [Getting started](#getting-started)
  * [Environments](#environments)
    * [Environment variables](#environment-variables)
  * [Configuration](#configuration)
  * [Development](#development)
    * [Storybook](#storybook)
* [Building](#building)
* [Testing](#testing)
* [Deployment](#deployment)

----

# Getting started

## Environments

All environment configs placed in the `./src/environments/` folder.

Project has next environments:

* _environment.ts_ - default config (might used as template). Please see this file for getting the explanation about each field.
* _environment.dev.ts_ - for plain local development
* _environment.staging.ts_ - for generate static build for staging server
* _environment.prod.ts_ - for generate static build for production server

To define environment for run you need to use option `-e envname`.

For example: `ng build -e staging`

### Environment variables

```
export const environment = {
  production: PRODUCTION,
  googleAnalyticsKey: 'GOOGLE_ANALYTICS_KEY',
  googleMapsApiKey: 'GOOGLE_MAPS_API_KEY',
  awsSettings: {
    region: 'AWS_SETTINGS_REGION',
    userPoolId: 'AWS_SETTINGS_USER_POOL_ID',
    clientId: 'AWS_SETTINGS_CLIENT_ID',
  },
  backendUrl: 'BACKEND_URL',
};
```

## Configuration

You can use a number of environment variables to configure the behaviour of the container (see docker-compose.yml)

* BACKEND_URL: URL where to find the backend, default http://localhost:8000.


**Hint**: For FE there is no ability (yet) to change backend api url via env variable, so project is copied inside container and with replacing backend string in configuration via docker-entrypoint script.
This is the reason why code directory is not mounted inside (to allow local FE-development with docker)

## Development

* `npm run start` - Runs application in development mode accessible under [localhost:4200](http://localhost:4200)

### Storybook

We are using [Storybook.js](https://storybook.js.org/) to document and test components in an isolated environment.

* `npm run storybook:start` - Runs Storybook with all the stories accessible under [localhost:6006](http://localhost:6006)
* `npm run storybook:build` - Builds a static website with all stories

# Building

* `npm run build` - Compiles and bundles application, results are stored inside the `dist` subfolder

# Testing

* `npm run lint` - Lint checker from Angular
* `npm run test` - Runs karma tests
* `npm run e2e` - Runs protractor e2e tests
* `npm run pree2e` - Runs selenium UI tests

# Deployment

If you want to deploy the application to an environment you can use the continuous delivery (CD) script inside the [operations](https://bitbucket.org/immoatlas/operations) repository and read its documentation in `docker_images/README.md`.

## Version

The file `/src/version.json` is being used to store deployment information in the `/dist` folder. 
The values are injected when the deployment runs.
The file contains information about:

* `stage` - Dev, Stage or Production
* `pipelineId` - The pipeline-id
* `commitHash` - Commit hash of the changes were deployed
* `date` - Date, when the app was deployed
