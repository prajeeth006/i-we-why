import * as figma from '@figma/rest-api-spec';
import { Request, Response } from 'express';
import * as process from 'process';

import { addPayloadToQueue } from './queue.feature';

const FIGMA_WEBHOOK_PASSCODE = process.env['FIGMA_WEBHOOK_PASSCODE'] ?? '';

const STATUS_SUCCESS = 200;
const STATUS_FORBIDDEN = 403;

export function handleFigmaWebhook(req: Request, res: Response) {
    // On runtime there exist no interfaces, so we check whether the passcode exists and if it matches
    // We know the request is from Figma, so we assume, the request is fine.
    // Otherwise, we would have to validate the full request (which we can do as well in another step)

    if (!('passcode' in req.body) || req.body.passcode !== FIGMA_WEBHOOK_PASSCODE) {
        res.sendStatus(STATUS_FORBIDDEN);
        return;
    }
    const payload = req.body as figma.WebhookBasePayload;

    // add Payload to queue
    addPayloadToQueue(payload);

    res.sendStatus(STATUS_SUCCESS);
    return;
}
