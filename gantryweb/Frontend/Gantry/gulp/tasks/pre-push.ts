import * as gulp from 'gulp';

function hack(done: any) {
    delete process.env.node;
    delete process.env.home;
    done();
}

gulp.task('pre-push', gulp.series(hack, gulp.series('csproj-after-update-check', 'lint', 'test', 'build' )));
