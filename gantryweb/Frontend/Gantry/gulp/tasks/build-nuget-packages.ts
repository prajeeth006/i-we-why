import * as gulp from 'gulp';

import { execMsBuild } from '../tools/execMsBuild';

export function buildNuget() {
    return execMsBuild('BuildNuget');
}

// alias
gulp.task('build-nuget', gulp.series(buildNuget));