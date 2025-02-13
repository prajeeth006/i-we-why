import { execSync } from 'node:child_process';
import { lookup } from 'node:dns/promises';

function sortKeysFor(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((map, key) => {
            map[key] = obj[key];
            return map;
        }, {});
}

/**
 * Show the diff between the current and staged object - shallow comparison
 * @param {object} currentObject
 * @param {object} stagedObject
 */
function checkObjectDiff(currentObject = {}, stagedObject = {}) {
    const sortedCurrentObject = sortKeysFor(currentObject);
    const sortedStagedObject = sortKeysFor(stagedObject);
    return JSON.stringify(sortedCurrentObject) !== JSON.stringify(sortedStagedObject);
}

function getStagedPackageJson() {
    return JSON.parse(execSync('git show :package.json').toString());
}

function getCurrentPackageJson() {
    return JSON.parse(execSync('git show HEAD:package.json').toString());
}

function packageJsonChanged() {
    const packageJsonDiff = execSync('git diff --cached package.json').toString();
    if (!packageJsonDiff) {
        return false;
    }
    const stagedPackageObj = getStagedPackageJson();
    const currentPackageJson = getCurrentPackageJson();
    return (
        checkObjectDiff(currentPackageJson.dependencies, stagedPackageObj.dependencies) ||
        checkObjectDiff(currentPackageJson.devDependencies, stagedPackageObj.devDependencies)
    );
}

function yarnPatchesChanged() {
    return execSync('git diff --cached .yarn/patches').toString().trim() !== '';
}

function yarnLockChanged() {
    return (
        execSync('git diff --cached yarn.lock', { maxBuffer: 1024 * 1024 * 2 })
            .toString()
            .trim() !== ''
    );
}

async function canResolveGitlabDomain() {
    try {
        await lookup('vie.git.bwinparty.com');
        return true;
    } catch (err) {
        return false;
    }
}

try {
    if (packageJsonChanged() || yarnPatchesChanged()) {
        const isVpnOn = await canResolveGitlabDomain();
        if (isVpnOn) {
            execSync('yarn install --mode="update-lockfile"');
            execSync('git add yarn.lock');
            if (yarnLockChanged()) {
                console.warn(
                    '⚠️ yarn.lock has been updated with the "update-lockfile" mode. You might want to run `yarn` to ensure your packages are also up to date.',
                );
            }
        } else if (!yarnLockChanged()) {
            console.error('Error: package.json dependencies or devDependencies were modified but yarn.lock is not updated.');
            process.exit(1);
        }
    }

    process.exit(0);
} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
