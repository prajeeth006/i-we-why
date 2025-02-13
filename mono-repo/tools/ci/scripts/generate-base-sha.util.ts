import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { existsSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';

import { getAffectedBaseSha } from './last-successful-sha.util';

const dest = join(getGeneratedArtifactsDistPath(), 'base-sha.txt');

getAffectedBaseSha().then((baseSha) => {
    try {
        if (existsSync(dest)) {
            console.log(`Remove file ${dest}`);
            rmSync(dest, { force: true });
        }

        console.log(`Write ${dest} with ${baseSha}`);
        writeFileSync(dest, baseSha, { encoding: 'utf8' });

        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
});
