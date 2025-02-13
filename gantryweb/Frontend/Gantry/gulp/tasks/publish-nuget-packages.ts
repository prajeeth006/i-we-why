import * as gulp from 'gulp';
import { config } from '../config';
import { execNuget } from '../tools/execNuget';
const tap = require('gulp-tap');

gulp.task('publish-nuget-packages', () => {
    return gulp.src(config.nugetPackages)
        .pipe(tap((file: any) => {
            execNuget(`push "${file.path}" -source ${config.nugetSource}`);
        }));
});