import * as gulp from 'gulp';

import { config } from '../config';
import { isTeamCity } from '../tools';

const nunit = require('gulp-nunit-runner');

gulp.task('nunit', () => {
    return gulp.src(config.nunitAssemblies, { read: false })
        .pipe(nunit({
            executable: config.nunitExecutable,
            options: {
                teamcity: isTeamCity(),
                result: 'TestResult.xml',
                where: 'cat != Integration'
            }
        }));
});
