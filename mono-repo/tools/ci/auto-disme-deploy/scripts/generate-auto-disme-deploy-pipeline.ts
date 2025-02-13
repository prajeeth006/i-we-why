import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { promises } from 'fs';
import { join } from 'path';

import { dotnetProjectsOptions, generateDotnetProject } from '../../disme/scripts/generate-disme-pipeline';

const PROJECT_NAME = process.env['AUTO_DISME_DEPLOY_PROJECT'];
const SHORTCUT = process.env['AUTO_DISME_DEPLOY_SHORTCUT'];
const ENVIRONMENT = process.env['AUTO_DISME_DEPLOY_ENVIRONMENT'];
const SERVERS = process.env['AUTO_DISME_DEPLOY_SERVERS'];

const dest = join(getGeneratedArtifactsDistPath(), 'auto-disme-deploy-pipeline.yml');

async function generateAutoDismeDeployPipeline(dest: string) {
    if (!PROJECT_NAME || (PROJECT_NAME && !(PROJECT_NAME in dotnetProjectsOptions))) {
        throw new Error(`Could not find project name ${PROJECT_NAME} in dotnet projects.`);
    }
    const project = {
        ...dotnetProjectsOptions[PROJECT_NAME],
        dismeShortcut: SHORTCUT ?? dotnetProjectsOptions[PROJECT_NAME].dismeShortcut,
        dismeEnvironment: ENVIRONMENT ?? dotnetProjectsOptions[PROJECT_NAME].dismeEnvironment,
        dismeServers: SERVERS?.split(','),
    };

    const pipeline =
        `
include:
  - local: tools/ci/disme/disme.dotnet.base.yml
` + generateDotnetProject(PROJECT_NAME, project, true);

    console.log(`Generated ${dest}`);
    console.log(pipeline);
    await promises.writeFile(dest, pipeline);
}

generateAutoDismeDeployPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
