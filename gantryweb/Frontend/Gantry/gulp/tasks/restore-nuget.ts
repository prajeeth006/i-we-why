import * as gulp from 'gulp';

import { execNuget } from '../tools';

gulp.task('restore-nuget', () => {
    execNuget('restore Bwin.MobilePromo.sln -Source https://artifactory.bwinparty.corp/artifactory/api/nuget/nuget-internal');
});
