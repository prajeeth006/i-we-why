import React from 'react';

import { useChannel, useGlobals } from '@storybook/manager-api';

// This component adds the selected theme classes on the body of manager html
export const ManagerThemeInitiator =
    (
        THEME_LIST: {
            name: string;
            mainThemeparkClass: string;
            enableDarkBg: boolean;
        }[],
    ) =>
    () => {
        const find_theme_class = (th: string) => {
            const selectedTheme = THEME_LIST.find((themeEntry) => themeEntry.name === th);
            return selectedTheme?.mainThemeparkClass ?? '';
        };

        const is_dark_bg = (th: string) => {
            const selectedTheme = THEME_LIST.find((themeEntry) => themeEntry.name === th);
            return selectedTheme?.enableDarkBg ?? false;
        };

        const set_current_theme = (th: string) => {
            if (th) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                const existingOnes = [...document.body.classList.values()].filter((cls) => cls.startsWith('th-'));
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                existingOnes.forEach((cls) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    document.body.classList.remove(cls);
                });
                document.body.classList.add(th);
            }
        };

        const set_current_background = (darkBg: boolean) => {
            document.body.classList.remove('dark-bg');
            if (darkBg) {
                document.body.classList.add('dark-bg');
            }
        };

        const [{ theme: selected }] = useGlobals();

        if (typeof selected === 'string') {
            set_current_theme(find_theme_class(selected));
            set_current_background(is_dark_bg(selected));

            useChannel({
                ['storybook/themes/REGISTER_THEMES']: (registered) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    const themeName = selected || (registered.defaultTheme as string);
                    set_current_theme(find_theme_class(themeName));
                    set_current_background(is_dark_bg(selected));
                },
            });
        }

        return <></>;
    };
