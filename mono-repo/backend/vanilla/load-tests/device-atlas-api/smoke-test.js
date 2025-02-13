import { check } from 'k6';
import http from 'k6/http';
import { LOAD_URL } from './env.js';

export const options = {
    iterations: 1,
    vus: 1,
};

export default function () {
    const response = http.get(LOAD_URL);
    check(response, {
        'status was 200': (r) => r.status === 200,
    });
}
