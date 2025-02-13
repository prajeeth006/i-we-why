import { getOutputPath } from '@frontend/dev-kit';
import { isDefaultBranch } from '@frontend/gitlab-data-access';
import { ProjectConfiguration } from '@nx/devkit';

export type BackendAppInfo = {
    name: string;
    product?: string;
    overrideProjectName?: string;
    environment?: string;
};

type ClientAppInfo = {
    names: string[];
    artifactsPath?: string;
    configuration?: string;
};

export type ReviewConfiguration = {
    project?: string;
    backendApp: BackendAppInfo;
    clientApp?: ClientAppInfo;
    environment?: string;
    additionalHosts?: string[];
    labels?: string[];
    afterDeployJob?: string;
    userFlowsPath?: string;
};

const ALL_LABELS = [
    'az.betmgm.com',
    'betboo.bet.br',
    'betmgm.com',
    'borgataonline.com',
    'bpremium.de',
    'br.betboo.com',
    'bwin.be',
    'bwin.co',
    'bwin.com',
    'bwin.de',
    'bwin.dk',
    'bwin.es',
    'bwin.fr',
    'bwin.gr',
    'bwin.it',
    'bwin.mx',
    'bwin.nl',
    'bwin.pt',
    'bwin.ro',
    'bwin.se',
    'co.betmgm.com',
    'coral.co.uk',
    'dc.betmgm.com',
    'foxybingo.com',
    'foxygames.com',
    'galabingo.com',
    'gamebookers.com',
    'giocodigitale.it',
    'ia.betmgm.com',
    'il.betmgm.com',
    'in.betmgm.com',
    'ks.betmgm.com',
    'ky.betmgm.com',
    'la.betmgm.com',
    'ladbrokes.com',
    'ladbrokes.de',
    'ma.betmgm.com',
    'md.betmgm.com',
    'me.betmgm.com',
    'mi.betmgm.com',
    'ms.betmgm.com',
    'nc.betmgm.com',
    'nj.betmgm.com',
    'nv.betmgm.com',
    'ny.betmgm.com',
    'oddset.de',
    'oh.betmgm.com',
    'on.betmgm.ca',
    'on.bwin.ca',
    'on.partysports.ca',
    'on.sportsinteraction.com',
    'pa.betmgm.com',
    'partycasino.com',
    'partypoker.com',
    'partysports.com',
    'partysports.mx',
    'partysports.nl',
    'partyslots.de',
    'pr.betmgm.com',
    'premium.com',
    'sportingbet.bet.br',
    'sportingbet.co.za',
    'sportingbet.com',
    'sportingbet.de',
    'sportingbet.gr',
    'sportingbet.ro',
    'sportsinteraction.com',
    'tn.betmgm.com',
    'va.betmgm.com',
    'vanilla.intranet',
    'vistabet.gr',
    'wv.betmgm.com',
    'wy.betmgm.com',
];

export const REVIEW_CONFIG: { [key: string]: ReviewConfiguration } = {
    'bingo': {
        backendApp: { name: 'Frontend.Bingo.Host' },
        clientApp: { names: ['bingo-app'] },
    },
    'bingo-api': {
        backendApp: { name: 'Frontend.Bingo.Api' },
    },
    'mokabingo': {
        backendApp: { name: 'Frontend.MokaBingo.Host' },
        clientApp: { names: ['mokabingo-app'] },
    },
    'mokabingo-api': {
        backendApp: { name: 'Frontend.MokaBingo.Api' },
    },
    'casino': {
        backendApp: { name: 'Frontend.MobileCasino.Host' },
        clientApp: { names: ['casino-app'] },
    },
    'casino-api': {
        backendApp: { name: 'Frontend.Casino.Api' },
    },
    'myaccount': {
        backendApp: { name: 'Frontend.MyAccount.Host' },
        clientApp: { names: ['myaccount-app'] },
    },
    'myaccount-api': {
        backendApp: { name: 'Frontend.MyAccount.Api', overrideProjectName: 'Bwin.Plugins.MobilePortal' },
    },
    'poker': {
        backendApp: { name: 'Frontend.Poker.Host' },
        clientApp: { names: ['poker-app'] },
    },
    'poker-api': {
        backendApp: { name: 'Frontend.Poker.Api' },
    },
    'promo-web-aue': {
        project: 'promo',
        backendApp: { name: 'Frontend.Promo.Host', environment: 'aue' },
        clientApp: { names: ['promo-app'] },
        afterDeployJob: 'jenkins',
    },
    'promo-web-qa2': {
        project: 'promo',
        backendApp: { name: 'Frontend.Promo.Host', environment: 'qa2' },
        clientApp: { names: ['promo-app'] },
    },
    'promo-web-fvt': {
        project: 'promo',
        backendApp: { name: 'Frontend.Promo.Host', environment: 'fvt' },
        clientApp: { names: ['promo-app'] },
    },
    'promo-web-beta': {
        project: 'promo',
        backendApp: { name: 'Frontend.Promo.Host', environment: 'beta' },
        clientApp: { names: ['promo-app'] },
    },
    'promo-api-aue': {
        project: 'promo-api',
        backendApp: { name: 'Frontend.Promo.Api', environment: 'aue' },
    },
    'promo-api-qa2': {
        project: 'promo-api',
        backendApp: { name: 'Frontend.Promo.Api', environment: 'qa2' },
    },
    'promo-api-fvt': {
        project: 'promo-api',
        backendApp: { name: 'Frontend.Promo.Api', environment: 'fvt' },
    },
    'promo-api-beta': {
        project: 'promo-api',
        backendApp: { name: 'Frontend.Promo.Api', environment: 'beta' },
    },
    'engagement': {
        backendApp: { name: 'Frontend.Promo.Host' },
        clientApp: { names: ['engagement-app'] },
    },
    'engagement-api': {
        backendApp: { name: 'Frontend.Engagement.Api' },
    },
    'sports-web-aue': {
        project: 'sports-web',
        backendApp: { name: 'Frontend.Sports.Host', environment: 'aue' },
        clientApp: { names: ['sports-web-app'] },
        afterDeployJob: 'jenkins',
        userFlowsPath: './packages/sports/web/libs/user-flows-lib/src/.user-flowrc.json',
    },
    'sports-web-qa2': {
        project: 'sports-web',
        backendApp: { name: 'Frontend.Sports.Host', environment: 'qa2' },
        clientApp: { names: ['sports-web-app'] },
        userFlowsPath: './packages/sports/web/libs/user-flows-lib/src/.user-flowrc.json',
    },
    'sports-web-fvt': {
        project: 'sports-web',
        backendApp: { name: 'Frontend.Sports.Host', environment: 'fvt' },
        clientApp: { names: ['sports-web-app'] },
        userFlowsPath: './packages/sports/web/libs/user-flows-lib/src/.user-flowrc.json',
    },
    'sports-web-beta': {
        project: 'sports-web',
        backendApp: { name: 'Frontend.Sports.Host', environment: 'beta' },
        clientApp: { names: ['sports-web-app'] },
        userFlowsPath: './packages/sports/web/libs/user-flows-lib/src/.user-flowrc.json',
    },
    'sports-betstation': {
        backendApp: { name: 'Frontend.Sports.Host', environment: 'aue' },
        clientApp: { names: ['sports-betstation-app'] },
        afterDeployJob: 'jenkins',
        labels: ['coral.co.uk', 'ladbrokes.com'],
    },
    'sports-api-aue': {
        project: 'sports-api',
        backendApp: { name: 'Frontend.Sports.Api', environment: 'aue' },
    },
    'sports-api-qa2': {
        project: 'sports-api',
        backendApp: { name: 'Frontend.Sports.Api', environment: 'qa2' },
    },
    'sports-api-fvt': {
        project: 'sports-api',
        backendApp: { name: 'Frontend.Sports.Api', environment: 'fvt' },
    },
    'sports-api-beta': {
        project: 'sports-api',
        backendApp: { name: 'Frontend.Sports.Api', environment: 'beta' },
    },
    'host-app': {
        project: 'host-app',
        backendApp: { name: 'Frontend.Host.App' },
        clientApp: { names: ['host-app'] },
    },
    'host-app-fvt': {
        project: 'host-app',
        backendApp: { name: 'Frontend.Host.App', environment: 'fvt' },
        clientApp: { names: ['host-app'] },
    },
    'host-app-beta': {
        project: 'host-app',
        backendApp: { name: 'Frontend.Host.App', environment: 'beta' },
        clientApp: { names: ['host-app'] },
    },
    'testweb': {
        backendApp: { name: 'Frontend.TestWeb.Host', product: 'vanilla-testweb', environment: 'qa' },
        clientApp: { names: ['testweb-app'] },
        additionalHosts: ['auth-testweb'],
        environment: 'qa',
        labels: ['vanilla.intranet'],
    },
    'themepark': {
        backendApp: { name: 'Frontend.TestWeb.Host', product: 'themepark', environment: 'qa' },
        clientApp: { names: ['themepark-app'] },
    },
    'sf-api-qa': {
        project: 'sf-api',
        backendApp: { name: 'Frontend.SharedFeatures.Api', environment: 'qa' },
    },
    'sf-api-qa1': {
        project: 'sf-api',
        backendApp: { name: 'Frontend.SharedFeatures.Api', environment: 'qa1' },
    },
    'sf-api-qa2': {
        project: 'sf-api',
        backendApp: { name: 'Frontend.SharedFeatures.Api', environment: 'qa2' },
    },
    'sf-api-qa3': {
        project: 'sf-api',
        backendApp: { name: 'Frontend.SharedFeatures.Api', environment: 'qa3' },
    },
    'sf-api-qa4': {
        project: 'sf-api',
        backendApp: { name: 'Frontend.SharedFeatures.Api', environment: 'qa4' },
    },
    'sf-api-fvt': {
        project: 'sf-api',
        backendApp: { name: 'Frontend.SharedFeatures.Api', environment: 'fvt' },
    },
    'sf-api-aue': {
        project: 'sf-api',
        backendApp: { name: 'Frontend.SharedFeatures.Api', environment: 'aue' },
    },
    'sf-api-auefvt': {
        project: 'sf-api',
        backendApp: { name: 'Frontend.SharedFeatures.Api', environment: 'auefvt' },
    },
    'sf-api-beta': {
        project: 'sf-api',
        backendApp: { name: 'Frontend.SharedFeatures.Api', environment: 'beta' },
    },
    'virtualsports': {
        backendApp: { name: 'Frontend.VirtualSports.Host' },
        clientApp: { names: ['virtualsports-app'] },
    },
    'oxygen-coral-qa2-tst0': {
        project: 'oxygen-coral',
        backendApp: { name: 'Frontend.Oxygen.Host', environment: 'qa2' },
        clientApp: {
            names: ['coral-desktop-app', 'coral-mobile-app'],
            configuration: 'tst0',
            artifactsPath: 'dist/build/packages/oxygen',
        },
        labels: ['coral.co.uk'],
    },
    'oxygen-ladbrokes-qa2-tst0': {
        project: 'oxygen-ladbrokes',
        backendApp: { name: 'Frontend.Oxygen.Host', environment: 'qa2' },
        clientApp: {
            names: ['ladbrokes-desktop-app', 'ladbrokes-mobile-app'],
            configuration: 'tst0',
            artifactsPath: 'dist/build/packages/oxygen',
        },
        labels: ['ladbrokes.com'],
    },
    'oxygen-coral-fvt-stg0': {
        project: 'oxygen-coral',
        backendApp: { name: 'Frontend.Oxygen.Host', environment: 'fvt' },
        clientApp: {
            names: ['coral-desktop-app', 'coral-mobile-app'],
            configuration: 'stg0',
            artifactsPath: 'dist/build/packages/oxygen',
        },
        labels: ['coral.co.uk'],
    },
    'oxygen-ladbrokes-fvt-stg0': {
        project: 'oxygen-ladbrokes',
        backendApp: { name: 'Frontend.Oxygen.Host', environment: 'fvt' },
        clientApp: {
            names: ['ladbrokes-desktop-app', 'ladbrokes-mobile-app'],
            configuration: 'stg0',
            artifactsPath: 'dist/build/packages/oxygen',
        },
        labels: ['ladbrokes.com'],
    },
    'oxygen-coral-beta-hlv0': {
        project: 'oxygen-coral',
        backendApp: { name: 'Frontend.Oxygen.Host', environment: 'beta' },
        clientApp: {
            names: ['coral-desktop-app', 'coral-mobile-app'],
            configuration: 'hlv0',
            artifactsPath: 'dist/build/packages/oxygen',
        },
        labels: ['coral.co.uk'],
    },
    'oxygen-ladbrokes-beta-hlv0': {
        project: 'oxygen-ladbrokes',
        backendApp: { name: 'Frontend.Oxygen.Host', environment: 'beta' },
        clientApp: {
            names: ['ladbrokes-desktop-app', 'ladbrokes-mobile-app'],
            configuration: 'hlv0',
            artifactsPath: 'dist/build/packages/oxygen',
        },
        labels: ['ladbrokes.com'],
    },
    'oxygen-coral-beta-hlv2': {
        project: 'oxygen-coral',
        backendApp: { name: 'Frontend.Oxygen.Host', environment: 'beta' },
        clientApp: {
            names: ['coral-desktop-app', 'coral-mobile-app'],
            configuration: 'hlv2',
            artifactsPath: 'dist/build/packages/oxygen',
        },
        labels: ['coral.co.uk'],
    },
    'oxygen-ladbrokes-beta-hlv2': {
        project: 'oxygen-ladbrokes',
        backendApp: { name: 'Frontend.Oxygen.Host', environment: 'beta' },
        clientApp: {
            names: ['ladbrokes-desktop-app', 'ladbrokes-mobile-app'],
            configuration: 'hlv2',
            artifactsPath: 'dist/build/packages/oxygen',
        },
        labels: ['ladbrokes.com'],
    },
    'oxygen-api-qa2': {
        project: 'oxygen-api',
        backendApp: { name: 'Frontend.Oxygen.Api', environment: 'qa2' },
        labels: ['coral.co.uk', 'ladbrokes.com'],
    },
    'oxygen-api-beta': {
        project: 'oxygen-api',
        backendApp: { name: 'Frontend.Oxygen.Api', environment: 'beta' },
        labels: ['coral.co.uk', 'ladbrokes.com'],
    },
    'virtualsports-api': {
        backendApp: { name: 'Frontend.VirtualSports.Api' },
    },
    'horseracing': {
        backendApp: { name: 'Frontend.HorseRacing.Host' },
        clientApp: { names: ['horseracing-app'] },
    },
    'horseracing-api': {
        backendApp: { name: 'Frontend.HorseRacing.Api' },
    },
    'lottery': {
        backendApp: { name: 'Frontend.Lottery.Host' },
        clientApp: { names: ['lottery-app'] },
    },
    'lottery-api': {
        backendApp: { name: 'Frontend.Lottery.Api' },
    },
    'payments-api-qa': {
        project: 'payments-api',
        backendApp: { name: 'Frontend.Payments.Api', environment: 'qa' },
    },
    'payments-api-fvt': {
        project: 'payments-api',
        backendApp: { name: 'Frontend.Payments.Api', environment: 'fvt' },
    },
    'payments-api-beta': {
        project: 'payments-api',
        backendApp: { name: 'Frontend.Payments.Api', environment: 'beta' },
    },
};

function hasMatchingE2EProject(projectName: string, allProjects: ProjectConfiguration[], clientProjectConfigurations: ProjectConfiguration[]) {
    /*
    When the e2e project is inside the app as a separate nx app project.
    This should be refactored moving e2e project out of the app project folder.
    myaccount-app
    myaccount-e2e-app
    */
    const myaccountLikeFormat = (name: string) => `${name}-e2e`;

    /*
    sports-web-app
    sports-web-e2e
    */
    const defaultNameFormat = (name: string) => `${name}-e2e`;

    const e2eProjectName = allProjects.find((p) => p.name === defaultNameFormat(projectName) || p.name === myaccountLikeFormat(projectName))?.name;

    if (e2eProjectName) {
        return e2eProjectName;
    }

    // legacy way of finding e2e project
    const hasE2eTarget = clientProjectConfigurations.find((c) => c.targets?.['e2e']);
    if (hasE2eTarget) {
        return hasE2eTarget.name;
    }

    return undefined;
}

export function generateReviewJobs(
    name: string,
    allProjects: ProjectConfiguration[],
    options: {
        autoDeployEnabled: boolean;
    },
): string {
    const config = REVIEW_CONFIG[name];
    const backendProjectConfiguration = allProjects.find((p) => p.name === config.backendApp.name);
    if (!backendProjectConfiguration) {
        throw new Error(`Backend project ${config.backendApp.name} not found. Existing ones are: ${allProjects.map((p) => p.name).join(',')}.`);
    }
    const clientProjectConfigurations: ProjectConfiguration[] = config.clientApp
        ? allProjects.filter((p): p is ProjectConfiguration => !!(p.name && config.clientApp?.names.includes(p.name)))
        : [];
    if (config.clientApp && clientProjectConfigurations.length !== config.clientApp.names.length) {
        throw new Error(
            `Some of client app names: ${config.clientApp.names} are not configured. Existing ones are: ${allProjects.map((p) => p.name).join(',')}.`,
        );
    }

    const e2eProject = hasMatchingE2EProject(config.project ?? name, allProjects, clientProjectConfigurations);

    return `
  - local: tools/ci/review/review${config.clientApp ? '.client' : ''}.job.yml
    inputs:
      name: ${name}
      project: ${config.project ?? name}
      e2eProject: ${e2eProject}
      rules: ${options.autoDeployEnabled && isDefaultBranch ? 'on-success' : 'manual'}
      e2eRules: ${e2eProject ? (options.autoDeployEnabled && isDefaultBranch ? 'on-success' : 'manual') : 'never'}
      environment: "${config.backendApp.environment ?? 'qa2'}"
      deployEnvironment: ${isDefaultBranch ? 'staging' : 'review'}
      autoStopIn: "${isDefaultBranch ? 24 * 365 : 8} hours"
      backendProduct: ${config.backendApp.product ?? name}
      backendProjectName: ${config.backendApp.overrideProjectName ?? backendProjectConfiguration.root.split('/').pop()}
      backendProjectPath: ${backendProjectConfiguration.root}
      afterDeployJob: ${config.afterDeployJob ?? '""'}
      userFlowsPath: ${config.userFlowsPath ?? '""'}
      additionalHosts: "${(config.additionalHosts ?? []).map((h) => `${h}.$REVIEW_DOMAIN`).join('\\\\,')}"
      labels: "${(config.labels ?? ALL_LABELS).join('\\\\,')}"
      ${
          config.clientApp
              ? `clientAppName: ${config.clientApp.names.join(' ')}
      clientAppArtifactsPath: ${config.clientApp.names.length === 1 ? getOutputPath(clientProjectConfigurations[0], 'build') : config.clientApp.artifactsPath}
      clientAppConfiguration: ${config.clientApp.configuration ?? 'production'}`
              : ''
      }`;
}
