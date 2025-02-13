import { CommitAction, CommitablePipelineStatus, CreateCommitOptions, Gitlab } from '@gitbeaker/rest';

const TARGET_BRANCH = 'main';

export type FileData = {
    path: string;
    data: string | null;
};

const NOT_FOUND_ERROR = 404;
const NETWORK_ERROR = -3008;

export async function createCommit(
    appName: string,
    gitlabApi: InstanceType<typeof Gitlab<false>>,
    projectId: number,
    sourceBranch: string,
    fileData: FileData[],
    msg: string,
    force: boolean = false,
) {
    await createBranchIfNotExists(gitlabApi, projectId, sourceBranch);

    // Check if file exists
    const aFilesAndPaths = fileData.map(async (fileInfo) => {
        const fileInBranch = await gitlabApi.RepositoryFiles.show(projectId, fileInfo.path, force ? TARGET_BRANCH : sourceBranch).catch((e) => {
            if (e.cause.response.status === NOT_FOUND_ERROR) {
                return null;
            }
            throw e;
        });

        return {
            ...fileInfo,
            fileExists: !(fileInBranch == null),
        };
    });

    const filesAndPaths = await Promise.all(aFilesAndPaths);

    const actions: CommitAction[] = filesAndPaths.map((value) => {
        if (value.data == null) {
            return {
                action: 'delete',
                filePath: value.path,
            };
        }

        return {
            action: value.fileExists ? 'update' : 'create',
            filePath: value.path,
            content: value.data,
        };
    });

    const opt: CreateCommitOptions = {};
    if (force) {
        opt.force = true;
        opt.startBranch = TARGET_BRANCH;
    }

    // Commit files
    const result = await gitlabApi.Commits.create(projectId, sourceBranch, `feat(${appName}): figma auto commit - ${msg}`, actions, {
        ...opt,
    });

    return result.id;
}

/**
 * It wraps with gitlab api and ensures no error is thrown in case the MR already exists
 * @param gitlabApi the gitlabAPI instance
 * @param projectId the gitlab project id
 * @param sourceBranch the name of the branch to be merged into TARGET_BRANCH
 * @param reviewerIds the ids of people that should be added as reviewers
 */
export async function createOrUpdateMr(
    appName: string,
    gitlabApi: InstanceType<typeof Gitlab<false>>,
    projectId: number,
    sourceBranch: string,
    reviewerIds?: number[] | undefined,
) {
    const findOpenMRs = await gitlabApi.MergeRequests.all({
        projectId: projectId,
        sourceBranch: sourceBranch,
        targetBranch: TARGET_BRANCH,
        state: 'opened',
    });

    let mrExists = false;

    if (findOpenMRs.length > 0) {
        mrExists = true;
    }

    if (!mrExists) {
        await gitlabApi.MergeRequests.create(projectId, sourceBranch, TARGET_BRANCH, `feat(${appName}): Apply Changes from Figma`, {
            removeSourceBranch: true,
            squash: true,
            reviewerIds: reviewerIds,
        });
    }
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function rebaseMergeRequest(gitlabApi: InstanceType<typeof Gitlab<false>>, projectId: number, sourceBranch: string) {
    const findOpenMRs = await gitlabApi.MergeRequests.all({
        projectId: projectId,
        sourceBranch: sourceBranch,
        targetBranch: TARGET_BRANCH,
        state: 'opened',
    });

    let mrExists = false;

    if (findOpenMRs.length > 0) {
        mrExists = true;
    }

    if (!mrExists) {
        return true;
    }

    const mrID = findOpenMRs[0].iid;
    await gitlabApi.MergeRequests.rebase(projectId, mrID);

    let inProgress = true;

    // Refetch until rebase is finished
    while (inProgress) {
        const resp = await gitlabApi.MergeRequests.show(projectId, mrID, { includeRebaseInProgress: true });
        inProgress = resp.rebase_in_progress ?? false;
        await delay(1000);
    }

    return true;
}

/**
 * It wraps with gitlab api and ensures no error is thrown in case the branch already exists
 * @param gitlabApi the gitlabAPI instance
 * @param projectId the gitlab project id
 * @param branchName the name of the branch to be deleted
 */
export async function createBranchIfNotExists(gitlabApi: InstanceType<typeof Gitlab<false>>, projectId: number, branchName: string) {
    const branch = await gitlabApi.Branches.show(projectId, branchName).catch((e) => {
        if (e.cause?.errno === NETWORK_ERROR) {
            throw Error('The address is not found, are you connected to the VPN?');
        }
        if (e.cause?.response?.status === NOT_FOUND_ERROR) {
            return null;
        }
        throw e;
    });

    // Create branch if it does not exist
    if (branch == null) {
        await gitlabApi.Branches.create(projectId, branchName, 'main');
    }
}

export async function getAllFiles(path: string, gitlabApi: InstanceType<typeof Gitlab<false>>, projectId: number, branchName: string = 'main') {
    const result = await gitlabApi.Repositories.allRepositoryTrees(projectId, {
        path: path,
        recursive: true,
        ref: branchName,
    }).then((data) => data.filter((fileOrFolder) => fileOrFolder.type === 'blob'));

    return await Promise.all(result.map(async (entry) => await gitlabApi.RepositoryFiles.show(projectId, entry.path, branchName)));
}

export async function getAllFilesWithoutContent(
    path: string,
    gitlabApi: InstanceType<typeof Gitlab<false>>,
    projectId: number,
    branchName: string = 'main',
) {
    const result = await gitlabApi.Repositories.allRepositoryTrees(projectId, {
        path: path,
        recursive: true,
        ref: branchName,
    }).then((data) => data.filter((fileOrFolder) => fileOrFolder.type === 'blob'));

    return result.map((entry) => entry.path);
}

export async function createComment(gitlabApi: InstanceType<typeof Gitlab<false>>, projectId: number, commitSha: string, message: string) {
    await gitlabApi.Commits.createComment(projectId, commitSha, message);
}

export async function setPipelineStatus(
    gitlabApi: InstanceType<typeof Gitlab<false>>,
    projectId: number,
    commitSha: string,
    state: CommitablePipelineStatus,
    message: string,
) {
    await gitlabApi.Commits.editStatus(projectId, commitSha, state, {
        description: message,
        context: 'Figma Pipeline',
    });
}
