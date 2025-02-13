import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsBadge } from '@frontend/ui/badge';
import { DsButton } from '@frontend/ui/button';
import { DsCardHeader } from '@frontend/ui/card-header';
import { DsDivider } from '@frontend/ui/divider';
import { DsIconButton } from '@frontend/ui/icon-button';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

type DsCardHeaderStoryType = DsCardHeader & { title: string; subtitle: string };

const meta: Meta<DsCardHeader> = {
    title: 'Components/Card/Card Header',
    parameters: {
        status: generateStatusBadges('UX-3220', ['draft']),
    },
    component: DsCardHeader,
    decorators: [moduleMetadata({ imports: [DsDivider, DsCardHeader, DsButton, DsIconButton, DsBadge, DemoIconComponent] })],
    excludeStories: /.*Data$/,
    argTypes: {
        title: {
            type: 'string',
            control: 'text',
            description: 'The text of the Title',
        },
        subtitle: {
            type: 'string',
            control: 'text',
            description: 'The text of the Subtitle',
        },
        variant: {
            options: ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'],
            table: { defaultValue: { summary: 'surface-low' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'Surface type',
        },
    },
    args: {
        title: 'Card Title',
        subtitle: 'Card Subtitle',
        variant: 'surface-low',
    },
};

export default meta;
type Story = StoryObj<DsCardHeaderStoryType>;

export const Default: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=13092-71080&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    name: 'Default',
    args: {
        ...meta.args,
    },
    render: (args) => ({
        template: `
        <ds-card-header style="width:500px" subtitle="${args.subtitle}" title="${args.title}" variant="${args.variant}">
            <ds-demo-icon iconName="imageNfl" style="width:20px; height:20px" slot="start" />
            <ds-badge slot="title" variant="primary" size="medium">Label</ds-badge>
            <ds-demo-icon iconName="chevron" style="transform: rotate(270deg); width: 16px;; width: 16px;" slot="title"/>
            <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
            Flat Button
            <ds-demo-icon slot="end" />
            </button>
        </ds-card-header>
        `,
    }),
};

export const ExpandableHeader: Story = {
    parameters: {
        name: 'Expandable',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=13092-71080&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    name: 'Expandable Header',
    render: (args) => ({
        template: `
        <ds-card-header style="width:500px" subtitle="${args.subtitle}" title="${args.title}" variant="${args.variant}" expandable="true">
            <ds-demo-icon iconName="imageNfl" style="width:20px; height:20px" slot="start" />
            <ds-badge slot="title" variant="primary" size="medium">Label</ds-badge>
            <ds-demo-icon iconName="chevron" style="transform: rotate(270deg); width: 16px;; width: 16px;" slot="title"/>
            <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
                Flat Button
            <ds-demo-icon slot="end" />
            </button>
            <ds-divider variant="on-surface-low" vertical slot="end"/>
        </ds-card-header>
        `,
    }),
};

export const AllCardHeaders: Story = {
    tags: ['docs-template'],
    parameters: {
        name: 'All variants',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=13092-71080&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    name: 'AllCardHeaders',
    render: (args) => ({
        template: `
        <div style="display:flex; flex-direction:column; gap: 40px;">
            <ds-card-header style="width:500px" subtitle="${args.subtitle}" title="${args.title}" variant="${args.variant}">
                <ds-demo-icon iconName="imageNfl" style="width:20px; height:20px" slot="start" />
                <ds-badge slot="title" variant="primary" size="medium">LABEL</ds-badge>
                <ds-demo-icon iconName="chevron" style="transform: rotate(270deg); width: 16px;; width: 16px;" slot="title"/>
                <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
                    Flat Button
                    <ds-demo-icon slot="end" />
                </button>
            </ds-card-header>
            <ds-card-header style="width:500px" subtitle="${args.subtitle}" title="${args.title}" variant="${args.variant}" expandable="true">
                <ds-demo-icon iconName="imageNfl" style="width:20px; height:20px" slot="start" />
                <ds-badge slot="title" variant="primary" size="medium">LABEL</ds-badge>
                <ds-demo-icon iconName="chevron" style="transform: rotate(270deg); width: 16px;; width: 16px;" slot="title"/>
                <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
                    Flat Button
                    <ds-demo-icon slot="end" />
                </button>
                <ds-divider variant="on-surface-low" vertical slot="end"/>
            </ds-card-header>
        </div>
        `,
    }),
};
