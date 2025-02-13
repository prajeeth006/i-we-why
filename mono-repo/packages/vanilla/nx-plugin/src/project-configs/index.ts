import { CreateNodesFunction } from '@nx/devkit';
import { dirname } from 'path';

export const createSecondaryEntryPointsProjectConfiguration: CreateNodesFunction = (configFilePath) => {
    const projectName = toProjectName(configFilePath);
    const projectRoot = dirname(configFilePath);

    return {
        projects: {
            [projectName]: {
                name: projectName,
                root: projectRoot,
                sourceRoot: projectRoot,
                projectType: 'library',
                tags: ['scope:vanilla', `type:feature`],
                targets: {},
            },
        },
    };
};

function toProjectName(configFilePath: string): string {
    return configFilePath.replace('/features', '').split('/').slice(1, -1).concat('feature').join('-');
}
