import * as gulp from 'gulp';
import { lintTs, lintGulp } from './lint';
import { test } from './test';

export const buildTsPackages = gulp.series('clean');

gulp.task('lint-test-build', gulp.parallel(lintTs, lintGulp, test, buildTsPackages));
