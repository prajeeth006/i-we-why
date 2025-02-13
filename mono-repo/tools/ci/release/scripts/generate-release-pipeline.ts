import { getReleasableProjectConfigs } from '@frontend/dev-kit';
import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { promises } from 'fs';
import { join } from 'path';

export async function generateReleasePipeline(dest: string) {
    const releasableTargets = (await getReleasableProjectConfigs())
        .map((p) =>
            Object.entries(p.targets ?? {})
                .filter(([, config]) => config.executor === '@frontend/nx-plugin:release')
                .map(([targetName]) => `${p.name}:${targetName}`),
        )
        .flat();
    const pipeline =
        `
include:
  - local: tools/ci/release/release.base.yml
  - local: tools/ci/release/release-backend.yml
  - local: tools/ci/release/payments/release.job.yml` + releasableTargets.map((target) => generateReleaseJob(target)).join('');

    console.log(`Generated ${dest}`);
    console.log(pipeline);

    await promises.writeFile(dest, pipeline);
}

function generateReleaseJob(target: string): string {
    return `
  - local: tools/ci/release/release.job.yml
    inputs:
      target: ${target}`;
}

const dest = join(getGeneratedArtifactsDistPath(), 'release-pipeline.yml');

generateReleasePipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
