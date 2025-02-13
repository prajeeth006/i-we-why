import type { StorybookConfig } from '@storybook/angular';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { genericStorybookConfig } from '../../shared-storybook-utils/.storybook/config';

// import { genericStorybookConfig } from '@design-system/shared-storybook-utils';

const config: StorybookConfig = {
    ...genericStorybookConfig(),

    previewHead: (head) => `
${head}
<style>
    /*
    Override content visibility to be visible so that we circumvent an issue with chromatic screenshot capturing
    */

    storybook-root * {
        /* stylelint-disable */
        content-visibility: visible !important;
        /* stylelint-enable */
    }

    body {
        font-family: 'Nunito Sans', sans-serif;
    }
    body.dark-bg {
        background: var(--semantic-color-surface-base);
        color: var(--semantic-color-on-surface-base);
    }

    body.dark-bg  .sbdocs.sbdocs-preview {
        background: var(--semantic-color-surface-base);
        color: var(--semantic-color-on-surface-base);
    }

    storybook-root {
        /* This is required as otherwise the root element is not high enough with display inline if child is for example inline-flex */
        display: inline-flex;
    }

    .not-supported {
        align-self: center;
        background: red;
        padding: 10px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 600;
    }

   body:has([class*="inverse"]) {
    background: black; /* hardcoded for now till we get correct tokens for inverse background */
    color: var(--semantic-color-on-surface-base-inverse);
}

/* for light themes */
body:has(.ds-btn-outline-primary.ds-btn-inverse, .ds-bottom-nav):is(.th-mgm-4-light, .th-borgata-2-light) {
    background: #EAEBEC; /* hardcoded for now till we get correct tokens for inverse background */
    color: inherit;
}

body:has(.ds-bottom-nav):is(.th-giocodigitale, .th-premium) {
    background: #EAEBEC;
    color: inherit;
}

/*  for dark themes */
body:has(.ds-bottom-nav):is(.th-mgm-4-dark, .th-borgata-2-dark) {
    background: #FFFFFF; /* White background for dark themes */
    color: inherit;
}

/* bonus button */
body:has(.ds-btn-inverse.ds-bonus-button):is(.th-mgm-4-light, .th-borgata-2-light) {
    background: #EAEBEC;
    color: inherit;
}

    .not-supported::before {
        content: 'Not supported!'
    }

    .sbdocs img[title~='Entain'],
    .sbdocs img[title~='BetMGM'] {
        height: 25px;
        margin: 0 6px;
    }

    #welcome-ot-the-design-system-of-entain--betmgm ~ p:has(img) {
        text-align: center
    }

    .css-qa4clq:has(#all-components) {
        max-width: 95vw;
    }

      .ds-icon-button {
        ds-demo-icon {
            svg {
                height: var(--ds-button-icon-size-icon);
                width: var(--ds-button-icon-size-icon);
                color: var(--ds-button-icon-color);
            }
        }
    }

    .ds-button {
        ds-demo-icon {
            svg {
                height: var(--ds-button-size-icon);
                width: var(--ds-button-size-icon);
                color: var(--ds-button-icon-color);
            }
        }
    }

    .ds-social-button {
        ds-demo-icon {
            svg {
                height: var(--ds-button-social-size-icon);
                width: var(--ds-button-social-size-icon);
                color: var(--ds-button-icon-color);
            }
        }
    }

   .variant-info-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
    }
        
</style>
        `,
};

export default config;

// To customize your webpack configuration you can use the webpackFinal field.
// Check https://storybook.js.org/docs/react/builders/webpack#extending-storybooks-webpack-config
// and https://nx.dev/recipes/storybook/custom-builder-configs
