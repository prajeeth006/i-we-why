import * as gulp from 'gulp';
import { config } from '../config';
import { karma } from '../tools';

function karmaServer(){
    karma.start(config.karmaTypescriptConfigFile, { watch: true }).then();
}

gulp.task('debug-test-ts', gulp.series(karmaServer));
