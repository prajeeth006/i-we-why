import { Request, Response } from 'express';
import * as log4js from 'log4js';

import { ChromaticEvent } from './chromatic.types';
import { addPayloadToQueue } from './queue.feature';

export async function handleChromaticWebhook(req: Request, res: Response) {
    const logger = log4js.getLogger();
    const body = req.body as ChromaticEvent;
    const statusNotFound = 404;
    if (body.version === 2) {
        switch (body.event) {
            case 'build':
            case 'review':
            case 'review-decision':
                addPayloadToQueue(body);
                res.end('OK');
                return;
            default:
                const error = `Invalid event ${JSON.stringify(body)}`;
                logger.error(error);
                res.status(statusNotFound).send(error);
                return;
        }
    } else {
        const error = 'Invalid API version, cannot be processed';
        logger.error(error);
        res.status(statusNotFound).send(error);
        return;
    }
}
