/**
 * For durability, high concurrency, etc. a lightweight database such as Redis is required.
 * For the first version, we use a simple solution, which may not guarantee that every event is handled.
 */
import { FigmaClient } from '@design-system/figma-data-access';
import { TokenPathName, findFileKey } from '@design-system/token-path-config-utils';
import * as figma from '@figma/rest-api-spec';
import log4js from 'log4js';
import * as process from 'process';

import { GitlabOptions } from './gitlab/gitlab-options.types';
import { handleLibraryPublish } from './handlers/library-publish-handler.utils';

const taskQueue: TokenPathName[] = [];
const lastRunTime = new Map<TokenPathName, number>();
/**
 * This time specifies the delay of the same task
 */
const taskLimitTime = 60_000;

function enqueueTask(task: TokenPathName) {
    const isInQueue = taskQueue.some((t) => t === task);

    if (!isInQueue) {
        taskQueue.push(task);
    }
}

export function addPayloadToQueue(payloadP: figma.WebhookBasePayload) {
    const logger = log4js.getLogger();

    const payload = payloadP as figma.WebhookBasePayload & { event_type: string };

    switch (payload.event_type) {
        case 'LIBRARY_PUBLISH':
            const publishPayload = payload as figma.WebhookLibraryPublishPayload;
            logger.info('New publishing event for file', publishPayload.file_key);

            const appName = findFileKey(publishPayload.file_key);
            if (!appName) {
                logger.warn(`Token path ignored, unknown file key: ${publishPayload.file_key}`);
                return;
            }
            enqueueTask(appName);
            logger.info(`Task ${appName} added to queue`);
            break;
        case 'PING':
            logger.info('Webhook successfully installed', payload.webhook_id);
            return;
        default:
        //ignore
    }
}

function getNextTask() {
    return taskQueue.shift();
}

const figmaApiToken = process.env['FIGMA_API_TOKEN'] ?? '';
if (!figmaApiToken || figmaApiToken === '') {
    throw new Error(`A figma token is required for communicating with the Figma RestAPI Endpoint.`);
}

const proxy = process.env['HTTP_PROXY'] ?? null;
let proxyUrl: URL | undefined;
if (proxy) {
    proxyUrl = new URL(proxy);
}

const figmaClient = new FigmaClient({
    personalAccessToken: figmaApiToken,
    proxy: proxyUrl,
});

const gitlabProjectId = process.env['GITLAB_PROJECT_ID'] ?? '';
const gitlabHost = process.env['GITLAB_HOST'] ?? '';
const gitlabToken = process.env['GITLAB_PRIVATE_TOKEN'] ?? '';

if (!gitlabProjectId || gitlabProjectId === '') {
    throw new Error(`A gitlab project is required for communicating with the GitlabAPI Endpoint.`);
}

if (!gitlabHost || gitlabHost === '') {
    throw new Error(`A gitlab host is required for communicating with the GitlabAPI Endpoint.`);
}

if (!gitlabToken || gitlabToken === '') {
    throw new Error(`A gitlab token is required for communicating with the GitlabAPI Endpoint.`);
}

const gitlabOptions: GitlabOptions = {
    host: gitlabHost,
    token: gitlabToken,
    projectId: parseInt(gitlabProjectId, 10),
};

let keepProcessing = true;

/**
 * A helper function to be called to gracefully shutdown the worker
 */
export function gracefulShutdownQueue() {
    keepProcessing = false;
}

/**
 * It executes the task execution, processsing one payload at a time.
 */
export async function processTasks() {
    const logger = log4js.getLogger();

    logger.info('Queue started');

    while (keepProcessing || taskQueue.length > 0) {
        if (taskQueue.length > 0) {
            if (taskQueue.length > 10) {
                logger.warn(`Current amount of tasks in queue is going up ${taskQueue.length}`);
            }

            // Event type not part of parent so we add it here.
            const payload = getNextTask();

            if (payload == null) {
                continue;
            }

            const now = Date.now();
            const lastRun = lastRunTime.get(payload) ?? 0;
            const timeSinceLastRun = now - lastRun;

            if (timeSinceLastRun >= taskLimitTime) {
                lastRunTime.set(payload, now);
                logger.info(`Executing ${payload}. Last execution ${timeSinceLastRun}ms ago`);
            } else {
                enqueueTask(payload);
                // Wait a second if we have "no" task
                await new Promise((resolve) => setTimeout(resolve, 1000));
                continue;
            }

            try {
                await handleLibraryPublish(figmaClient, payload, gitlabOptions);
            } catch (e) {
                logger.error(e);
            }
        } else {
            // Wait a second if we have no task
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}
