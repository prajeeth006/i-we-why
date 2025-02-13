import * as gulp from 'gulp';
import * as path from 'path';

import { buildInfo, npm, spawnNgCli } from '../tools';
import { config } from '../config';

const jsonTransform = require('gulp-json-transform');

export function buildPromoTs() {
    return spawnNgCli('build promo');
}

async function publishTs() {
    await Promise.all(config.v6Packages.map((packageName: string) => {
        const packagePath = path.join(config.v6ClientDist, packageName);
        return npm.publish(packagePath);
    }));
}

export function setTsPackageVersion() {
    const packages = `@(${config.v6Packages.join('|')})`;
    const pkgJson = [
        path.join(config.v6ClientDist, packages, 'package.json')
    ];
    const packageNames = config.v6Packages.map(p => `@frontend/${p}`);
    const pkg = require(path.resolve(__dirname, '../../package.json'));

    return gulp.src(pkgJson, { base: config.v6ClientDist })
        .pipe(jsonTransform((data: any) => {
            data.version = buildInfo.get(b => b.packageVersion);
            Object.keys(data.peerDependencies).filter(d => packageNames.indexOf(d) !== -1).forEach(d => {
                data.peerDependencies[d] = buildInfo.get(b => b.packageVersion);
            });

            Object.keys(data.peerDependencies).forEach(d => {
                let mainPkgVersion = pkg.devDependencies[d];
                if (mainPkgVersion) {
                    data.peerDependencies[d] = mainPkgVersion;
                }
            });

            return JSON.stringify(data, null, 2);
        }))
        .pipe(gulp.dest(config.v6ClientDist));
}

gulp.task('build-ts', gulp.series(buildPromoTs));

gulp.task('build-ts-packages', gulp.series(buildPromoTs, setTsPackageVersion, publishTs));

gulp.task('publish', () => {
    if (buildInfo.get(b => b.rebuild)) {
        return gulp.task('publish-ts-packages', gulp.series(buildPromoTs, setTsPackageVersion, publishTs));
    } else {
        return gulp.task('publish-ts-packages', gulp.series(setTsPackageVersion, publishTs));
    }
});
