import * as gulp from 'gulp';
import * as path from 'path';
import * as htmlMinifier from 'html-minifier';
import * as runSequence from 'run-sequence';

import { config } from '../config';

const embedTemplates = require('gulp-inline-ng2-template');
const ngc = require('gulp-ngc');

gulp.task('inline-templates', () => {
    return gulp.src(path.join(config.v6ClientRoot, '**/*.ts'))
        .pipe(embedTemplates({
            base: config.v6ClientRoot,
            useRelativePaths: true,
            removeLineBreaks: true,
            templateProcessor: (_path: any, _ext: any, file: any, cb: any) => {
                try {
                    let minifiedFile = htmlMinifier.minify(file, {
                        collapseWhitespace: true,
                        caseSensitive: true,
                        removeComments: true,
                        removeRedundantAttributes: true
                    });

                    cb(null, minifiedFile);
                }
                catch (err) {
                    cb(err);
                }
            }
        }))
        .pipe(gulp.dest(config.v6ClientTemp));
});

gulp.task('compile-ts-ngc', () => {
    const tsConfigPath = path.join(config.v6ClientRoot, 'tsconfig.ngc.json');

    return ngc(tsConfigPath);
});

gulp.task('compile-ts', (done: any) => {
    return runSequence('inline-templates', 'compile-ts-ngc', 'clean-ts-temp', done);
});
