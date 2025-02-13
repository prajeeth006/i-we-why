import * as path from 'path';
import * as log from 'fancy-log';

import { buildInfo } from './buildInfo';
import { execSync } from './execSync';

export class Npm {
    publish(packagePath: string) {
        const pkg = require(path.resolve(__dirname, '../../', packagePath, 'package.json'));

        try {
            const publishedVersions = JSON.parse(<string>execSync(`npm view ${pkg.name} versions --registry ${buildInfo.get(b => b.npmGetFeed)} --json`, { returnStdout: true }));
            if (publishedVersions.indexOf(pkg.version) !== -1) {
                log(`Not publishing version ${pkg.version} of ${pkg.name} because it is already published.`);
                return;
            }
        } catch (err) {
            if (err.toString().indexOf('code E404') === -1) {
                throw err;
            }
        }

        execSync(`npm publish ${packagePath} --registry ${buildInfo.get(b => b.npmFeed)}`);
    }
}

export const npm = new Npm;
