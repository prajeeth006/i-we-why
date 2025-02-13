import { TokenPathName, getTokenPathName, getTokenPaths } from '@design-system/token-path-config-utils';
import { runGeneration } from '@design-system/tokens-to-css-feature';

export type TokensToCssSchema = {
    /** The path to the folder where exported and converted (W3C token draft) tokens are stored */
    tokenStoragePath: string;
    /** The path to the folder where the css style dictionary is stored */
    outputPath: string;
};

export default async function runExecutor(options: TokensToCssSchema) {
    // eslint-disable-next-line no-console
    const origLog = console.log;
    // eslint-disable-next-line no-console
    console.log = function (...args) {
        // eslint-disable-next-line no-console

        const args2 = args.join(',');
        if (args2.includes('filtered out token') || args2.includes('✔︎') || args2.includes('⚠️') || args2 === '\nscss' || args2 === '\ncss') {
            return;
        }

        origLog.call(this, ...args);
    };

    await runGeneration({
        tokenStoragePath: options.tokenStoragePath,
        outputPath: options.outputPath,
        error: 'throw',
    });

    // eslint-disable-next-line no-console
    console.log = origLog;
}

let theme = process.argv.at(-1);
if (!theme) {
    theme = 'design-system';
}
let thatTheme = getTokenPathName(theme);
if (!thatTheme) {
    thatTheme = TokenPathName.DesignSystem;
}
const tokenPaths = getTokenPaths(thatTheme);

runExecutor({
    tokenStoragePath: tokenPaths.jsonTokensPath,
    outputPath: tokenPaths.cssTokensPath,
}).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error.message);
    process.exit(1);
});
