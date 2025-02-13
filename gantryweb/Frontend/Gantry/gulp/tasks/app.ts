import * as gulp from 'gulp';
import { join } from 'path';

import { spawnNgCli, spawn, buildInfo } from '../tools';
import { config } from '../config';

function buildApp(options?: { prod?: boolean, ivy?: boolean, stats?: boolean, library?: string }) {
    options = options || {};
    const args: string[] = [];

    if (options.library) {
        args.push(options.library);
    }

    if (options.prod) {
        args.push('--configuration');
        args.push('production');
    }

    if (options.ivy) {
        args.push('--c');
        args.push('ivy');
    }

    if (options.stats) {
        args.push('--stats-json');
    }

    return spawnNgCli('build', args);
}

export function buildAppDev() { return buildApp(); }
export function buildAppProd() { return buildApp({ prod: true }); }
export function buildLibrary(library: string) { return buildApp({ prod: true, library: library }); }
export function serveApp() { return spawnNgCli('serve'); }

function analyzeStats() {
    return spawn('webpack-bundle-analyzer', [join(config.clientProdDir, 'stats.json')]);
}

gulp.task('build', () => {
    let libIndex = process.argv.lastIndexOf('--lib');
    if (buildInfo.get(b => b.isPublicRelease) && libIndex === -1) {
        return buildAppProd();
    } else if (libIndex > 0) {
        return buildLibrary(process.argv[libIndex + 1]);
    } else {
        return buildAppDev();
    }
});

gulp.task('serve', serveApp);
gulp.task('analyze', analyzeStats);
