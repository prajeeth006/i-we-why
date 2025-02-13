import * as gulp from 'gulp';
const contains = require('gulp-contains');

gulp.task('csproj-after-update-check', () => {
    let frontendIdx = __dirname.indexOf('Frontend');
    let path = __dirname.substr(0, frontendIdx);
    return gulp.src(path + 'Gantry/Gantry.Web.Host/Gantry.Web.Host.csproj')
        .pipe(contains(/<None Include="transform\.web\..*?\.config/gi));
});
