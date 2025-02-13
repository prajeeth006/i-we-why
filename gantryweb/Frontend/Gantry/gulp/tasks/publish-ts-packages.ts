import * as gulp from 'gulp';
import * as path from 'path';

import { npm } from '../tools';
import { config } from '../config';
import { setTsPackageVersion } from './build-ts';

async function publishToNpm() {
    await Promise.all(config.v6Packages.map((packageName: string) => {
        const packagePath = path.join(config.v6ClientDist, packageName);
        return npm.publish(packagePath);
    }));
}

gulp.task('publish-ts-packages', gulp.series(setTsPackageVersion, publishToNpm));