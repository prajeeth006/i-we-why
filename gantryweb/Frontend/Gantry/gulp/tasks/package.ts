import * as gulp from 'gulp';
import * as path from 'path';
import * as log from 'fancy-log';
import * as fs from 'fs-extra';
import * as semver from 'semver';

import { config } from '../config';
import { buildInfo, npm, packageJson, git, spawnNgCli } from '../tools';

export function buildPackage() {
    return spawnNgCli('build promo');
}

function watchPackage() {
    return spawnNgCli('build promo', ['--watch']);
}

async function setVersion() {
    const version = buildInfo.get(b => b.packageVersion);
    const packages = `${config.v6Packages.join('|')}`;
    log.info(`Setting version to ${version}...`);
    const packagePath = path.join(config.v6ClientDist, packages, 'package.json');
    const data = fs.readJSONSync(packagePath);

    data.version = version;

    await fs.writeFile(packagePath, JSON.stringify(data, null, 2));
}

gulp.task('build-package', buildPackage);
gulp.task('watch-package', gulp.series(watchPackage));

gulp.task('publish', gulp.series(buildPackage, setVersion, async () => {
    git.guardNoLocalChanges();

    await npm.publish(config.v6ClientDist);

    if (buildInfo.get(b => b.isPublicRelease)) {
        const nextVersion = semver.inc(packageJson.version, 'minor');
        packageJson.writeVersion(nextVersion);

        git.tag(buildInfo.get(b => b.hash), buildInfo.get(b => b.packageVersion));
        git.commitAfterRelease();
    }
}));
