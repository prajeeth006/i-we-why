import { getDesignSystemThemes } from '@design-system/shared-ds-utils';

export function getViewports() {
    return {
        small: { name: 'Small', styles: { width: '320px', height: '568px' } },
        medium: { name: 'Medium', styles: { width: '834px', height: '1112px' } },
    };
}

export type ModeType = {
    theme?: string;
    viewport?: string;
    backgrounds?: {
        value: string;
    };
};

export function getStoryModes(data = { themes: getDesignSystemThemes(), viewPorts: getViewports() }) {
    const allThemes: Record<string, ModeType> = {};
    const allModes: Record<string, ModeType> = {};

    for (const theme of Object.keys(data.themes)) {
        allThemes[theme] = {
            theme: theme,
        };

        for (const viewport of Object.keys(data.viewPorts)) {
            allModes[`${theme} ${viewport}`] = {
                theme: theme,
                viewport: viewport,
            };
        }
    }

    return { allThemes, allModes };
}
