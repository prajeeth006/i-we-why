import * as path from 'path';
import * as fs from 'fs';
import * as log from 'fancy-log';

import { execSync as exec } from './process';

class Git {
    commitAfterRelease() {
        let branch = exec('git rev-parse --abbrev-ref HEAD', { returnStdout: true });
        exec(`git add --all "${this.getRepositoryRootDir()}"`);
        exec(`git commit -m "B-000000 Updated package.json and GlobalAssemblyInfo.cs after the release"`);
        exec(`git pull --rebase origin ${branch}`); // Merge if there were changes in the meantime
        exec(`git push origin ${branch}`);
    }

    guardNoLocalChanges() {
        const REASON = 'To avoid deploying broken or works-on-my-machine artifacts, please commit, push and then try again.';

        let uncommittedChanges = exec('git status --porcelain', { returnStdout: true });
        if (uncommittedChanges) {
            log('Local changes');
            log(uncommittedChanges);
            throw new Error(`Uncommitted local changes (see above) detected. ${REASON}`);
        }

        exec('git fetch origin'); // Fetch to know up-to-date server info
        const COMMIT_COUNT = 30;
        let currentBranch = exec('git rev-parse --abbrev-ref HEAD', { returnStdout: true });
        let localCommit = exec(`git rev-parse ${currentBranch}`, { returnStdout: true }) as string;
        let remoteCommits = (exec(`git log origin/${currentBranch} --max-count=${COMMIT_COUNT} --pretty=%H`, { returnStdout: true }) as string)
            .split('\n').map(c => c.trim()).filter(c => c);

        if (remoteCommits.indexOf(localCommit) === -1) {
            log(`Last ${COMMIT_COUNT} remote commits:`);
            log(remoteCommits);
            throw new Error(`Changes are not pushed to the server. Local commit ${localCommit} on branch ${currentBranch} was not found within remote ones (see above). ${REASON}`);
        }
    }

    tag(hash: string, version: string) {
        log(`Adding tag "${version}" to commit "${hash}"`);
        exec(`git tag ${version} ${hash}`);
        exec(`git push origin --tags`);
    }

    getRevisionNumber() {
        return exec('git rev-list --count HEAD', { returnStdout: true }) as string;
    }

    getHash() {
        return exec('git rev-parse --short HEAD', { returnStdout: true }) as string;
    }

    private getRepositoryRootDir() {
        let dir = path.resolve('.');
        while (!fs.existsSync(path.join(dir, '.git'))) {
            dir = path.dirname(dir);
        }
        return dir;
    }
}

export const git = new Git();
