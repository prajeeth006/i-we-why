import { getVersionOfPackages } from './tools';

export interface Params {
    version: string;
    feed: string;
    getFeed: string;
}

let params: Params;

function loadParams() {
    const nugetVersion = getVersionOfPackages();

    let version = nugetVersion.semver;
    let npmFeedId = 'bpty-npm-local';
    let getFeedId = 'npm-public';

    let feed = `https://artifactory.bwinparty.corp/artifactory/api/npm/${npmFeedId}`;
    let getFeed = `https://artifactory.bwinparty.corp/artifactory/api/npm/${getFeedId}`;

    params = { version, feed, getFeed };
}

export function getParams(): Params {
    if (!params) {
        loadParams();
    }

    return params;
}
