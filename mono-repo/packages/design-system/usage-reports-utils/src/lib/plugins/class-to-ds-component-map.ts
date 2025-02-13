import { DsComponentReplacementConfig } from '../../models';

export const ClassToDsComponentMap: DsComponentReplacementConfig = {
    'pill-with-badge, pill-with-badge-v2': {
        componentName: 'DsPill',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-pill--overview',
    },
    'offer-badge': {
        componentName: 'DsBadge',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-badge--overview',
    },
    'tab-nav, nav-tabs, tab-nav-item': {
        componentName: 'DSTabsModule',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-tabsgroup--overview',
    },
    'btn': {
        componentName: 'DsButton',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-button-button--overview',
    },
    'card': {
        componentName: 'DsCard',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/atoms-card-card--overview',
    },
    'loading, loading-v2, loading-v3': {
        componentName: 'DsLoadingSpinner',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/story/components-loading-spinner--default',
    },
    'collapsible-container': {
        componentName: 'DsCardExpandable',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-card-card-expandable--overview',
    },
    'divider': {
        componentName: 'DsDivider',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-divider--overview',
    },
    'count, badge-circle': {
        componentName: 'DsNotificationBubble',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-notification-bubble--overview',
    },
    'custom-control-checkbox': {
        componentName: 'DsCheckbox',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-checkbox--overview',
    },
    'custom-control-radio': {
        componentName: 'DsRadioModule',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-radio-button--overview',
    },
    'form-control-tabs-segmented-v2, form-control-tabs-segmented-flex, form-control-tabs-segmented-v2-dark, form-control-tabs-segmented-v3, form-control-tabs-segmented-v4, form-control-tabs-segmented':
        {
            componentName: 'DsSegmentedControlModule',
            storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-segmented-control--overview',
        },
    'custom-control-switcher': {
        componentName: 'DsSwitch',
        storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-switch--overview',
    },
};
