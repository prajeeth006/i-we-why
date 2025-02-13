import { execSync } from 'child_process';

export function getDiffBetweenBranches(targetBranch: string, sourceBranch: string): string[] {
    return execSync(`git diff --name-only origin/${targetBranch}...origin/${sourceBranch}`)
        .toString()
        .split(/\r?\n/)
        .filter((f) => f.length > 0);
}

export function getDiffBySha(shortSha: string): string[] {
    return execSync(`git diff --name-only ${shortSha}`)
        .toString()
        .split(/\r?\n/)
        .filter((p) => p.length);
}
