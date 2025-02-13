import { figmaExport } from '@design-system/figma-export-feature';
import { figmaImport } from '@design-system/figma-import-feature';
import { FigmaExtractorSchema } from '@design-system/figma-shared-feature';
import { TokenPathName, getTokenPathName, getTokenPaths } from '@design-system/token-path-config-utils';

// eslint-disable-next-line no-console
console.info('Figma extractor started, downloading tokens takes some time');

let theme = process.argv.at(-1);
if (!theme) {
    theme = 'design-system';
}
let thatTheme = getTokenPathName(theme);
if (!thatTheme) {
    thatTheme = TokenPathName.DesignSystem;
}
const tokenPaths = getTokenPaths(thatTheme);

const config: FigmaExtractorSchema = {
    appName: thatTheme,
    tokenStoragePath: tokenPaths.jsonTokensPath,
    checkDeprecated: true,
    downloadTokensFromFigma: true,
    updateDevSettingsInFigma: false,
};

if (config.downloadTokensFromFigma) {
    figmaExport(config).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        // eslint-disable-next-line no-console
        console.error(error.message);
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    });
}

if (config.updateDevSettingsInFigma) {
    console.info(`Update dev settings in Figma for ${thatTheme}`);
    figmaImport(config).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error.message);
        // eslint-disable-next-line unicorn/no-process-exit
        process.exit(1);
    });
}
