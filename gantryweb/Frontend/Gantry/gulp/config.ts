import * as path from 'path';
import * as minimist from 'minimist';

export const args = minimist(process.argv.slice(2));

export const config = {
    baseDir: path.join(__dirname, '../'),
    jsSrc: [
        'Bwin.Plugins.MobilePromo/Assets/Scripts/app/**/*.js',
        '!Bwin.Plugins.MobilePromo/Assets/Scripts/app/**/*.spec.js',
    ],
    nunitAssemblies: ['Build/bin/*.Tests.dll'],
    nunitExecutable: path.join(process.env.BUILDPROCESS_HOME, 'tools/nunit3.5/nunit3-console.exe'),
    // karmaConfigFile: 'karma.config.js',
    karmaTypescriptConfigFile: 'karma.ts.config.js',
    hostProjDir: 'Bwin.MobilePromo.Host',
    v6ClientRoot: 'Bwin.MobilePromo.Host/Client',
    v6ClientDist: 'Bwin.MobilePromo.Host/ClientDist',
    v6ClientTemp: 'Bwin.MobilePromo.Host/ClientTemp',
    v6ClientDocsContent: 'docs/content',
    v6ClientDocsDist: 'docs/src/release',
    v6ClientDocsWebRoot: '/mobile/',
    v6PackagesNamespace: '@promo',
    clientProdDir: 'Bwin.MobilePromo.Host/ClientDist',
    clientOutputDir: 'build/dist/promo',
    v6Packages: ['promo'],
    buildProjFile: 'Bpty.Build.proj',
    versionNumberRegex: /\d+\.\d+\.\d+?(\-beta\d+?)?$/,
    nugetPackages: 'build/Packages/*.nupkg',
    nugetSource: 'https://artifactory.bwinparty.corp/artifactory/api/nuget/nuget-internal',
    nugetFeed: 'https://artifactory.bwinparty.corp/artifactory/api/nuget/bpty-nuget-vanilla',
    msBuildProjFile: 'Bpty.Build.proj',
    solutionFile: 'Bwin.MobilePromo.sln',
    // changelog: {
    //     file: '../CHANGELOG.md',
    //     headingPrefix: '### Vanilla ',
    //     notReleasedSuffix: ' [Not released yet]',
    //     releaseDatePlaceholder: '[Release date: TBD]',
    //     emptyChangesTemplate: '- Shared\r\n- Desktop\r\n- M2'
    // },
    nuget: {
        packagesDir: 'Build/Packages'
    },
    themeEntryFiles: [
        'splash',
        'main',
        'belowthefold',
        'labelhost',
        'native-app',
        'authentication',
        'navigation-layout'
    ],
    tools: {
        dgeni: 'gulp/tools/dgeni'
    }
};
