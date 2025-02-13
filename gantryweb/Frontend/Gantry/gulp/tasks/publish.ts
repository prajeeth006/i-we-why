import * as gulp from 'gulp';
import * as semver from 'semver';

import { git, packageJson, buildInfo } from '../tools';

const publishPackages = gulp.series('publish-nuget-packages', 'publish-ts-packages');

gulp.task('publish-ts', gulp.series(publishPackages, async () => {
    const version = buildInfo.get(b => b.packageVersion);
    const nextVersion = semver.inc(packageJson.version, 'minor');

    if (buildInfo.get(b => b.isPublicRelease) && !buildInfo.get(b => b.stealth)) {
        packageJson.writeVersion(nextVersion);
        git.tag(buildInfo.get(b => b.hash), version);
    }
}));
