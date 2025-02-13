import * as gulp from 'gulp';
import tslint from 'gulp-tslint';
// import * as path from 'path';
import { Linter } from 'tslint';
// import { config } from '../config';
import { isTeamCity } from '../tools';

export function lintTs() {
    return gulp.src('src/app/**/*.ts')
        .pipe(tslint({
            formattersDirectory: 'aa', // NOTE: workaround for the new version of tslint - gulp-tslint sends null if this is undefined, and tslint checks for undefined strictly
            program: Linter.createProgram('tsconfig.json'),
            formatter: isTeamCity() ? 'tslint-teamcity-reporter' : 'prose'
        }))
        .pipe(tslint.report());
}

export function lintGulp() {
    return gulp.src(['gulp/**/*.ts'])
        .pipe(tslint({
            formattersDirectory: 'aa', // NOTE: workaround for the new version of tslint - gulp-tslint sends null if this is undefined, and tslint checks for undefined strictly
            program: Linter.createProgram('gulp/tsconfig.json'),
            formatter: isTeamCity() ? 'tslint-teamcity-reporter' : 'prose'
        }))
        .pipe(tslint.report());
}

gulp.task('lint', gulp.parallel(lintTs, lintGulp));
