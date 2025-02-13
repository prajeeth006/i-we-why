import { getDsAdoptionProjects } from '@frontend/dev-kit';
import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { promises } from 'fs';
import { join } from 'path';

import { getAffectedProjects } from '../../scripts/affected.util';
import { getAffectedBaseSha } from '../../scripts/last-successful-sha.util';

export async function generateCpuReportPipeline(dest: string) {
    const baseSha = await getAffectedBaseSha();
    const affectedProjects = await getAffectedProjects(baseSha);
    const dsAdoptedProjects = (await getDsAdoptionProjects()).filter((name) => name && affectedProjects.includes(name));
    let pipeline = '';
    if (!dsAdoptedProjects.length) {
        pipeline = `
stages:
  - code-pushup
include:
  - local: tools/ci/common/fast-info-job.yml
    inputs:
      name: "no cpu report to show"
      stage: code-pushup
      echoMessage: "Nothing to see here..."
`;
        await promises.writeFile(dest, pipeline);
        return;
    } else {
        pipeline += `
include:
  - local: tools/ci/code-pushup/ds-adoption-cpu-report.yml
    inputs:
      projects: ${formatProjects(dsAdoptedProjects)}`;
    }

    console.log(`Generated ${dest}`);
    console.log(pipeline);

    await promises.writeFile(dest, pipeline);
}

function formatProjects(projects: string[]): string {
    return `${projects.map((project) => `${project}`).join(' ')}`;
}

const dest = join(getGeneratedArtifactsDistPath(), 'cpu-report-pipeline.yml');

generateCpuReportPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
