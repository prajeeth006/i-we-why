import * as gulp from 'gulp';
import { buildTsPackages } from './build-ts-packages';

gulp.task('build-packages', gulp.series(buildTsPackages));
