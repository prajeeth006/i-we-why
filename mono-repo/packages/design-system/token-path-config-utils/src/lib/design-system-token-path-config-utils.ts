import { tokens as casinoTokens } from '../figma-configs/casino';
import { tokens as dsTokens } from '../figma-configs/design-system';
import { tokens as sportsTokens } from '../figma-configs/sports';
import { FigmaFileKeyType } from '../types/figma-file-key.type';
import { TokenPathName } from '../types/token-path-name.type';
import { TokenPathType } from '../types/token-path.type';
import { findFileKey, registerTokens } from './token-loader.utils';

registerTokens(TokenPathName.Casino, casinoTokens);
registerTokens(TokenPathName.DesignSystem, dsTokens);
registerTokens(TokenPathName.Sports, sportsTokens);

const tokenPathConfig: Record<TokenPathName, TokenPathType> = {
    [TokenPathName.DesignSystem]: {
        uiComponentsPath: 'packages/design-system/ui',
        cssTokensPath: 'packages/design-system/ui/generated',
        jsonTokensPath: 'packages/design-system/tokens-assets/generated',
        exportPrefix: 'ds',
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        reviewerIds: [
            80, // stefan.gart
            1240, // jtomaszewska
            1273, // Igor.Radovanovic
            2186, // SaiKumar.Duggana
            2722, // Santoshi.Dandi
            // 2767, // Enea.Jahollari
            // 3312, // Markus.Nissl
            3330, // Madhav.Bhushan
            // 3460, // Julia.Rapczynska,
        ],
    },
    [TokenPathName.Sports]: {
        uiComponentsPath: 'packages/sports/libs/ui',
        cssTokensPath: 'packages/sports/libs/ui/generated',
        jsonTokensPath: 'packages/sports/tokens-assets/generated',
        exportPrefix: 'sp',
    },
    [TokenPathName.Casino]: {
        uiComponentsPath: 'packages/casino/ui-libs',
        cssTokensPath: 'packages/casino/ui-libs/generated',
        jsonTokensPath: 'packages/casino/tokens-assets/generated',
        exportPrefix: 'cs',
    },
};

export function getTokenPaths(name: TokenPathName) {
    return tokenPathConfig[name];
}

export function getTokenPathName(name: string) {
    return Object.values(TokenPathName).includes(name as TokenPathName) ? (name as TokenPathName) : null;
}

export function getTokenPathsByFigmaKey(figmaFileKey: FigmaFileKeyType) {
    const tokenPath = findFileKey(figmaFileKey);

    if (tokenPath) {
        return getTokenPaths(tokenPath);
    }

    return null;
}

export function getAllTokenPaths() {
    return tokenPathConfig;
}
