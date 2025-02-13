import { currentBranch, diffBaseSha, getGitLabApiClient, isMR, projectId, targetBranchSha } from '@frontend/gitlab-data-access';
import { execSync } from 'child_process';

export async function getAffectedBaseSha(): Promise<string> {
    if (isMR) {
        if (!targetBranchSha) {
            console.info(`MR: cannot get sha from env variable CI_MERGE_REQUEST_TARGET_BRANCH_SHA, use CI_MERGE_REQUEST_DIFF_BASE_SHA`);
            if (diffBaseSha) {
                return diffBaseSha;
            }
        }

        if (!targetBranchSha) {
            throw new Error('Environment variable CI_MERGE_REQUEST_TARGET_BRANCH_SHA not found!');
        }
        console.info(`MR: use target branch sha ${targetBranchSha}`);
        return targetBranchSha;
    }

    let baseSha: string | undefined;

    try {
        const gitLabApiClient = getGitLabApiClient(projectId);
        const response = await gitLabApiClient.fetchGitLabPipelines({ status: 'success', ref: currentBranch, per_page: 10 }).catch((e: unknown) => {
            console.error(e);
            return undefined;
        });
        console.info(response);

        const lastSuccessfullPipeline = response?.name?.toUpperCase().includes('MAIN') ? response : undefined;
        baseSha = lastSuccessfullPipeline?.sha;
        if (baseSha) {
            console.info(`MAIN: sha found for last successful build of for branch ${currentBranch}: ${baseSha}`);
        } else {
            console.info(`MAIN: No sha found for last successful build of branch ${currentBranch}, using commit HEAD~1`);
            baseSha = execSync(`git rev-parse HEAD~1`, { encoding: 'utf-8' });
        }
    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }

    return baseSha.trim();
}
