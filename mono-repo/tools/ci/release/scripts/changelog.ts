/*

 TO RUN LOCALLY:
 yarn ts-node --project ./tools/tsconfig.json tools/ci/release/scripts/changelog.ts -n --branch "release/sports-web/29.1.0"

*/
import { promises } from 'fs';
import { parseArgs } from 'node:util';

import util = require('util');

const exec = util.promisify(require('child_process').exec);

const path = 'variables.env';
const changelogPath = 'RELEASE_CHANGELOG.md';

const options = {
    branch: { type: 'string', short: 'b' },
    useNpx: { type: 'boolean', short: 'n' },
} as const;

const args = parseArgs({ options });

const { branch, useNpx } = args.values;

interface ChangelogConfiguration {
    includePaths: string[];
    excludePaths?: string[];
}

const defaultProductDependencies = ['packages/vanilla/lib/**/*', 'backend/vanilla/**/*', 'packages/themepark/themes/**/*'];

const CHANGELOG_CONFIG: { [key: string]: ChangelogConfiguration } = {
    'host': {
        // Future use
        includePaths: ['packages/**/*', 'backend/**/*'],
    },
    'bingo': { includePaths: ['packages/bingo/**/*', 'backend/bingo/**/*', 'packages/design-system/ui/**/*', ...defaultProductDependencies] },
    'casino': { includePaths: ['packages/casino/**/*', 'backend/casino/**/*', 'packages/design-system/ui/**/*', ...defaultProductDependencies] },
    'engagement': { includePaths: ['packages/engagement/**/*', 'backend/engagement/**/*', ...defaultProductDependencies] },
    'gantry': { includePaths: ['packages/gantry-app/**/*', 'backend/gantry/**/*'] },
    'globalsearch': { includePaths: ['packages/global-search/**/*', 'backend/globalsearch/**/*', ...defaultProductDependencies] },
    'horseracing': { includePaths: ['packages/horseracing/**/*', 'backend/horseracing/**/*', ...defaultProductDependencies] },
    'lottery': { includePaths: ['packages/lottery-app/**/*', 'backend/lottery/**/*', ...defaultProductDependencies] },
    'mokabingo': { includePaths: ['packages/mokabingo-app/**/*', 'backend/mokabingo/**/*', ...defaultProductDependencies] },
    'myaccount': {
        includePaths: ['packages/myaccount/**/*', 'backend/myaccount/**/*', 'packages/design-system/ui/**/*', ...defaultProductDependencies],
    },
    'payments': { includePaths: ['packages/payments/**/*', 'backend/payments/**/*', 'packages/themepark/themes/**/*'] },
    'poker': { includePaths: ['packages/poker/**/*', 'backend/poker/**/*', ...defaultProductDependencies] },
    'promo': { includePaths: ['packages/promo/**/*', 'backend/promo/**/*', 'packages/design-system/ui/**/*', ...defaultProductDependencies] },
    'oxygen': { includePaths: ['packages/oxygen/**/*', 'backend/oxygen/**/*', ...defaultProductDependencies] },
    'sports-betstation': {
        includePaths: [
            'packages/sports/**/*',
            'backend/sports/**/*',
            'packages/vanilla/lib/**/*',
            'backend/vanilla/**/*',
            'packages/themepark/themes/whitelabel/**/*',
            'packages/themepark/themes/*-betstation/**/*',
        ],
        excludePaths: ['packages/sports/styles/web/**/*'],
    },
    'sports-web': {
        includePaths: ['packages/sports/**/*', 'backend/sports/**/*', 'packages/design-system/ui/**/*', ...defaultProductDependencies],
        excludePaths: ['packages/sports/betstation/**/*', 'packages/sports/styles/betstation/**/*'],
    },
    'themes': { includePaths: ['packages/themepark/**/*'] },
    'vanilla': { includePaths: ['packages/vanilla/**/*', 'backend/vanilla/**/*'] },
    'virtualsports': { includePaths: ['packages/virtualsports-app/**/*', 'backend/virtualsports/**/*', ...defaultProductDependencies] },
};

async function main() {
    const tag = (branch !== 'main' && branch?.replace('release/', '').replace('/', '-')) ?? undefined;
    const product = branch !== 'main' ? branch?.match(/^release\/([^/]+)/)![1] : 'host';

    let cliffArgs = ['--unreleased', '--output', changelogPath];

    if (tag) {
        cliffArgs = ['--tag', tag, ...cliffArgs];
        await promises.writeFile(path, `TAG=${tag}\n`);
    }

    cliffArgs = [...cliffArgs, '--tag-pattern', `${product}-`];

    const productConfig = product ? CHANGELOG_CONFIG[product] : null;

    if (productConfig && productConfig.includePaths.length > 0) {
        cliffArgs = [...cliffArgs, '--include-path', ...productConfig.includePaths];
    }

    if (productConfig && productConfig?.excludePaths && productConfig?.excludePaths.length > 0) {
        cliffArgs = [...cliffArgs, '--exclude-path', ...productConfig.excludePaths];
    }

    let command = useNpx ? 'npx git-cliff' : 'git cliff';

    command = `${command} ${cliffArgs.join(' ')}`;

    console.log(`Executing '${command}'`);

    let chl = (await exec(command)).stdout.toString().trim();
    console.log(chl);
}

(async () => {
    await main();
})();
