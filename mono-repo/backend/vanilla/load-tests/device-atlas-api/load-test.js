import { sleep } from 'k6';
import http from 'k6/http';
import { LOAD_URL } from './env.js';

const userAgents = [
    'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148',
];

const userAgent = userAgents[0];

function getHttpParams(userAgent) {
    return {
        headers: { 'user-agent': userAgent },
    };
}

export const options = {
    discardResponseBodies: true,
    vus: 2000,
    duration: '5m',
};

export default function () {
    http.get(LOAD_URL, getHttpParams(userAgent));
    sleep(1);
}
