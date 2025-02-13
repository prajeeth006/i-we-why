import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { promises } from 'fs';
import { join } from 'path';

import { JobConfig, LOAD_CONFIG } from './load.config';

async function generatePipeline(dest: string) {
    const yaml = generateYaml();

    console.log(`Generated ${dest}`);
    console.log(yaml);

    await promises.writeFile(dest, yaml);
}

function generateYaml(): string {
    return (
        `
include:
  - local: tools/ci/load/load.base.yml` +
        Object.keys(LOAD_CONFIG)
            .map((key) => generateJobYaml(key, LOAD_CONFIG[key]))
            .join('')
    );
}

function generateJobYaml(name: string, config: JobConfig): string {
    return `
  - local: tools/ci/load/load.job.yml
    inputs:
      name: ${name}
      when: ${config.when}
      image: ${config.ciImage}
      tag: ${config.ciTag}
      parallel: ${config.parallel}
      script: ${config.script}`;
}

const dest = join(getGeneratedArtifactsDistPath(), 'load-pipeline.yml');

generatePipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
