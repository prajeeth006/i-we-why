import * as path from 'path';
import * as _ from 'lodash';

import { Version, parseVersion } from './version';
import { config } from '../config';

const globby = require('globby');

/**
 * Gets version info of currently built packages.
 * Version info is a string with additional wildcard and nextWildcard properties.
 */
export function getVersionOfPackages(throwIfFileNotFound: boolean = true): Version {
    const files: string[] = globby.sync(path.join(config.nuget.packagesDir, '*.nupkg'));
    if (!files.length) {
        if (throwIfFileNotFound) {
            throw new Error(`No nuget packages for publishing have been found in "${config.nuget.packagesDir}"`);
        } else {
            return null;
        }
    }

    const versions = _.uniq(files.map(extractVersion));
    if (versions.length !== 1) {
        let conflict = versions.map(v => `"${v}"`).join(' vs. ');
        throw new Error(`Multiple package versions ${conflict} have been found within files in "${config.nuget.packagesDir}"`);
    }

    const version = versions[0];

    return parseVersion(version);
}

function extractVersion(filePath: string) {
    let name = path.basename(filePath, '.nupkg');
    let match = config.versionNumberRegex.exec(name);
    if (!match) {
        throw new Error('Nuget packages is missing version at the end: ' + filePath);
    }
    return match[0];
}
