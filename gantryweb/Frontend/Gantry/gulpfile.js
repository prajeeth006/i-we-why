'use strict';
/**
 * Load the TypeScript compiler, then load the TypeScript gulpfile which simply loads all
 * the tasks. The tasks are really inside tools/gulp/tasks.
 */

const globby = require('globby');
const gutil = require('gulp-util');
const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

var sourceFiles = globby.sync(['gulp/**/*.ts']);
var requiresRecompilation = false;
for (const sourceFile of sourceFiles) {
    const relativePath = path.relative(path.join(__dirname, 'gulp'), sourceFile);
    const compiledFile = path.join(__dirname, 'gulp-compiled', path.dirname(relativePath), path.basename(relativePath, '.ts') + '.js');
    if (!fs.existsSync(compiledFile)) {
        requiresRecompilation = true;
        break;
    }

    const sourceTime = new Date(fs.lstatSync(sourceFile).mtime);
    const compiledTime = new Date(fs.lstatSync(compiledFile).mtime);

    if (sourceTime > compiledTime) {
        requiresRecompilation = true;
        break;
    }
}

if (requiresRecompilation) {
    gutil.log('Detected changes in gulp TypeScript source, recompiling...');
    execSync(path.join(__dirname, 'node_modules/.bin/tsc'), { cwd : 'gulp', stdio: 'inherit' });
    gutil.log('Compilation completed.');
}

require('./gulp-compiled/gulpfile');
