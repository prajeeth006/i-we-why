import { FigmaConfigType } from '../types/figma-config.type';
import { FigmaFileKeyType } from '../types/figma-file-key.type';
import { TokenPathName } from '../types/token-path-name.type';

const figmaFiles: Record<FigmaFileKeyType, TokenPathName> = {};

const figmaFilesPerToken: Record<TokenPathName, FigmaConfigType[]> = {
    [TokenPathName.Casino]: [],
    [TokenPathName.DesignSystem]: [],
    [TokenPathName.Sports]: [],
};

export function registerTokens(name: TokenPathName, figmaConfigTypes: FigmaConfigType[]) {
    figmaConfigTypes.forEach((figmaConfigType) => {
        if (figmaConfigType.fileKey in figmaFiles || (figmaConfigType.originalFileKey != null && figmaConfigType.originalFileKey in figmaFiles)) {
            throw new Error(`Figma file already exist: ${figmaConfigType.fileKey}`);
        }
        // eslint-disable-next-line functional/immutable-data
        figmaFiles[figmaConfigType.fileKey] = name;
        if (figmaConfigType.originalFileKey) {
            figmaFiles[figmaConfigType.originalFileKey] = name;
        }
    });
    // eslint-disable-next-line functional/immutable-data
    figmaFilesPerToken[name] = figmaConfigTypes;
}

export function findFileKey(fileKey: string) {
    if (fileKey in figmaFiles) {
        return figmaFiles[fileKey];
    }
    return null;
}

export function getFigmaFiles(name: TokenPathName) {
    if (name in figmaFilesPerToken) {
        return figmaFilesPerToken[name];
    }
    return [];
}
