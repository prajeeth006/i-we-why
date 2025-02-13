import { sleep } from 'k6';
import exec from 'k6/execution';
import http from 'k6/http';
import { getUserAgent } from '../user-agents.js';
import { PRODUCT_API_HEADER_VALUE } from './env.js';
import { getLabel } from './labels.js';
import { getUrl } from './urls.js';

export const options = {
    discardResponseBodies: true,
    duration: '445m',
    vus: 50,
};

const getRequestParameters = (userAgent) => {
    return {
        headers: {
            'x-bwin-sf-api': PRODUCT_API_HEADER_VALUE,
            'user-agent': userAgent,
        },
    };
};

function getFullUrl(label, path) {
    return `https://beta-sports.${label}${path}`;
}

export default function () {
    const userAgent = getUserAgent(exec.vu.iterationInInstance);
    const label = getLabel(exec.vu.iterationInInstance);
    const path = getUrl(exec.vu.iterationInInstance);
    const url = getFullUrl(label, path);

    const response = http.get(url, getRequestParameters(userAgent));
    //console.log(url, response.status);

    if (!response.status.toString().startsWith('4')) sleep(1);
}
