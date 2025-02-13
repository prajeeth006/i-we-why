import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { promises } from 'fs';
import { join } from 'path';

const FORTIFY_CONFIG: Record<string, string> = {
    'bingo': 'backend/bingo/Fortify.proj',
    'host-app': 'backend/host-app/Fortify.proj',
    'mokabingo': 'backend/mokabingo/Fortify.proj',
    'lottery': 'backend/lottery/Fortify.proj',
    'promo': 'backend/promo/Fortify.proj',
    'poker': 'backend/poker/Fortify.proj',
    'myaccount': 'backend/myaccount/Fortify.proj',
    'virtualsports': 'backend/virtualsports/Fortify.proj',
    'casino': 'backend/casino/Fortify.proj',
    'dice': 'backend/casino/Fortify.Dice.proj',
    'horseracing': 'backend/horseracing/Fortify.proj',
    'sf-api': 'backend/vanilla/Frontend.SharedFeatures.Api.Fortify.proj',
    'device-atlas-api': 'backend/vanilla/Frontend.DeviceAtlas.Api.Fortify.proj',
    'sports': 'backend/sports/Fortify.proj',
    'oxygen': 'backend/oxygen/Fortify.proj',
    'gantry': 'backend/gantry/Fortify.proj',
    'engagement': 'backend/engagement/Fortify.proj',
};

export async function generateFortifyPipeline(dest: string) {
    const pipeline =
        `
include:
  - local: tools/ci/fortify/fortify.base.yml` +
        Object.keys(FORTIFY_CONFIG)
            .map(
                (project) => `
  - local: tools/ci/fortify/fortify.job.yml
    inputs:
      project: ${project}
      projFile: ${FORTIFY_CONFIG[project]}`,
            )
            .join('');

    console.log(`Generated ${dest}`);
    console.log(pipeline);

    await promises.writeFile(dest, pipeline);
}

const dest = join(getGeneratedArtifactsDistPath(), 'fortify-pipeline.yml');

generateFortifyPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
