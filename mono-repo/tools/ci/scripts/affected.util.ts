import { readCachedProjectGraph, readProjectsConfigurationFromProjectGraph } from '@nx/devkit';

import util = require('util');

const exec = util.promisify(require('child_process').exec);

const cache: Record<string, string[]> = {};

export async function getAffectedProjects(baseSha: string, target?: string, excludeProjects?: string): Promise<string[]> {
    const cacheKey = `${target}${baseSha}`;

    if (!cache[cacheKey]) {
        const withTarget = target ? ` --with-target ${target}` : '';
        const exclude = excludeProjects ? ` --exclude ${excludeProjects}` : '';
        const affected = process.env['AFFECTED_ALL'] === 'true' || baseSha === undefined ? ' --all' : ` --affected --base ${baseSha}`;

        const command = `yarn nx show projects${withTarget}${exclude}${affected}`;

        const affectedProjectsStr = (await exec(command)).stdout.toString().trim();
        console.log(`Command '${command}' executed successfully`);

        cache[cacheKey] = affectedProjectsStr.split('\n').filter((prj: string) => prj !== '');
        return cache[cacheKey];
    }

    return Promise.resolve(cache[cacheKey]);
}

export async function getAffectedTags(affectedProjects: string[]): Promise<string[]> {
    const { projects } = readProjectsConfigurationFromProjectGraph(readCachedProjectGraph());
    const allAffectedTags = affectedProjects.reduce((acc: string[], affectedProjectName: string): string[] => {
        const { tags } = projects[affectedProjectName];
        return Array.isArray(tags) ? [...acc, ...tags] : acc;
    }, []);
    const affectedTagDistinct = new Set<string>(allAffectedTags);
    return Array.from(affectedTagDistinct);
}
