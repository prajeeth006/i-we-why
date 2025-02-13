import { getProjectsFromGraph } from '@frontend/dev-kit';
import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { promises } from 'fs';
import { join } from 'path';

import { generateCdnPipelineYaml, getCdnProjects } from './cdn.config';

export async function generateCdnPipeline(dest: string) {
    const allProjects = Object.values(await getProjectsFromGraph());
    const cdnProjects = getCdnProjects(allProjects);
    const yaml =
        `
include:
  - local: tools/ci/cdn/cdn.base.yml` + generateCdnPipelineYaml(cdnProjects, { includeBuild: true });

    console.log(`Generated ${dest}`);
    console.log(yaml);

    await promises.writeFile(dest, yaml);
}

const dest = join(getGeneratedArtifactsDistPath(), 'cdn-pipeline.yml');

generateCdnPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
