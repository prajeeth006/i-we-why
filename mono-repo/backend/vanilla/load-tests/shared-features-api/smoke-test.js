import { check, sleep } from 'k6';
import http from 'k6/http';
import { LOAD_URL, PRODUCT_API_HEADER_VALUE } from './env.js';

export const options = {
    iterations: 1,
    vus: 1,
};

const params = {
    headers: {
        'x-bwin-sf-api': PRODUCT_API_HEADER_VALUE,
    },
};

const testUrl = `${LOAD_URL}/site/check`;

export default function () {
    const response = http.get(testUrl, params);
    check(response, {
        'should be OK': (r) => r.body === 'CHECK_OK',
    });
    sleep(1);
}
