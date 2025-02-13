# Shared Design System Utils

## Storybook

We provide a default configuration for Storybook. 
To use it, you are not allowed to import the package due to issues on how storybook internally handles the bundle process.
Therefore, you have to do a relative import to the package as follows

```ts 

import type { StorybookConfig } from '@storybook/angular';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { genericStorybookConfig } from './<path>/shared-storybook-utils/.storybook/config';

const config: StorybookConfig = {
    ...(genericStorybookConfig()),
}
```

### Storybook Bundling Process
Storybook differentiates between the manager and the preview builder (https://storybook.js.org/docs/builders/builder-api). The manager is responsible for rendering the UI of storybook
while the preview is responsible for managing the rendering of your stories. 
As of now (see https://github.com/storybookjs/storybook/pull/24765), Storybook manager does not allow to modify the tsconfig,
thus not allow to load packages from the monorepo. That is the reason, why we have to use relative paths. 

## Themepark Support

We also provide additional wrappers around the storybook config
to access themepark-based styling and classes.

For this, multiple setup steps are required:

1. Configure NX Project, where `<project>` has to be replaced with your project name where themes are located
```
"storybook": {
    "dependsOn": ["themepark-app:build-base", "<project>:build-themes"],
    ...
},
"build-storybook": {
    "dependsOn": ["themepark-app:build-base", "<project>:build-themes"],
}
```
2. Make built themes accessible by wrapping genericStorybookConfig
```
import { genericStorybookConfig, withPackageThemes, withThemeparkThemes } from './<path>/shared-storybook-utils/.storybook/config';

// ...

withPackageThemes(withThemeparkThemes(genericStorybookConfig()), <project path inside packages>, <project name (default path)>);
```
3. Provide a function with all classes that should be loaded, where `themeName` is the DS theme name:
```
function getLegacyAssetLinks(themeName: string) {
  return [
        // An example URL:
        `${baseUrl}/themepark/themes/${theme}/themes-${theme}-themeicons.css`,
        // ... all themepark urls and all app specific urls
  ];
}
```
4. Register this decorator in your preview.ts
```
import { storybookPreviewHelper } from '@design-system/shared-storybook-utils';

// ...

storybookPreviewHelper.getThemeParkDecorator(getLegacyAssetLinks),
```

## Shared A11Y Test Runner Config

For the test-runner you have to do the same workaround. The default configuration provides a setup for Axe A11Y testing.

```
import { TestRunnerConfig } from '@storybook/test-runner';
// eslint-disable-next-line @nx/enforce-module-boundaries
import {getTestRunnerConfig} from "./<path>/shared-storybook-utils/.storybook/storybook-testrunner";

const config: TestRunnerConfig = getTestRunnerConfig('dist/test-storybook/<nx-project-path>')

export default config;

```

## Themes Usage in Storybook

```ts
import { getDesignSystemThemes } from '@design-system/shared-storybook-utils';

const preview: Preview = {
    // ...
    decorators: [
        ///...
        withThemeByClassName<AngularRenderer>({
            themes: {
                ...getDesignSystemThemes(),
            },
            defaultTheme: 'BetMGM-light',
            parentSelector: 'body',
        }),
    ]
}
```

Usually, you can even use more granular helpers such as:
```ts 
const preview: Preview = {
    // ...
    decorators: [
        ...storybookPreviewHelper.getDefaultDecorators(),
    ],
}
```

or

```ts 
const preview: Preview = {
    // ...
    decorators: [
        getThemeDecorator(),
        // ... your other decorators
    ],
}
```

### Share class with storybook instance

If you want to also use the design system class for your global html, you can add it by using the following 
code snippet in your manager.ts, registering an addon listening to theme selection changes.

```
// eslint-disable-next-line @nx/enforce-module-boundaries
import { registerThemeInitiatorAddon } from '../../../design-system/shared-storybook-utils/.storybook/storybook-manager'

// eslint-disable-next-line @nx/enforce-module-boundaries
import { THEME_LIST } from '../../../design-system/shared-ds-utils/src/lib/themes.constant';
// ...

registerThemeInitiatorAddon(THEME_LIST);
```

