import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsBadge } from '@frontend/ui/badge';
import { DsButton } from '@frontend/ui/button';
import { DsCardFooter } from '@frontend/ui/card-footer';
import { DsDivider } from '@frontend/ui/divider';
import { DsIconButton } from '@frontend/ui/icon-button';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<DsCardFooter> = {
    title: 'Components/Card/Card Footer',
    parameters: {
        status: generateStatusBadges('UX-3220', ['draft']),
    },
    component: DsCardFooter,
    decorators: [moduleMetadata({ imports: [DsDivider, DsButton, DsIconButton, DsBadge, DemoIconComponent] })],
    excludeStories: /.*Data$/,
    argTypes: {
        variant: {
            options: ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'],
            table: { defaultValue: { summary: 'surface-low' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'Surface type',
        },
    },
    args: {
        variant: 'surface-low',
    },
};

export default meta;
type Story = StoryObj<DsCardFooter>;

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
        <ds-card-footer style="width:500px" variant="${args.variant}">
            <div style="display: inline-flex; justify-content: space-between; align-items: center; width: 100%;">
                <ds-badge variant="primary" size="medium">Label</ds-badge>
                <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
                    Flat Button
                <ds-demo-icon slot="end" />
                </button>
            </div>
        </ds-card-footer>
        `,
    }),
};

export const WithDivider: Story = {
    parameters: {
        name: 'WithDivider',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=13092-71080&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    name: 'Footer with divider',
    render: (args) => ({
        template: `
        <ds-card-footer style="width:500px" variant="${args.variant}">
            <ds-divider slot="divider"></ds-divider>
            <div style="display: inline-flex; justify-content: space-between; align-items: center; width: 100%;">
                <ds-badge variant="primary" size="medium">Label</ds-badge>
                <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
                    Flat Button
                <ds-demo-icon slot="end" />
                </button>
            </div>
        </ds-card-footer>
        `,
    }),
};
