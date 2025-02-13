import * as gulp from 'gulp';
import { serveApp } from './app';

gulp.task('dev', gulp.series(serveApp));
