import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsBadge } from '@frontend/ui/badge';
import { DsButton } from '@frontend/ui/button';
import { DsCardExpandable } from '@frontend/ui/card-expandable';
import { DsCardHeader } from '@frontend/ui/card-header';
import { DsDivider } from '@frontend/ui/divider';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DsSegmentedControl, DsSegmentedOption } from '@frontend/ui/segmented-control';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

type DsCardExpandableStoryType = DsCardExpandable & { title: string; subtitle: string };

const meta: Meta<DsCardExpandableStoryType> = {
    title: 'Components/Card/Card Expandable',
    parameters: {
        status: generateStatusBadges('UX-2399', ['draft']),
    },
    component: DsCardExpandable,
    decorators: [
        moduleMetadata({
            imports: [DsCardHeader, DsButton, DsIconButton, DemoIconComponent, DsBadge, DsSegmentedControl, DsSegmentedOption, DsDivider],
        }),
    ],
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
        elevated: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'true' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'The elevated state of the card',
        },
        variant: {
            options: ['surface-lowest', 'surface-low', 'surface-high'],
            table: { defaultValue: { summary: 'surface-lowest' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'Surface type',
        },
        headerVariant: {
            options: ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'],
            table: { defaultValue: { summary: 'surface-low' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'Surface type',
        },
    },
    args: {
        title: 'Card Title',
        subtitle: 'Card Subtitle',
        elevated: true,
        variant: 'surface-lowest',
        headerVariant: 'surface-low',
    },
};

export default meta;
type Story = StoryObj<DsCardExpandableStoryType>;

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
            <div style="width:500px">
                <ds-card-expandable expanded="true" title="${args.title}" subtitle="${args.subtitle}" elevated="${args.elevated}"
                    variant="${args.variant}" headerVariant="${args.headerVariant}">


                    <ds-badge slot="title" variant="primary" size="medium">Label</ds-badge>
                    <ds-demo-icon iconName="chevron" style="transform: rotate(270deg); width: 16px;" slot="title" />
                    <ds-demo-icon iconName="imageNfl" style="width:20px; height:20px" slot="start" />
                        <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
                        Flat Button
                        <ds-demo-icon slot="end" />
                    </button>
                    <ds-divider variant="on-surface-low" vertical slot="end"/>
                    <div style="text-align:center; padding: 10px;">
                        <ds-segmented-control [fullWidth]="false" [inverse]="false" [activeOption]="''">
                            <ds-segmented-option name="A" title="Label1" />
                            <ds-segmented-option name="1" title="Label2" />
                            <ds-segmented-option name="2" title="Label3" />
                            <ds-segmented-option name="3" title="CustomLabel">
                                <ng-template #dsTemplate>
                                    <span>CustomLabel</span>
                                </ng-template>
                            </ds-segmented-option>
                        </ds-segmented-control>
                    </div>
                    <div style="text-align:center; padding: 10px;">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.</p>
                        <button slot="button" ds-button variant="filled" kind="primary" size="large">
                            Click me<ds-demo-icon slot="end" />
                        </button>
                    </div>
                </ds-card-expandable>
            </div>
        `,
    }),
};
