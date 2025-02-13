import * as PluginError from 'plugin-error';

import { packageJson } from './packageJson';
import { git } from './git';
import { args } from '../config';

interface BuildInfoModel {
    revision: string;
    hash: string;
    packageVersion: string;
    npmFeed: string;
    npmGetFeed: string;
    nugetFeed: string;
    nugetOutputDir: string;
    isPublicRelease: boolean;
    rebuild: boolean;
    stealth: boolean;
}

export class BuildInfo {
    private info: BuildInfoModel;

    constructor(private packageJsonFile: any) {
    }

    get(selector: (b: BuildInfoModel) => any) {
        if (!this.info) {
            this.init();
        }

        return selector(this.info);
    }

    private init() {
        const isPublicRelease = this.getCliParam('prod', false);
        const rebuild = this.getCliParam('build', true);
        const stealth = this.getCliParam('stealth', false);
        const next = this.getCliParam('next', false);

        if (isPublicRelease && next) {
            throw new PluginError('publish', 'Both prod and next flags are not allowed.');
        }

        let feedId;
        let getFeedId;
        let nugetOutputDir;

        if (isPublicRelease) {
            feedId = 'local';
            getFeedId = 'public';
            nugetOutputDir = 'build/dist';
        } else if (next) {
            feedId = 'vanilla-next';
            getFeedId = 'vanilla-next';
            nugetOutputDir = 'build/dev';
        } else {
            feedId = 'vanilla';
            getFeedId = 'vanilla';
            nugetOutputDir = 'build/dev';
        }

        const npmFeed = `https://artifactory.bwinparty.corp/artifactory/api/npm/bpty-npm-${feedId}`;
        const npmGetFeed = `https://artifactory.bwinparty.corp/artifactory/api/npm/npm-${getFeedId}`;
        const nugetFeed = `https://artifactory.bwinparty.corp/artifactory/api/nuget/bpty-nuget-${feedId}`;

        const hash = git.getHash();
        const revision = git.getRevisionNumber();
        const packageVersion = isPublicRelease ? this.packageJsonFile.version : `${this.packageJsonFile.version}-${next ? 'next' : 'build'}${revision}`;

        this.info = {
            hash,
            revision,
            npmFeed,
            npmGetFeed,
            nugetFeed,
            isPublicRelease,
            packageVersion,
            rebuild,
            nugetOutputDir,
            stealth
        };
    }

    private getCliParam<T>(name: string, defaultValue: T) {
        const param = args[name];
        if (param === undefined) {
            return defaultValue;
        }

        return param;
    }
}

export const buildInfo = new BuildInfo(packageJson);
