import * as gulp from 'gulp';
import * as globby from 'globby';
import * as path from 'path';

import { config } from '../config';
import { angularJson } from '../tools';

gulp.task('sync-theme-entrypoints', async () => {
    const pattern = path.join(config.v6ClientRoot, 'styles/themes/**/', `(${config.themeEntryFiles.join('|')}).scss`);
    const themeFiles = await globby([pattern]);
    angularJson.content.projects.app.architect.build.options.styles = themeFiles.map((f: any) => {
        const bundlePath = path.relative(path.join(config.v6ClientRoot, 'styles'), f);
        return {
            input: f,
            bundleName: path.join(path.dirname(bundlePath), path.basename(bundlePath, '.scss')).replace(/\\/g, '/')
        };
    });

    angularJson.save();
});
