import { getOutputPath, getStorybookProjectConfigs } from '@frontend/dev-kit';
import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { ProjectConfiguration } from '@nx/devkit';
import { promises } from 'fs';
import { join } from 'path';

import { getAffectedProjects } from '../../scripts/affected.util';
import { getAffectedBaseSha } from '../../scripts/last-successful-sha.util';

type ChromaticProjectList = {
    [projectName: string]: {
        chromaticProjectTokenSuffix: string;
        additionalTracedPaths: string[];
    };
};

const chromaticProjectList: ChromaticProjectList = {
    'design-system-storybook-host-app': {
        chromaticProjectTokenSuffix: 'DS',
        additionalTracedPaths: [
            'packages/design-system/ui/**',
            'packages/design-system/shared-ds-utils/**',
            'packages/design-system/shared-storybook-utils/**',
        ],
    },
};

function generateChromaticJob(project: ProjectConfiguration): string {
    // If not in list, the job is not generated
    if (project.name == null || !(project.name in chromaticProjectList)) {
        return '';
    }
    const chromaticProject = chromaticProjectList[project.name];
    const additionalPaths = chromaticProject['additionalTracedPaths'].join('|');
    return `
  - local: tools/ci/chromatic/chromatic.job.yml
    inputs:
      project: ${project.name}
      projectPath: ${project.root}
      additionalTracedPaths: ${additionalPaths != '' ? "'|" + additionalPaths + "'" : "''"}
      chromaticProjectTokenSuffix: ${chromaticProject['chromaticProjectTokenSuffix']}
      artifactsPath: ${getOutputPath(project, 'build-storybook')}`;
}

export async function generateChromaticPipeline(dest: string) {
    const baseSha = await getAffectedBaseSha();
    const affectedProjects = await getAffectedProjects(baseSha);
    const storybookProjects = (await getStorybookProjectConfigs()).filter(({ name }) => name && affectedProjects.includes(name));

    let pipeline = '';

    const jobs = storybookProjects.map((x) => generateChromaticJob(x)).join('');

    if (jobs.length > 0) {
        pipeline =
            `
include:` + jobs;
    } else {
        const pipeline = `
stages:
  - chromatic
include:
  - local: tools/ci/common/fast-info-job.yml
    inputs:
      name: "no chromatic job to run"
      stage: chromatic
      echoMessage: "Nothing to see here..."
`;
        await promises.writeFile(dest, pipeline);
        return;
    }

    console.log(`Generated ${dest}`);
    console.log(pipeline);

    await promises.writeFile(dest, pipeline);
}

const dest = join(getGeneratedArtifactsDistPath(), 'chromatic-pipeline.yml');

generateChromaticPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
