import { createProjectGraphAsync, readProjectsConfigurationFromProjectGraph } from '@nx/devkit';
import fs from 'node:fs/promises';

const graph = await createProjectGraphAsync({ exitOnError: true });
const projects = Object.values(readProjectsConfigurationFromProjectGraph(graph).projects)
    .filter((project) => 'lint' in (project.targets ?? {}))
    .sort((a, b) => a.root.localeCompare(b.root));

for (let i = 0; i < projects.length; i++) {
    const project = projects[i];
    console.log('Running for ', project.name);

    const codePushUpConfigPath = `${project.root}/code-pushup.config.ts`;

    const codePushUpConfigPathExists = await fs
        .access(codePushUpConfigPath, fs.constants.F_OK)
        .then(() => true)
        .catch(() => false);

    const hasCodePushUpTarget = 'code-pushup' in project.targets;

    if (!hasCodePushUpTarget) {
        const projectJson = `${project.root}/project.json`;
        const projectData = JSON.parse(await fs.readFile(projectJson, 'utf-8'));
        projectData['targets'] ??= {};
        projectData['targets']['code-pushup'] = {
            executor: 'nx:run-commands',
            options: {
                commands: [`npx @code-pushup/cli --config=${project.root}/code-pushup.config.ts --tsconfig=tsconfig.base.json --progress=false`],
            },
        };
        await fs.writeFile(projectJson, JSON.stringify(projectData, undefined, 4), 'utf-8');
    }

    const fileData = `
import { cpDefaultConfig, mergeConfigs } from '@frontend/code-pushup-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/${project.name}',
            format: ['json', 'md'],
        },
    },
    await cpDefaultConfig({ nxProjectName: '${project.name}' }),
);
`;

    if (!codePushUpConfigPathExists) {
        await fs.writeFile(codePushUpConfigPath, fileData.trim(), 'utf-8');
    }
}

process.exit(0);
