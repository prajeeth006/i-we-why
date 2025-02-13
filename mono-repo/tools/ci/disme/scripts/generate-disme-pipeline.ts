import { getGeneratedArtifactsDistPath } from '@frontend/gitlab-data-access';
import { BRANDS } from '@frontend/oxygen/nx-plugin';
import { promises } from 'fs';
import { join } from 'path';

type ClientAppInfo = {
    name: string;
    outputPath: string;
    buildConfig?: string;
};

type DotnetProjectDismeConfig = {
    backendProject: string;
    clientApp?: ClientAppInfo;
    dismeShortcut: string;
    dismeDocumentName: string;
    dismeEnvironment: string;
    dismeServers?: string[];
    dxMetadata?: DxMetadata;
    zipFileName: string;
    zipDirectory: string;
};

type DxMetadata = {
    dxPillar: string;
    dxDomain: string;
    dxSubDomain: string;
    dxTeam?: string;
};

type NodeJsProjectDismeConfig = {
    project: string;
    artifacts: string;
    artifactsRoot: string;
    artifactsDir: string;
    dismeShortcut: string;
    dismeEnvironment: string;
    dismeServers?: string[];
    dismePrimaryServer?: string;
    dismeEntity: string;
};
export const dotnetProjectsOptions: { [key: string]: DotnetProjectDismeConfig } = {
    'host-app': {
        backendProject: 'backend/host-app/Frontend.Host.App',
        clientApp: {
            name: 'host-app',
            outputPath: 'dist/build/packages/host-app',
        },
        dismeShortcut: 'frontendhost',
        dismeDocumentName: 'Frontend.Host.App',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Host.App',
        zipDirectory: 'dist/backend/host-app/Frontend.Host.App/win-x64/publish',
    },
    'device-atlas-api': {
        backendProject: 'backend/vanilla/Frontend.DeviceAtlas.Api',
        dismeShortcut: 'deviceatlas',
        dismeDocumentName: 'Frontend.DeviceAtlas.Api',
        dismeEnvironment: 'fvt',
        zipFileName: 'Frontend.DeviceAtlas.Api',
        zipDirectory: 'dist/backend/vanilla/Frontend.DeviceAtlas.Api/win-x64/publish',
    },
    'sf-api': {
        backendProject: 'backend/vanilla/Frontend.SharedFeatures.Api',
        dismeShortcut: 'sf-api',
        dismeDocumentName: 'Frontend.SharedFeatures.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.SharedFeatures.Api',
        zipDirectory: 'dist/backend/vanilla/Frontend.SharedFeatures.Api/win-x64/publish',
    },
    'payments-api': {
        backendProject: 'backend/payments/Frontend.Payments.Api',
        dismeShortcut: 'payments-api',
        dismeDocumentName: 'Frontend.Payments.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Payments.Api',
        zipDirectory: 'dist/backend/payments/Frontend.Payments.Api/win-x64/publish',
    },
    'poker': {
        backendProject: 'backend/poker/Frontend.Poker.Host',
        clientApp: {
            name: 'poker-app',
            outputPath: 'dist/build/packages/poker/app',
            buildConfig: 'production',
        },
        dismeShortcut: 'poker.bgo',
        dismeDocumentName: 'Frontend.Poker',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Poker.Host',
        zipDirectory: 'dist/backend/poker/Frontend.Poker.Host/win-x64/publish',
    },
    'poker-api': {
        backendProject: 'backend/poker/Frontend.Poker.Api',
        dismeShortcut: 'poker-api',
        dismeDocumentName: 'poker-api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Poker.Api',
        zipDirectory: 'dist/backend/poker/Frontend.Poker.Api/win-x64/publish',
    },
    'promo': {
        backendProject: 'backend/promo/Frontend.Promo.Host',
        clientApp: {
            name: 'promo-app',
            outputPath: 'dist/build/packages/promo/app',
            buildConfig: 'production',
        },
        dismeShortcut: 'promo',
        dismeDocumentName: 'Frontend.Promo',
        dismeEnvironment: 'qa',
        dxMetadata: {
            dxDomain: 'Promo',
            dxPillar: 'Player Experience',
            dxSubDomain: 'Promo',
            dxTeam: 'Promo Portal',
        },
        zipFileName: 'Frontend.Promo.Host',
        zipDirectory: 'dist/backend/promo/Frontend.Promo.Host/win-x64/publish',
    },
    'promo-api': {
        backendProject: 'backend/promo/Frontend.Promo.Api',
        dismeShortcut: 'promo-api',
        dismeDocumentName: 'Frontend.Promo.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Promo.Api',
        zipDirectory: 'dist/backend/promo/Frontend.Promo.Api/win-x64/publish',
    },
    'lottery': {
        backendProject: 'backend/lottery/Frontend.Lottery.Host',
        clientApp: {
            name: 'lottery-app',
            outputPath: 'dist/build/packages/lottery-app',
            buildConfig: 'production',
        },
        dismeShortcut: 'lotto.pc',
        dismeDocumentName: 'Frontend.Lottery',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Lottery.Host',
        zipDirectory: 'dist/backend/lottery/Frontend.Lottery.Host/win-x64/publish',
    },
    'lottery-api': {
        backendProject: 'backend/lottery/Frontend.Lottery.Api',
        dismeShortcut: 'lotto-api',
        dismeDocumentName: 'Frontend.Lottery.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Lottery.Api',
        zipDirectory: 'dist/backend/lottery/Frontend.Lottery.Api/win-x64/publish',
    },
    'bingo': {
        backendProject: 'backend/bingo/Frontend.Bingo.Host',
        clientApp: {
            name: 'bingo-app',
            outputPath: 'dist/build/packages/bingo/app',
            buildConfig: 'production',
        },
        dismeShortcut: 'bingo.fyb',
        dismeDocumentName: 'Frontend.Bingo',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Bingo.Host',
        zipDirectory: 'dist/backend/bingo/Frontend.Bingo.Host/win-x64/publish',
    },
    'bingo-api': {
        backendProject: 'backend/bingo/Frontend.Bingo.Api',
        dismeShortcut: 'bingo-api',
        dismeDocumentName: 'Frontend.Bingo.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Bingo.Api',
        zipDirectory: 'dist/backend/bingo/Frontend.Bingo.Api/win-x64/publish',
    },
    'mokabingo': {
        backendProject: 'backend/mokabingo/Frontend.MokaBingo.Host',
        clientApp: {
            name: 'mokabingo-app',
            outputPath: 'dist/build/packages/mokabingo-app',
            buildConfig: 'production',
        },
        dismeShortcut: 'bingo.it',
        dismeDocumentName: 'Frontend.MokaBingo',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.MokaBingo.Host',
        zipDirectory: 'dist/backend/mokabingo/Frontend.MokaBingo.Host/win-x64/publish',
    },
    'mokabingo-api': {
        backendProject: 'backend/mokabingo/Frontend.MokaBingo.Api',
        dismeShortcut: 'mokabingo-api',
        dismeDocumentName: 'Frontend.MokaBingo.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.MokaBingo.Api',
        zipDirectory: 'dist/backend/mokabingo/Frontend.MokaBingo.Api/win-x64/publish',
    },
    'myaccount': {
        backendProject: 'backend/myaccount/Frontend.MyAccount.Host',
        clientApp: {
            name: 'myaccount-app',
            outputPath: 'dist/build/packages/myaccount/app',
            buildConfig: 'production',
        },
        dismeShortcut: 'home',
        dismeDocumentName: 'Frontend.Portal',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.MyAccount.Host',
        zipDirectory: 'dist/backend/myaccount/Frontend.MyAccount.Host/win-x64/publish',
    },
    'myaccount-api': {
        backendProject: 'backend/myaccount/Frontend.MyAccount.Api',
        dismeShortcut: 'portal-api',
        dismeDocumentName: 'portal-api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.MyAccount.Api',
        zipDirectory: 'dist/backend/myaccount/Frontend.MyAccount.Api/win-x64/publish',
    },
    'virtualsports': {
        backendProject: 'backend/virtualsports/Frontend.VirtualSports.Host',
        clientApp: {
            name: 'virtualsports-app',
            outputPath: 'dist/build/packages/virtualsports-app',
            buildConfig: 'production',
        },
        dismeShortcut: 'virtualsports.pc',
        dismeDocumentName: 'Frontend.VirtualSports',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.VirtualSports.Host',
        zipDirectory: 'dist/backend/virtualsports/Frontend.VirtualSports.Host/win-x64/publish',
    },
    'virtualsports-api': {
        backendProject: 'backend/virtualsports/Frontend.VirtualSports.Api',
        dismeShortcut: 'virtualsports-api',
        dismeDocumentName: 'Frontend.VirtualSports.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.VirtualSports.Api',
        zipDirectory: 'dist/backend/virtualsports/Frontend.VirtualSports.Api/win-x64/publish',
    },
    'horseracing': {
        backendProject: 'backend/horseracing/Frontend.HorseRacing.Host',
        clientApp: {
            name: 'horseracing-app',
            outputPath: 'dist/build/packages/horseracing/app',
            buildConfig: 'production',
        },
        dismeShortcut: 'horseracing.bmgm',
        dismeDocumentName: 'Frontend.HorseRacing',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.HorseRacing.Host',
        zipDirectory: 'dist/backend/horseracing/Frontend.HorseRacing.Host/win-x64/publish',
    },
    'horseracing-api': {
        backendProject: 'backend/horseracing/Frontend.HorseRacing.Api',
        dismeShortcut: 'us-co.horseracing-api',
        dismeDocumentName: 'Frontend.HorseRacing.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.HorseRacing.Api',
        zipDirectory: 'dist/backend/horseracing/Frontend.HorseRacing.Api/win-x64/publish',
    },
    'casino': {
        backendProject: 'backend/casino/Frontend.MobileCasino.Host',
        clientApp: {
            name: 'casino-app',
            outputPath: 'dist/build/packages/casino/app',
            buildConfig: 'production',
        },
        dismeShortcut: 'casino',
        dismeDocumentName: 'Frontend.MobileCasino',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.MobileCasino.Host',
        zipDirectory: 'dist/backend/casino/Frontend.MobileCasino.Host/win-x64/publish',
    },
    'casino-api': {
        backendProject: 'backend/casino/Frontend.Casino.Api',
        dismeShortcut: 'casino-api',
        dismeDocumentName: 'Frontend.Casino.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Casino.Api',
        zipDirectory: 'dist/backend/casino/Frontend.Casino.Api/win-x64/publish',
    },
    'dice': {
        backendProject: 'backend/casino/Frontend.Dice.Host',
        clientApp: {
            name: 'casino-app',
            outputPath: 'dist/build/packages/casino/app',
            buildConfig: 'production',
        },
        dismeShortcut: 'dice.be',
        dismeDocumentName: 'Frontend.Dice',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Dice.Host',
        zipDirectory: 'dist/backend/casino/Frontend.Dice.Host/win-x64/publish',
    },
    'engagement': {
        backendProject: 'backend/engagement/Frontend.Engagement.Api',
        dismeShortcut: 'engagement-api',
        dismeDocumentName: 'Frontend.Engagement',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Engagement.Api',
        zipDirectory: 'dist/backend/engagement/Frontend.Engagement.Api/win-x64/publish',
    },
    'gantry': {
        backendProject: 'backend/gantry/Frontend.Gantry.Host',
        clientApp: {
            name: 'gantry-app',
            outputPath: 'dist/build/packages/gantry-app',
            buildConfig: 'production',
        },
        dismeShortcut: 'gantry',
        dismeDocumentName: 'Frontend.Gantry',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Gantry.Host',
        zipDirectory: 'dist/backend/gantry/Frontend.Gantry.Host/win-x64/publish',
    },
    'sports-web': {
        backendProject: 'backend/sports/Frontend.Sports.Host',
        clientApp: {
            name: 'sports-web-app',
            outputPath: 'dist/build/packages/sports/web/app',
            buildConfig: 'production',
        },
        dismeShortcut: 'sports',
        dismeDocumentName: 'Frontend.Sports.Web',
        dismeEnvironment: 'qa',
        dismeServers: ['YOUSHOULDENTER_DISME_SERVER'],
        zipFileName: 'Frontend.Sports.Web',
        zipDirectory: 'dist/backend/sports/Frontend.Sports.Host/win-x64/publish',
    },
    'sports-api': {
        backendProject: 'backend/sports/Frontend.Sports.Api',
        dismeShortcut: 'sports-api',
        dismeDocumentName: 'Frontend.Sports.Api',
        dismeEnvironment: 'qa',
        dismeServers: ['YOUSHOULDENTER_DISME_SERVER'],
        zipFileName: 'Frontend.Sports.Api',
        zipDirectory: 'dist/backend/sports/Frontend.Sports.Api/win-x64/publish',
    },
    'sports-betstation': {
        backendProject: 'backend/sports/Frontend.Sports.Host',
        clientApp: {
            name: 'sports-betstation-app',
            outputPath: 'dist/build/packages/sports/betstation/app',
            buildConfig: 'production',
        },
        dismeShortcut: 'betstation.lb',
        dismeDocumentName: 'Frontend.Sports.Betstation',
        dismeEnvironment: 'qa',
        dismeServers: ['YOUSHOULDENTER_DISME_SERVER'],
        zipFileName: 'Frontend.Sports.Betstation',
        zipDirectory: 'dist/backend/sports/Frontend.Sports.Host/win-x64/publish',
    },
    'oxygen-api': {
        backendProject: 'backend/oxygen/Frontend.Oxygen.Api',
        dismeShortcut: 'ozone-api',
        dismeDocumentName: 'Frontend.Oxygen.Api',
        dismeEnvironment: 'qa',
        zipFileName: 'Frontend.Oxygen.Api',
        zipDirectory: 'dist/backend/oxygen/Frontend.Oxygen.Api/win-x64/publish',
    },
};

export async function generateDismeDeployPipeline(dest: string) {
    const getOxygenDotnetProject = (brand: string, config: string): DotnetProjectDismeConfig => ({
        backendProject: 'backend/oxygen/Frontend.Oxygen.Host',
        clientApp: {
            name: `${brand}-desktop-app ${brand}-mobile-app`,
            outputPath: 'dist/build/packages/oxygen',
            buildConfig: config,
        },
        dismeShortcut: 'sports.cc.uk',
        dismeDocumentName: 'Frontend.Oxygen.Host',
        dismeEnvironment: 'qa',
        zipFileName: `Frontend.Oxygen.Host-${brand}-${config}`,
        zipDirectory: 'dist/backend/oxygen/Frontend.Oxygen.Host/win-x64/publish',
    });

    BRANDS.map((brand) => {
        dotnetProjectsOptions[`oxygen-${brand}`] = getOxygenDotnetProject(brand, 'production');
    });

    const nodeJsProjectsOptions: { [key: string]: NodeJsProjectDismeConfig } = {
        'figma-webhook-app': {
            project: 'design-system-figma-webhook-app',
            artifacts: 'dist/build/packages/design-system/figma-webhook-app',
            artifactsRoot: 'dist/build/packages/design-system',
            artifactsDir: 'figma-webhook-app',
            dismeShortcut: 'fis',
            dismeEnvironment: 'dev',
            dismeEntity: '3291',
            dismePrimaryServer: '34014',
        },
        'chromatic-webhook-app': {
            project: 'design-system-chromatic-webhook-app',
            artifacts: 'dist/build/packages/design-system/chromatic-webhook-app',
            artifactsRoot: 'dist/build/packages/design-system',
            artifactsDir: 'chromatic-webhook-app',
            dismeShortcut: 'chris',
            dismeEnvironment: 'dev',
            dismeEntity: '3763',
            dismePrimaryServer: '48949',
        },
    };

    const pipeline =
        `
include:
  - local: tools/ci/disme/disme.dotnet.base.yml
` +
        Object.keys(dotnetProjectsOptions)
            .map((project) => generateDotnetProject(project, dotnetProjectsOptions[project], false))
            .join('') +
        Object.keys(nodeJsProjectsOptions)
            .map((project) => generateNodeJsProject(project, nodeJsProjectsOptions[project], false))
            .join('');

    console.log(`Generated ${dest}`);
    console.log(pipeline);
    await promises.writeFile(dest, pipeline);
}

export function generateDotnetProject(project: string, config: DotnetProjectDismeConfig, autoStart: boolean): string {
    const clientAppInputs = config.clientApp
        ? `clientAppName: ${config.clientApp.name ?? project}
      clientAppArtifactsPath: ${config.clientApp.outputPath}
      clientAppBuildConfig: ${config.clientApp.buildConfig}`
        : '';

    const dxMetadataInputs = config.dxMetadata
        ? `dxDomain: ${config.dxMetadata.dxDomain}
      dxPillar: ${config.dxMetadata.dxPillar}
      dxSubDomain: ${config.dxMetadata.dxSubDomain}
      ${config.dxMetadata.dxTeam ? `dxTeam: ${config.dxMetadata.dxTeam}` : ''}`
        : '';

    return `
  - local: tools/ci/disme/disme.dotnet.job.${config.clientApp ? 'legacy' : 'modern'}.yml
    inputs:
      ${clientAppInputs}
      ${dxMetadataInputs}
      project: ${project}
      when: ${autoStart ? 'on-success' : 'manual'}
      backendProject: ${config.backendProject}
      dismeShortcut: ${config.dismeShortcut}
      dismeDocumentName: ${config.dismeDocumentName}
      dismeEnvironment: ${config.dismeEnvironment}
      dismeServers: ${config.dismeServers?.join(',') ?? 'all'}
      zipDirectory: ${config.zipDirectory}
      zipFileName: ${config.zipFileName}
`;
}

export function generateNodeJsProject(project: string, config: NodeJsProjectDismeConfig, autoStart: boolean): string {
    return `
  - local: tools/ci/disme/disme.nodejs.job.yml
    inputs:
      project: ${config.project}
      when: ${autoStart ? 'on-success' : 'manual'}
      artifacts: ${config.artifacts}
      artifactsRoot: ${config.artifactsRoot}
      artifactsDir: ${config.artifactsDir}
      dismeShortcut: ${config.dismeShortcut}
      dismeEnvironment: ${config.dismeEnvironment}
      dismeServers: ${config.dismeServers ? config.dismeServers.join(',') : 'all'}
      dismeEntity: ${config.dismeEntity}
      dismePrimaryServer: ${config.dismePrimaryServer ? config.dismePrimaryServer : 'all'}
`;
}

const dest = join(getGeneratedArtifactsDistPath(), 'disme-pipeline.yml');

generateDismeDeployPipeline(dest)
    .then(() => process.exit())
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
