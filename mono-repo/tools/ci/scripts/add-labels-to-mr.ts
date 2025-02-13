import { getGitLabApiClient } from '@frontend/gitlab-data-access';
import { mergeRequestId, projectId } from '@frontend/gitlab-data-access';
import { readFileSync } from 'fs-extra';
import { minimatch } from 'minimatch';
import { EOL } from 'os';

function parseOwners(content: string) {
    const lines = content.split(EOL).filter((l) => l.length > 0 && !l.startsWith('#')); // remove empty lines and comments
    const groupRegex = /\[(.*?)\]/;

    const owners = new Map<string, string[]>();
    let currentGroup = '';

    for (const line of lines) {
        const groupMatch = groupRegex.exec(line);
        if (groupMatch) {
            currentGroup = groupMatch[1];
            owners.set(currentGroup, []);
        } else if (currentGroup) {
            owners.get(currentGroup)!.push(line.trim());
        }
    }

    return owners;
}

function getAffectedOwners(changedFiles: string[], owners: Map<string, string[]>): string[] {
    const affectedOwners = new Set<string>();
    for (const [ownerName, ownerPatterns] of owners) {
        for (const pattern of ownerPatterns) {
            const matches = minimatch.match(changedFiles, pattern.endsWith('/') ? `${pattern}/**` : pattern);
            if (matches.length > 0) {
                affectedOwners.add(ownerName);
                break;
            }
        }
    }

    return Array.from(affectedOwners);
}

export async function addLabelsToMR(): Promise<void> {
    if (!mergeRequestId) {
        console.log(`This script cannot be used outside of a merge request`);
        return;
    }

    const gitLabApiClient = getGitLabApiClient(projectId);
    let page = 1;
    let mergeRequestsFileDiffs = [];
    while (true) {
        const diffs = await gitLabApiClient.getGitLabMergeRequestFileDiffs(mergeRequestId, page);
        if (diffs.length === 0) break;

        mergeRequestsFileDiffs.push(...diffs);
        page++;
    }

    const changedFiles = [...new Set(mergeRequestsFileDiffs.flatMap((change) => [change.new_path, change.old_path]).map((f) => `/${f}`))];
    console.log(`Merge request ${mergeRequestId} contains following diff: ${changedFiles}.`);
    const ownersRawContent = readFileSync('./CODEOWNERS').toString();
    const owners = parseOwners(ownersRawContent);
    const labelPrefix = 'scope:';
    const affectedOwners = getAffectedOwners(changedFiles, owners).map((a) => `${labelPrefix}${a}`);

    try {
        const currentMr = await gitLabApiClient.getMergeRequest(mergeRequestId);
        await gitLabApiClient.updateGitLabMergeRequest({
            id: mergeRequestId,
            add_labels: affectedOwners.join(','),
            remove_labels: currentMr.labels.filter((l) => l.startsWith(labelPrefix) && !affectedOwners.includes(l)).join(','),
        });
        console.log(`Added labels ${affectedOwners} to merge request ${mergeRequestId}`);
    } catch (e) {
        console.error(e);
        return Promise.reject(e);
    }
}

addLabelsToMR()
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
