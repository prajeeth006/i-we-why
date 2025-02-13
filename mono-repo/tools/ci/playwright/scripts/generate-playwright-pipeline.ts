import { getOutputPath, getProjectsFromGraph } from '@frontend/dev-kit';
import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { ProjectConfiguration } from '@nx/devkit';
import { promises } from 'fs';
import { join } from 'path';

import { baseE2EJobMap } from '../../e2e/constants';

const BASE_URL = process.env['BASE_URL'];
const APP_NAME = process.env['APP'];
const CI_PIPELINE_SOURCE = process.env['CI_PIPELINE_SOURCE'];
const LAMBDATEST_ENABLED = process.env['LAMBDATEST_ENABLED'];
const LAMBDATEST_ACCESSKEY = process.env['LAMBDATEST_ACCESSKEY'];
const LAMBDATEST_USERNAME = process.env['LAMBDATEST_USERNAME'];

function getBaseE2EJob(appName: string) {
    return baseE2EJobMap[appName] || '.e2e';
}

// Run only the specified jobs for the scheduled pipelines
// If missing, all jobs will be generated
const SCHEDULED_PLAYWRIGHT_PROJECTS = process.env['SCHEDULED_PLAYWRIGHT_PROJECTS'];

// Sports has a bottleneck with dynacon override requests. Lower the load for now
// TODO: Revise after the dynacon override issue is resolved
const parallelOverride: Record<string, number> = {
    'sports-web-e2e': 1,
    'sports-betstation-e2e': 1,
    'casino-e2e': 2,
    'promo-e2e': 1,
    'rewards-hub-e2e': 2,
};

function writeParallelOverride(appName: string) {
    return Object.keys(parallelOverride).some((app) => app === appName) ? `parallel: ${parallelOverride[appName]}` : '';
}

function isScheduledJob() {
    return CI_PIPELINE_SOURCE === 'schedule';
}

async function findAppProject(appName: string): Promise<ProjectConfiguration | undefined> {
    return Object.values(await getProjectsFromGraph()).find((p) => (appName ? p.name === appName && p.targets?.['e2e'] : p.targets?.['e2e']));
}

async function getE2eTargetConfigs(appName: string) {
    const appProject = await findAppProject(appName);
    if (!appProject) {
        throw new Error(`Project with a name "${appName}" not found!`);
    }
    const e2eTargetConfigs = Object.keys(appProject.targets?.['e2e'].configurations ?? {});
    const outputDir = getOutputPath(appProject, 'e2e');

    return { e2eTargetConfigs, outputDir };
}

function filterScheduledJobs(jobs: string[], scheduledProjects: string | undefined) {
    if (!scheduledProjects) {
        return jobs;
    }

    const scheduledJobs = scheduledProjects.split(',');
    return jobs.filter((j) => scheduledJobs.includes(j));
}

export async function generateE2EPipeline(dest: string) {
    console.log(APP_NAME);
    console.log(BASE_URL);

    if (!APP_NAME) {
        throw new Error('Environment variable APP was not provided!');
    }

    const { e2eTargetConfigs, outputDir } = await getE2eTargetConfigs(APP_NAME);
    const jobsList = isScheduledJob() ? filterScheduledJobs(e2eTargetConfigs, SCHEDULED_PLAYWRIGHT_PROJECTS) : e2eTargetConfigs;

    // Run scheduled jobs automatically and review-deploy jobs manually
    const whenRule = isScheduledJob() ? '' : '- .rules-manual';

    // Create a job for each nx e2e target configuration(pw project)
    const pipeline =
        `
include:
  - local: tools/ci/e2e/e2e.base.yml
  - tools/ci/common/node-module-cache.tpl.yml
` +
        jobsList.map((n) => generateE2EJob(n, outputDir, whenRule)).join('') +
        `
merge-reports:
  stage: reports
  extends:
    - .e2e-merge-reports
  variables:
    APP: ${APP_NAME}
    OUTPUT_DIR: ${outputDir}
    CI_PIPELINE_SOURCE: ${CI_PIPELINE_SOURCE}
`;

    console.log(`Generated ${dest}`);
    console.log(pipeline);

    await promises.writeFile(dest, pipeline);
}

function generateE2EJob(pwProjectName: string, outputDir: string, whenRule: string): string {
    return `
${pwProjectName.replaceAll(' ', '-').toLowerCase()}:
  stage: e2e
  allow_failure: true
  ${writeParallelOverride(APP_NAME!)}
  extends:
    - ${getBaseE2EJob(APP_NAME!)}
    ${whenRule}
  allow_failure: true
  variables:
    APP: ${APP_NAME}
    BASE_URL: ${BASE_URL}
    OUTPUT_DIR: ${outputDir}
    PW_PROJECT: ${pwProjectName}
    LAMBDATEST_ENABLED: ${LAMBDATEST_ENABLED}
    LAMBDATEST_USERNAME: ${LAMBDATEST_USERNAME}
    LAMBDATEST_ACCESSKEY: ${LAMBDATEST_ACCESSKEY}
`;
}

const dest = join(getGeneratedArtifactsDistPath(), 'playwright-pipeline.yml');

generateE2EPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
