import { getOutputPath } from '@frontend/dev-kit';
import { BRANDS } from '@frontend/oxygen/nx-plugin';
import { ProjectConfiguration } from '@nx/devkit';

const CDN_ENVIRONMENTS = ['NONPROD', 'PROD'] as const;
type CdnEnvironment = (typeof CDN_ENVIRONMENTS)[number];

type CdnDeployConfig = {
    apps: string[];
    cdnEnvironments?: readonly CdnEnvironment[];
    buildConfig?: string;
    cdnFolder: string;
    artifactsPath?: string;
};

type CdnDeployOptions = CdnDeployConfig & {
    name: string;
    includeBuild: boolean;
};

const CDN_APPS: { [key: string]: CdnDeployConfig } = {
    'bingo': {
        apps: ['bingo-app'],
        cdnFolder: 'bingo',
    },
    'testweb': {
        apps: ['testweb-app'],
        cdnEnvironments: ['NONPROD'],
        cdnFolder: 'testweb',
    },
    'sports-web': {
        apps: ['sports-web-app'],
        cdnFolder: 'sports-web',
    },
    'casino': {
        apps: ['casino-app'],
        cdnFolder: 'casino',
    },
    'virtualsports': {
        apps: ['virtualsports-app'],
        cdnFolder: 'virtualsports',
    },
    'mokabingo': {
        apps: ['mokabingo-app'],
        cdnFolder: 'mokabingo',
    },
    'myaccount': {
        apps: ['myaccount-app'],
        cdnFolder: 'myaccount',
    },
    'promo': {
        apps: ['promo-app'],
        cdnFolder: 'promo',
    },
    'engagement': {
        apps: ['engagement-app'],
        cdnFolder: 'engagement',
    },
    'poker': {
        apps: ['poker-app'],
        cdnFolder: 'poker',
    },
    'lottery': {
        apps: ['lottery-app'],
        cdnFolder: 'lottery',
    },
    'horseracing': {
        apps: ['horseracing-app'],
        cdnFolder: 'horseracing',
    },
};

BRANDS.map((brand) => {
    CDN_APPS[`oxygen-${brand}`] = {
        apps: [`${brand}-desktop-app`, `${brand}-mobile-app`],
        cdnEnvironments: ['NONPROD'], // ['production', 'hlv0', 'hlv2'].includes('production') ? ['PROD'] : ['NONPROD'],
        // this line to get reviewed by Zlatko, for now modified to test CI pipeline
        buildConfig: 'production',
        cdnFolder: `${brand}sports`,
        artifactsPath: `dist/build/packages/oxygen`,
    };
});

export function getCdnProjects(projects: ProjectConfiguration[]): ProjectConfiguration[] {
    const cdnApps = new Set(Object.values(CDN_APPS).flatMap((c) => c.apps));
    return projects.filter((p) => p.name && cdnApps.has(p.name));
}

export function generateCdnPipelineYaml(projects: ProjectConfiguration[], options: { includeBuild: boolean }): string {
    if (projects.length === 0) return '';
    const yaml =
        `
  - local: tools/ci/cdn/cdn-deploy.base.yml` + generate(projects, options);
    return yaml;
}

function generate(projects: ProjectConfiguration[], options: { includeBuild: boolean }): string {
    // find unique keys
    const keys = Object.keys(CDN_APPS).reduce((acc, app) => {
        projects.forEach((project) => {
            if (project.name && CDN_APPS[app].apps.includes(project.name)) {
                acc.add(app);
            }
        });
        return acc;
    }, new Set<string>());

    return Array.from(keys)
        .map((key) => {
            const config = CDN_APPS[key];
            return generateCdnDeployJobs({
                name: key,
                includeBuild: options.includeBuild,
                ...config,
                cdnEnvironments: config.cdnEnvironments ?? CDN_ENVIRONMENTS,
                artifactsPath: config.artifactsPath ?? getOutputPath(projects.find((p) => p.name && config.apps.includes(p.name))),
            });
        })
        .join('');
}

function generateCdnDeployJobs(options: CdnDeployOptions): string {
    const build = options.includeBuild
        ? `
  - local: tools/ci/cdn/build-client.job.yml
    inputs:
      name: ${options.name}
      app: ${options.apps.join(' ')}
      buildConfig: ${options.buildConfig ?? 'production'}
      artifactsPath: ${options.artifactsPath}`
        : '';

    return (
        build +
        (options.cdnEnvironments ?? [])
            .map(
                (env) => `
  - local: tools/ci/cdn/cdn-deploy.job.${options.includeBuild ? 'build.' : ''}yml
    inputs:
      name: ${options.name}
      cdnFolder: ${options.cdnFolder}
      environment: ${env}
      artifactsPath: ${options.artifactsPath}
      when: manual`,
            )
            .join('')
    );
}
