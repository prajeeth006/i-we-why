import * as gulp from 'gulp';
import * as semver from 'semver';

import { packageJson } from '../tools';
import { args } from '../config';

gulp.task('bump', (done) => {
    const version = args.increment;

    let newVersion = semver.inc(packageJson.version, version);

    if (!newVersion) {
        throw new Error(`Invalid version ${version}. Specify correct semver version with '-v <version>'.`);
    }

    packageJson.writeVersion(newVersion);

    done();
});
