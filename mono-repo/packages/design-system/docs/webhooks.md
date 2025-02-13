# Webhooks

We currently have two nodejs webhooks in place:

* **Figma Webhook** is responsible to listen to changes in Figma and publish an MR with token changes 
* **Chromatic Webhook** is responsible to listen to changes in Chromatic and publish the chromatic reviewing state in Gitlab

## Deployment
Webhooks are deployed via DISME.

For this, 
1. click on Gitlab for the latest pipeline on the play icon
1. then clock on trigger-disme-pipeline
1. after this job is finished, open the generated pipeline
1. press the play icon for the start-<project-name> (this will trigger the upload to DISME)
1. press the play icon after it is finished at deploy-<project-name> (this will trigger deployment of app)

## Monitoring

The logs can be accessed in Kibana

| Service | URL                                         |
|--|---------------------------------------------|
| Chromatic Webhook App | https://kibana.test.env.works/app/r/s/0rLA2 |
| Figma Webhook App | https://kibana.test.env.works/app/r/s/f4q1q |

## Local Development

We recommend to use ngrok to have a proxy in place to receive incoming requests.
You can setup an own example project in chromatic and gitlab (for chromatic)
to debug the webhook. 

For Figma, you can temporarily register an additional webhook in the Figma file according to the docs (you need correct permissions),
or you create your own structure in case you have the right Figma permissions.
Of course, you need a gitlab repo mirroring the structure we have in the app for testing it.
You can configure the gitlab project with your environment variables.

## Environment variables

Shared for both apps:

| Variable              | Description                                                                      |
|-----------------------|----------------------------------------------------------------------------------|
| GITLAB_PRIVATE_TOKEN | Token to communicate with Gitlab                                                 |
| GITLAB_PROJECT_ID | The gitlab project you find in the settings of the repository                    |
| GITLAB_HOST | The gitlab host, usually https://vie.git.bwinparty.com                           |
| LOG_DIR | the directory to write log outputs of the services                               |

Only Used in Figma:

| Variable              | Description                                                                      |
|-----------------------|----------------------------------------------------------------------------------|
| FIGMA_API_TOKEN     | Token to communicate with Figma. Grant at least read/write variable permissions. |
| FIGMA_WEBHOOK_PASSCODE | The passcode added in Figma for the webhook                                      |
| HTTP_PROXY | Required on server to communicate with Figma |

Only used in Chromatic:

| Variable              | Description                                                                      |
|-----------------------|----------------------------------------------------------------------------------|
| CHROMATIC_WEBHOOK_PASSWORD | The webhook password for chromatic basic auth, the user is chromatic             |
