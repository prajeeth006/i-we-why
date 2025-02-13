import { getProjectsFromGraph } from '@frontend/dev-kit';
import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { promises } from 'fs';
import { join } from 'path';

import { REVIEW_CONFIG, generateReviewJobs } from './review.config';

const PIPELINE_TYPE = process.env['CHILD_PIPELINE_TYPE'];

export async function generateReviewPipeline(dest: string) {
    const allProjects = Object.values(await getProjectsFromGraph());
    const pipeline =
        `
include:
  - local: tools/ci/review/${PIPELINE_TYPE}.base.yml` +
        Object.keys(REVIEW_CONFIG)
            .map((project) => generateReviewJobs(project, allProjects, { autoDeployEnabled: false }))
            .join('');

    console.log(`Generated ${dest}`);
    console.log(pipeline);
    await promises.writeFile(dest, pipeline);
}

const dest = join(getGeneratedArtifactsDistPath(), `${PIPELINE_TYPE}-pipeline.yml`);

generateReviewPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
