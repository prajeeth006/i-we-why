/**
 * For durability, high concurrency, etc. a lightweight database such as Redis is required.
 * For the first version, we use a simple solution, which may not guarantee that every event is handled.
 */
import * as log4js from 'log4js';

import { handleEvent } from './chromatic-handler.feature';
import { ChromaticEvent } from './chromatic.types';

const taskQueue: ChromaticEvent[] = [];

export function addPayloadToQueue(payload: ChromaticEvent) {
    taskQueue.push(payload);
}

function getNextTask() {
    return taskQueue.shift();
}

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

            const payload = getNextTask();

            if (payload) {
                await handleEvent(payload);
            }
        } else {
            // Wait a second if we have no task
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
    }
}
