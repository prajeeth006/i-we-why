import * as gulp from 'gulp';
import * as path from 'path';
import * as newer from 'gulp-newer';

import { config } from '../config';

gulp.task('copy-ts-package-files', () => {
    const packages = `@(${config.v6Packages.join('|')})`;
    const pkgJson = path.join(config.v6ClientRoot, packages, 'package.json');

    return gulp.src(pkgJson)
        .pipe(newer({
            dest: config.v6ClientDist
        }))
        .pipe(gulp.dest(config.v6ClientDist));
});
