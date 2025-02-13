import { addons, types } from '@storybook/manager-api';

import { ManagerThemeInitiator } from './theme-initiator';

/* This addon adds the design system class to storybook body */
export function registerThemeInitiatorAddon(
    THEME_LIST: {
        name: string;
        mainThemeparkClass: string;
        enableDarkBg: boolean;
    }[],
) {
    addons.register('manager-theme-initiator', () => {
        // Register the tool
        addons.add('manager-theme-initiator', {
            type: types.TOOL,
            title: 'Manager Theme Initiator',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            render: ManagerThemeInitiator(THEME_LIST),
        });
    });
}
