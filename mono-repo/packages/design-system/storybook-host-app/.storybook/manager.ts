import { addons } from '@storybook/manager-api';
import { create } from '@storybook/theming';

const inputRadius = 6;
addons.setConfig({
    sidebar: {
        filters: {
            patterns: (story) => !story?.tags?.includes('docs-template'),
        },
    },
    theme: create({
        fontBase: '"Mulish", sans-serif',
        base: 'light',
        brandTitle: `
      <div style="display: flex; align-items: center;">
        <img src="symbol.svg" width="38px" height="43px" style="margin-right: 5px;" />
<span style="display: inline-block; font-size: 14px; vertical-align: middle; font-weight: 900;">Dice Storybook</span>      </div>
    `,
        brandTarget: '_self',
        colorPrimary: '#9453AD',
        colorSecondary: '#639496',

        // UI
        appBg: '#ffffff',
        appContentBg: '#f1f0f2',
        appBorderRadius: 1,

        // Text colors
        textColor: '#58585A',
        textInverseColor: '#C1C6C9',

        // Toolbar default and active colors
        barTextColor: '#58585A',
        barSelectedColor: '#639496',
        barBg: '#FAFAFB',
        barHoverColor: '#639496',

        inputBg: '#F8F7FA',
        inputBorder: '#DBD9E1',
        inputTextColor: '#1C1B1E',
        inputBorderRadius: inputRadius,
    }),
});
