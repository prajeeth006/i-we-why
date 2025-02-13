import { StorybookConfig } from '@storybook/angular';

export function genericStorybookConfig(): StorybookConfig {
    return {
        addons: [
            '@storybook/addon-essentials',
            '@storybook/addon-interactions',
            '@storybook/addon-designs',
            '@storybook/addon-a11y',
            '@storybook/addon-themes',
            'storybook-addon-pseudo-states',
            '@etchteam/storybook-addon-status',
            '@storybook/addon-mdx-gfm',
        ],
        core: {
            disableTelemetry: true,
        },
        docs: {
            defaultName: 'Overview',
        },
        framework: {
            name: '@storybook/angular',
            options: {},
        },
        logLevel: 'info',
        staticDirs: ['./public'],
        stories: ['../**/*.stories.@(js|jsx|ts|tsx)', '../**/*.mdx'],
    };
}

const workspaceRoot = __dirname.slice(0, Math.max(0, __dirname.lastIndexOf('packages')));

export function withThemeparkThemes(config: StorybookConfig): StorybookConfig {
    if (typeof config.staticDirs === 'function') {
        throw new TypeError('invalid config');
    }

    return {
        ...config,
        staticDirs: [...(config.staticDirs ?? []), { from: `${workspaceRoot}dist/build-themes/packages/themepark`, to: 'themepark' }],
    };
}

export function withPackageThemes(config: StorybookConfig, path: string, name: string = path): StorybookConfig {
    if (typeof config.staticDirs === 'function') {
        throw new TypeError('invalid config');
    }

    return {
        ...config,
        staticDirs: [...(config.staticDirs ?? []), { from: `${workspaceRoot}dist/build-themes/packages/${path}`, to: name }],
    };
}
