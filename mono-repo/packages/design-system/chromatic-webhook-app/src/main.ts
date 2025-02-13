import { gracefulShutdownQueue, handleChromaticWebhook, processTasks } from '@design-system/chromatic-webhook-request-handler-feature';
import express, { json as expressJson } from 'express';
import expressBasicAuth from 'express-basic-auth';
import * as log4js from 'log4js';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import process from 'node:process';

const LOG_DIR = process.env['LOG_DIR'] || '.';

/**
 * we do have possibility for centralized logging, meaning we ship log files to an ELK stack
 * so devs and ops ppl can nicely view logs via Kibana.
 *
 * If you want to go for this, you'll need to write logs to a file "server.log".
 * Do note that if you go for file logging the app should take care of log rotation.
 * Usually for small apps we recommend a max file size of no more than 100M,
 * and to keep around no more than 10 log files.
 *
 * About the logging, if you could write log entries in ndjson format, that would be great.
 * With the timestamp field being named "@timestamp"
 */
log4js.addLayout('ndjson', () => (logEvent) => {
    const loggingObject = {
        '@timestamp': logEvent.startTime,
        'level': logEvent.level.levelStr,
        'category': logEvent.categoryName,
        'context': logEvent.context,
        'message': logEvent.data.join(';'),
    };
    return JSON.stringify(loggingObject);
});

log4js.configure({
    appenders: {
        logFile: {
            type: 'file',
            filename: path.join(LOG_DIR, 'server.log'),
            maxLogSize: '100M',
            backups: 10,
            compress: true,
            layout: {
                type: 'ndjson',
            },
        },
    },
    categories: {
        default: { appenders: ['logFile'], level: 'debug' },
    },
});

const logger = log4js.getLogger();

const chromaticUserName = 'chromatic';

const chromaticUserPassword = process.env['CHROMATIC_WEBHOOK_PASSWORD'] ?? '';
if (!chromaticUserPassword || chromaticUserPassword === '') {
    throw new Error(`A chromatic webhook password is required for basic auth which is provided at chromatic custom webhook url.`);
}

const app = express();
app.use(expressJson());
app.use(
    expressBasicAuth({
        users: {
            [chromaticUserName]: chromaticUserPassword,
        },
    }),
);

// No await, it runs in background
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
processTasks()
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .then(() => {
        logger.info('Queue stopped');
    })
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .catch(() => {
        //ignore
    });

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-misused-promises
app.post('/chromatic', handleChromaticWebhook);

app.get('/', (req, res) => {
    res.send({ message: 'Server is running and accepting requests' });
});

async function exists(f: string) {
    try {
        await fs.stat(f);
        return true;
    } catch {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.get('/version', async (req, res) => {
    // eslint-disable-next-line unicorn/prefer-module
    if (await exists(path.join(__dirname, './version.xml'))) {
        const versionRegex = /<version>([^<]+)<\/version>/;
        const data = await fs.readFile('./version.xml', 'utf8');
        const match = data.match(versionRegex);
        if (match == null) {
            res.send({ app_version: 'No version detected' });
            return;
        }
        res.send({ app_version: match[1] });
        return;
    }

    res.send({ app_version: 'No version provided (1)' });
});

const defaultPort = 3333;
const port = process.env['CHROMATIC_WEBHOOK_PORT'] || defaultPort;
const server = app.listen(port, () => {
    logger.info(`Listening at http://0.0.0.0:${port}`);
});
server.on('error', (err) => {
    logger.error(err);
});

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

function gracefulShutdown() {
    logger.info('Graceful shutdown');
    gracefulShutdownServer();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    gracefulShutdownQueue();
}

function gracefulShutdownServer() {
    server.close(() => {
        logger.info('Server closed');
        log4js.shutdown();
    });
}
