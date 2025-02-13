import * as gulp from 'gulp';
import * as del from 'del';
import * as path from 'path';

import { config } from '../config';

const DGENI_ROOT = path.join(config.baseDir, config.tools.dgeni);
const VANILLA_DOCS_PACKAGE = path.join(DGENI_ROOT, 'vanilla-docs-package');

const OUTPUT_DIR = path.resolve(config.baseDir, config.v6ClientDocsDist);

function cleanDocs() {
    return del([OUTPUT_DIR]);
}

function apiDocs() {
    const Dgeni = require('dgeni');
    const vanillaDocsPackage = require(VANILLA_DOCS_PACKAGE);
    const dgeni = new Dgeni([vanillaDocsPackage]);
    return dgeni.generate();
}

gulp.task('docs', gulp.series(cleanDocs, apiDocs));

gulp.task('watch-docs', gulp.series(apiDocs, () => {
    gulp.watch(path.join(config.v6ClientRoot, '**/*.ts'), apiDocs);
    gulp.watch(path.join(config.baseDir, config.v6ClientDocsContent, '**/*.md'), apiDocs);
}));
