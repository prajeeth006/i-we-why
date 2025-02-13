import { getOutputPath, getProjectsFromGraph } from '@frontend/dev-kit';
import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { ProjectConfiguration } from '@nx/devkit';
import { promises } from 'fs';
import { join } from 'path';

import { baseE2EJobMap } from '../constants';

function getBaseE2EJob(appName?: string) {
    return appName && appName in baseE2EJobMap ? baseE2EJobMap[appName] : '.e2e';
}

export async function generateE2EPipeline(dest: string) {
    const e2eProjects = Object.values(await getProjectsFromGraph()).filter((p): p is ProjectConfiguration => !!p.targets?.['e2e']);

    const PROJECT_OUTPUTS = e2eProjects.map((p) => getOutputPath(p, 'e2e'));

    const pipeline =
        `
include:
- local: tools/ci/e2e/e2e.base.yml
- tools/ci/common/node-module-cache.tpl.yml
` +
        e2eProjects.map((project) => generateE2EJob(project)).join('') +
        `
merge-reports:
  stage: reports
  when: always
  needs:
${e2eProjects
    .map(
        (project) => `    - job: e2e-${project.name}
      artifacts: true`,
    )
    .join('\n')}
  extends:
    - .e2e-merge-reports-multi-project
  variables:
    PROJECT_OUTPUTS: ${PROJECT_OUTPUTS}
`;

    console.log(`Generated ${dest}`);
    console.log(pipeline);

    await promises.writeFile(dest, pipeline);
}

function generateE2EJob(project: ProjectConfiguration): string {
    const outputDir = getOutputPath(project, 'e2e');

    return `
e2e-${project.name}:
  stage: e2e
  extends:
    - ${getBaseE2EJob(project.name)}
    - .rules-manual
  allow_failure: true
  variables:
    APP: ${project.name}
    OUTPUT_DIR: ${outputDir}
    PW_PROJECT: ""
    BASE_URL: ""
`;
}

const dest = join(getGeneratedArtifactsDistPath(), 'e2e-pipeline.yml');

generateE2EPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
