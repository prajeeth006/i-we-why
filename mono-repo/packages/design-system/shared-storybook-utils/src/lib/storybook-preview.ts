import { getDesignSystemThemes } from '@design-system/shared-ds-utils';
import { DecoratorHelpers, withThemeByClassName } from '@storybook/addon-themes';
import { AngularRenderer, componentWrapperDecorator } from '@storybook/angular';
import { Args, PartialStoryFn, Renderer, StoryContext } from '@storybook/types';

import { StatusBadge } from './storybook-status-badges/storybook-status-badges.interface';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { getViewports } from './storybook-viewports';

type DecoratorFunction<TRenderer extends Renderer = AngularRenderer, TArgs = Args> = (
    fn: PartialStoryFn<TRenderer, TArgs>,
    c: StoryContext<TRenderer, TArgs>,
) => TRenderer['storyResult'];

export function getThemeDecorator(config: { only?: string[]; exclude?: string[] } = {}, defaultTheme = 'BetMGM-hybrid'): DecoratorFunction {
    return withThemeByClassName<AngularRenderer>({
        themes: getDesignSystemThemes(config),
        defaultTheme: defaultTheme,
        parentSelector: 'body',
    });
}

export function getStatusDefinitions(): Record<StatusBadge, { background: string; color: string; description: string }> {
    return {
        'draft': {
            background: '#f4c409',
            color: '#ffffff',
            description: 'This component is in progress.',
        },
        'UX review': {
            background: '#cccccc',
            color: '#000000',
            description: 'This component is waiting for UX review and sign-off.',
        },
        'experimental': {
            background: '#d05938',
            color: '#ffffff',
            description: 'This component is experimental.',
        },
        'integration ready': {
            background: '#6ad038',
            color: '#ffffff',
            description: 'This component is ready for integration.',
        },
        'stable': {
            background: '#000000',
            color: '#ffffff',
            description: 'This component is ready for integration.',
        },
        'jira': {
            background: '#6d47d7',
            color: '#ffffff',
            description: 'Jira epic link',
        },
        'a11y': {
            background: '#0383b4',
            color: '#ffffff',
            description: 'Accessibility is implemented and available',
        },
    };
}

export function getDefaultParameters() {
    return {
        layout: 'centered',
        backgrounds: { disable: true },
        viewport: {
            viewports: getViewports(),
        },
        chromatic: {
            // We do not set any mode here as mode gets stacked and we only know at story level what to test
            modes: {},
            disableSnapshot: true,
        },
        a11y: {
            //TODO Removed disabled contrast ratio rule when themes are fixed in Figma
            config: {
                rules: [{ id: 'color-contrast', enabled: false }],
            },
            // Reports the violations in the UI
            report: true,
        },
        status: {
            statuses: getStatusDefinitions(),
        },
    };
}

/**
 * @param assetLinks assetLinks(themeName) a function that returns paths put in <link> tags from themepark based styles.
 */
export const withThemeparkLayout =
    (assetLinks: (x: string) => string[]) =>
    <TRenderer extends Renderer = AngularRenderer, TArgs = Args>(storyFn: PartialStoryFn<TRenderer, TArgs>, context: StoryContext) => {
        const { themeOverride } = DecoratorHelpers.useThemeParameters();
        const themeName = themeOverride || DecoratorHelpers.pluckThemeFromContext(context) || 'Bwin-light';
        const themeParkLinks = document.querySelectorAll('.themeParkCss');
        themeParkLinks.forEach((link) => {
            link.remove();
        });

        const styleNames = assetLinks(themeName);
        const headElement = document.querySelector('head');

        if (!headElement) {
            console.warn('No head element found, cannot inject themepark');
            return storyFn();
        }

        styleNames.forEach((styleName) => {
            const themeParkLink = document.createElement('link');
            themeParkLink.setAttribute('type', 'text/css');
            themeParkLink.setAttribute('rel', 'stylesheet');
            headElement.append(themeParkLink);
            themeParkLink.className = 'themeParkCss';
            themeParkLink.setAttribute('href', styleName);
        });
        return storyFn();
    };

export function getThemeParkDecorator(assetLinks: (x: string) => string[]): DecoratorFunction {
    return (storyFn, context) => withThemeparkLayout(assetLinks)(storyFn, context);
}

export function getDefaultDecorators() {
    return [getThemeDecorator(), getSitecoreDecorator()];
}

/**
 * Default layout stories decorator used to provide custom style of #storybook-root element for Sitecore component preview.
 * Use by providing additional URL parameter &layout=sitecore at the end of Storybook story URL.
 * Example: http://storybook.entaingroup.corp/latest/?args=&id=components-button-button--no-icon&viewMode=story&layout=sitecore
 */

const getArgsFromURL = () => Object.fromEntries(new URLSearchParams(window.location.search).entries());

export const withSitecoreLayout = () => {
    const args = getArgsFromURL();
    const layout = args['layout'] === 'sitecore';
    const style = layout ? 'position: absolute; top: 0; left: 0; margin: 0;' : '';
    return componentWrapperDecorator((story) => {
        const storybookRoot = document.querySelector('#storybook-root');
        if (storybookRoot && layout) {
            storybookRoot.className = ''; // ? '' : 'sb-show-main sb-main-centered';
        }
        return `<div style="${style}">${story}</div>`;
    });
};

export function getSitecoreDecorator(): DecoratorFunction {
    return (storyFn, context) => withSitecoreLayout()(storyFn, context);
}
