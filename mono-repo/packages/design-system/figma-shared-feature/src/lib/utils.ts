import { FigmaClient, IFigmaClient } from '@design-system/figma-data-access';
import { TokenPathName, getFigmaFiles } from '@design-system/token-path-config-utils';

export function getFiles(options: FigmaExtractorSchema) {
    let files: { fileKey: string; originalFileKey?: string }[];
    files = options.fileKey ? [{ fileKey: options.fileKey, originalFileKey: options.originalFileKey }] : getFigmaFiles(options.appName);
    return files;
}

export type FigmaExtractorSchema = {
    /** The app name of the file keys to load are stored */
    appName: TokenPathName;
    /** The path to the folder where exported and converted (W3C token draft) tokens are stored */
    tokenStoragePath: string;
    /** The file key of the figma file to be downloaded, skips filesStoragePath if provided */
    fileKey?: string;
    /** In case you download a branch file, the original file key */
    originalFileKey?: string;
    /** Should check deprecated files */
    checkDeprecated: boolean;
    /** Whether new tokens should be downloaded from Figma (enable export) */
    downloadTokensFromFigma: boolean;
    /** Write back developer settings in Figma (enable name import) */
    updateDevSettingsInFigma: boolean;
};

export function getFigmaClient(figmaApiToken: string): IFigmaClient {
    return new FigmaClient({
        personalAccessToken: figmaApiToken,
    });
}
