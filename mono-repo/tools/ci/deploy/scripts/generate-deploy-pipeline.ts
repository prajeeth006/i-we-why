import { getOutputPath, getProjectsFromGraph, getStorybookProjectConfigs } from '@frontend/dev-kit';
import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { ProjectConfiguration } from '@nx/devkit';
import { promises } from 'fs';
import { join } from 'path';

import { generateCdnPipelineYaml, getCdnProjects } from '../../cdn/scripts/cdn.config';
import { REVIEW_CONFIG, generateReviewJobs } from '../../review/scripts/review.config';
import { getAffectedProjects } from '../../scripts/affected.util';
import { getAffectedBaseSha } from '../../scripts/last-successful-sha.util';

function filterAffectedProjects(getDeployableProjectConfigs: string[], projectProjectConfigs: ProjectConfiguration[]): ProjectConfiguration[] {
    return projectProjectConfigs.filter(({ name }) => name && getDeployableProjectConfigs.includes(name));
}

export async function generateDeployPipeline(dest: string) {
    const allProjects = Object.values(await getProjectsFromGraph());
    const baseSha = await getAffectedBaseSha();
    const a = await getAffectedProjects(baseSha);
    const affectedProjects = filterAffectedProjects(a, allProjects);
    const cdnProjects = getCdnProjects(affectedProjects);
    const reviewProjects = Object.keys(REVIEW_CONFIG).filter((k) =>
        affectedProjects.some((p) => REVIEW_CONFIG[k].backendApp.name === p.name || (p.name && REVIEW_CONFIG[k].clientApp?.names.includes(p.name))),
    );
    const storybookProjects = filterAffectedProjects(a, await getStorybookProjectConfigs());

    if (cdnProjects.length + reviewProjects.length + storybookProjects.length === 0) {
        const pipeline = `
include:
  - local: tools/ci/common/fast-info-job.yml
    inputs:
      name: "no apps to deploy"
      stage: deploy
      echoMessage: "Nothing to deploy here..."
`;

        await promises.writeFile(dest, pipeline);
        return;
    }

    let pipeline =
        `
include:
  - local: tools/ci/deploy/deploy.base.yml` + generateCdnPipelineYaml(cdnProjects, { includeBuild: false });

    if (reviewProjects.length) {
        pipeline +=
            `
  - local: tools/ci/review/review.base.yml` +
            reviewProjects.map((project) => generateReviewJobs(project, allProjects, { autoDeployEnabled: true })).join('');
    }

    if (storybookProjects.length) {
        pipeline +=
            `
  - local: tools/ci/deploy/storybook-deploy.base.yml` + storybookProjects.map((project) => generateStorybookDeployJobs(project)).join('');
    }
    console.log(`Generated ${dest}`);
    console.log(pipeline);

    await promises.writeFile(dest, pipeline);
}

function generateStorybookDeployJobs(project: ProjectConfiguration): string {
    return `
  - local: tools/ci/deploy/storybook-deploy.job.yml
    inputs:
      project: ${project.name}
      deploy-suffix: ${project.name == 'design-system-storybook-host-app' ? "''" : `'-${project.name}'`}
      artifactsPath: ${getOutputPath(project, 'build-storybook')}`;
}

const dest = join(getGeneratedArtifactsDistPath(), 'deploy-pipeline.yml');

generateDeployPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
