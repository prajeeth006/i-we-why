import * as gulp from 'gulp';

import { execMsBuild } from '../tools/execMsBuild';

gulp.task('msbuild', () => {

});

function msbuild(){
    let args = require('minimist')(process.argv.slice(2));
    return execMsBuild(args.target || 'Bpty_Build');
}
// alias
gulp.task('build-binaries', gulp.series(msbuild));
