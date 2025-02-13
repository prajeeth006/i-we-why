import { getTouchedProjectsMap } from '@frontend/dev-kit';
import { commitBeforeSha, commitSha, getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { ProjectConfiguration } from '@nx/devkit';
import { promises } from 'fs';
import { join } from 'path';

const backendProjectTag = 'nx-dotnet';
const sonarApiKey = process.env['SONAR_API_KEY'];
const sonarHostUrl = process.env['SONAR_HOST_URL'];

const sonarProjectSettingsOverride: Record<string, string> = {
    'coral-desktop-app': 'packages/oxygen/sonar-project.properties',
    'coral-mobile-app': 'packages/oxygen/sonar-project.properties',
    'ladbrokes-desktop-app': 'packages/oxygen/sonar-project.properties',
    'ladbrokes-mobile-app': 'packages/oxygen/sonar-project.properties',
    'oxygen-core-lib': 'packages/oxygen/sonar-project.properties',
    'oxygen-utils-lib': 'packages/oxygen/sonar-project.properties',
    'oxygen-nx-plugin': 'packages/oxygen/sonar-project.properties',
};

function getFrontendSonarProjectSettings(projectName?: string) {
    if (!projectName) {
        throw new Error('Project name is not defined!');
    }
    const defaultProjectSettings = 'packages/sonar.properties';
    return sonarProjectSettingsOverride[projectName] ?? defaultProjectSettings;
}

function generateBackendScript(projects: ProjectConfiguration[]) {
    return projects
        .map(
            (p) =>
                `    - dotnet sonarscanner begin /k:monorepo-${p.name?.toLowerCase()} /d:sonar.host.url=${sonarHostUrl} /d:sonar.login=${sonarApiKey} /d:sonar.inclusions=${p.root} /d:sonar.dotnet.excludeTestProjects=true /d:sonar.qualitygate.wait=true /d:sonar.cs.opencover.reportsPaths="dist/backend/test/${p.name}/**/coverage.opencover.xml"
    - dotnet build ${p.root}
    - dotnet sonarscanner end /d:sonar.login=${sonarApiKey}`,
        )
        .join('\n');
}

function generateFrontendScript(projects: ProjectConfiguration[]) {
    return projects
        .map(
            (p) =>
                `    - sonar-scanner -Dsonar.host.url=${sonarHostUrl} -Dsonar.login=${sonarApiKey} -Dsonar.projectKey=monorepo-${p.name?.toLowerCase()} -Dsonar.projectName=monorepo-${p.name?.toLowerCase()} -Dsonar.sources=${p.root} -Dsonar.typescript.tsconfigPaths=tsconfig.base.json,${p.root}/tsconfig.*?.json -Dsonar.qualitygate.wait=false -Dsonar.test.inclusions=**/*.spec.ts -Dsonar.typescript.lcov.reportPaths=dist/test/${p.root}/coverage/${p.name}-lcov/lcov.info -Dsonar.gitlab.unique_issue_per_inline=true -Dproject.settings=${getFrontendSonarProjectSettings(p.name)}`,
        )
        .join('\n');
}

export async function generateSonarPipeline(dest: string) {
    const INITIAL_COMMIT_SHA = '0000000000000000000000000000000000000000';
    const from = commitBeforeSha === INITIAL_COMMIT_SHA ? 'main' : commitBeforeSha;
    const to = commitSha;
    const touchedProjectsMap = await getTouchedProjectsMap({ from, to });
    const touchedProjects = Object.values(touchedProjectsMap);
    const backendProjects = touchedProjects.filter((p) => (p.tags ?? []).includes(backendProjectTag) && !p.targets?.['test-dotnet']);
    const frontendProjects = touchedProjects.filter((p) => !(p.tags ?? []).includes(backendProjectTag));

    if (backendProjects.length === 0 && frontendProjects.length === 0) {
        const pipeline = `
include:
- local: tools/ci/common/fast-info-job.yml
  inputs:
    name: "no apps to sonar"
    stage: build
    echoMessage: "Your change didn't touch any project, so nothing for sonar to do here..."
`;
        await promises.writeFile(dest, pipeline);
        return;
    }

    const pipeline = `
include: tools/ci/common/rules.yml
${
    backendProjects.length === 0
        ? ''
        : `
sonar-backend:
  extends:
    - .rules-on-success
  image: bpty-docker-local.artifactory.bwinparty.corp/b2d-dotnetcore-sonar:9.0
  tags:
    - linux-docker-runner
  script:
${generateBackendScript(backendProjects)}
`
}
${
    frontendProjects.length === 0
        ? ''
        : `
sonar-frontend:
  needs:
    - pipeline: $PARENT_PIPELINE_ID
      job: affected
  extends:
    - .rules-on-success
  image: bpty-docker-local.artifactory.bwinparty.corp/b2d-node:18-alpine3.18-azuljdk17
  tags:
    - linux-docker-runner
  script:
${generateFrontendScript(frontendProjects)}
`
}
`;

    console.log(`Generated ${dest}`);
    console.log(pipeline);

    await promises.writeFile(dest, pipeline);
}

const dest = join(getGeneratedArtifactsDistPath(), 'sonar-pipeline.yml');

generateSonarPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
