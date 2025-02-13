import * as gulp from 'gulp';
import { spawnNgCli } from '../tools';

export function test() {
    const browser = 'NoSandboxHeadlessChrome';
    return spawnNgCli('test', ['--watch=false', '--source-map=false', '--code-coverage', `--browsers=${browser}`]);
}

export function debugTest() {
    const browser = 'Chrome';
    return spawnNgCli('test', ['--watch=true', '--code-coverage', `--browsers=${browser}`]);
}

gulp.task('test', gulp.series(test));

gulp.task('debug-test', gulp.series(debugTest));
