import * as gulp from 'gulp';
import * as del from 'del';

import { config } from '../config';


function cleanBin() {
    return del(['*/bin', '*/obj', 'build']);
}

function cleanTsTemp() {
    return del([config.v6ClientTemp]);
}

export function cleanTs() {
    return del([config.v6ClientDist]);
}

export function clean(){
    return gulp.parallel(cleanTs, gulp.series(cleanBin, cleanTsTemp));
}

gulp.task('clean', gulp.parallel(cleanTs, gulp.series(cleanBin, cleanTsTemp)));
