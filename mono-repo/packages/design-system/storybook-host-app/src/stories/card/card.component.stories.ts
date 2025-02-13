import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoChevronComponent, DemoIconComponent, DemoImage, DsEntityLogoDemo } from '@design-system/storybook-demo-cmp-lib';
import { DsBadge } from '@frontend/ui/badge';
import { DsButton } from '@frontend/ui/button';
import { DsCard, DsCardContent } from '@frontend/ui/card';
import { DsCardFooter, DsCardFooterVariant } from '@frontend/ui/card-footer';
import { DsCardHeader, DsCardHeaderVariant } from '@frontend/ui/card-header';
import { DsDivider } from '@frontend/ui/divider';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DsSegmentedControl, DsSegmentedOption } from '@frontend/ui/segmented-control';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

type DsCardStoryType = DsCard & { headerVariant?: DsCardHeaderVariant; title?: string; subtitle?: string; footerVariant?: DsCardFooterVariant };

const meta: Meta<DsCardStoryType> = {
    title: 'Components/Card/Card',
    component: DsCard,
    decorators: [
        moduleMetadata({
            imports: [
                DsBadge,
                DsCardHeader,
                DsButton,
                DsIconButton,
                DemoIconComponent,
                DsBadge,
                DemoChevronComponent,
                DemoImage,
                DsSegmentedControl,
                DsSegmentedOption,
                DsEntityLogoDemo,
                DsCardContent,
                DsCardFooter,
                DsDivider,
            ],
        }),
    ],
    excludeStories: /.*Data$/,
    parameters: {
        name: 'Default',
        viewMode: 'docs',
        status: generateStatusBadges('UX-3220', ['draft']),
    },
    argTypes: {
        elevated: {
            type: 'boolean',
            table: { defaultValue: { summary: 'true' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The elevated state of the card',
        },
        noOverflow: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'Applies style overflow hidden to the card',
        },
        noBorder: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'Removes border from the card',
        },
        noBorderRadius: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'Removes border-radius from the card',
        },
        variant: {
            options: ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'],
            table: { defaultValue: { summary: 'surface-lowest' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'Surface type',
        },
    },
    args: {
        elevated: true,
        variant: 'surface-lowest',
        noOverflow: true,
        noBorderRadius: false,
        noBorder: false,
    },
};

export default meta;
type Story = StoryObj<DsCardStoryType>;

export const Default: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=13092-70210&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    argTypes: {
        noOverflow: {
            table: { disable: true },
        },
    },
    args: {
        ...meta.args,
    },
    render: (args) => ({
        template: `
        <ds-card style="height: 347px; width:359px;" noBorderRadius="${args.noBorderRadius}" noBorder="${args.noBorder}" variant="${args.variant}" elevated="${args.elevated}">
        </ds-card>
        `,
    }),
};

export const noOverflow: Story = {
    tags: ['docs-template'],
    parameters: {
        name: 'noOverflow',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=13092-70210&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
    },
    render: (args) => ({
        template: `
        <ds-card style="width:250px;" noOverflow="${args.noOverflow}" elevated="${args.elevated}">
                <div style="text-align:center;">
                    <ds-entity-logo-demo style="width:250px; height: 150px; background-color: #90EE90" slot="close" size="large">${svgDataArray[0]}</ds-entity-logo-demo>
                        <div style="padding: 10px;">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. </p>
                            <button slot="button" ds-button variant="filled" kind="primary" size="large">
                                Click me<ds-demo-icon slot="end" />
                            </button>
                        </div>
                </div>
        </ds-card>
        `,
    }),
};

export const noBorderRadius: Story = {
    tags: ['docs-template'],
    parameters: {
        name: 'noBorderRadius',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=13092-70210&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
        noBorderRadius: true,
    },
    render: (args) => ({
        template: `
        <ds-card style="width:250px;" noBorderRadius="${args.noBorderRadius}" elevated="${args.elevated}">
                <div style="text-align:center;">
                    <ds-entity-logo-demo style="width:250px; height: 150px; background-color: #90EE90" slot="close" size="large">${svgDataArray[0]}</ds-entity-logo-demo>
                        <div style="padding: 10px;">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. </p>
                            <button slot="button" ds-button variant="filled" kind="primary" size="large">
                                Click me<ds-demo-icon slot="end" />
                            </button>
                        </div>
                </div>
        </ds-card>
        `,
    }),
};

export const noBorder: Story = {
    tags: ['docs-template'],
    parameters: {
        name: 'noBorder',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=13092-70210&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
        noBorder: true,
    },
    render: (args) => ({
        template: `
        <ds-card style="width:250px;" noBorder="${args.noBorder}" elevated="${args.elevated}">
                <div style="text-align:center;">
                    <ds-entity-logo-demo style="width:250px; height: 150px; background-color: #90EE90" slot="close" size="large">${svgDataArray[0]}</ds-entity-logo-demo>
                        <div style="padding: 10px;">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. </p>
                            <button slot="button" ds-button variant="filled" kind="primary" size="large">
                                Click me<ds-demo-icon slot="end" />
                            </button>
                        </div>
                </div>
        </ds-card>
        `,
    }),
};

export const WithCardHeader: Story = {
    parameters: {
        name: 'WithCardHeader',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=12176-115216&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    argTypes: {
        noOverflow: {
            table: { disable: true },
        },
        headerVariant: {
            options: ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'],
            table: { defaultValue: { summary: 'surface-low' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'Surface type',
        },
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
    },
    args: {
        ...meta.args,
        headerVariant: 'surface-low',
        title: 'Card Header',
        subtitle: 'Card Subtitle',
    },
    render: (args) => ({
        template: `
        <ds-card style="width:359px;"  elevated="${args.elevated}" noBorderRadius="${args.noBorderRadius}" noBorder="${args.noBorder}">
                <ds-card-header title="${args.title}" subtitle="${args.subtitle}" variant="${args.variant}" headerVariant="${args.headerVariant}">
                 <ds-demo-image style="width:20px; height:20px" slot="start" />
                <ds-badge slot="title" variant="primary" size="medium">Label</ds-badge>
                <ds-demo-chevron style="transform: rotate(270deg); width: 16px;" slot="title"/>
                <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
                    Flat Button
                    <ds-demo-icon slot="end" />
                </button>
</ds-card-header>
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
        </ds-card>
        `,
    }),
};

export const WithHover: Story = {
    parameters: {
        name: 'withHover',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=13092-70210&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
    },
    render: (args) => ({
        template: `
        <ds-card withHover style="width:250px;" noOverflow="${args.noOverflow}" elevated="${args.elevated}">
                <div style="text-align:center;">
                    <ds-entity-logo-demo style="width:250px; height: 150px; background-color: #90EE90" slot="close" size="large">${svgDataArray[0]}</ds-entity-logo-demo>
                        <div style="padding: 10px;">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. </p>
                            <button slot="button" ds-button variant="filled" kind="primary" size="large">
                                Click me<ds-demo-icon slot="end" />
                            </button>
                        </div>
                </div>
        </ds-card>
        `,
    }),
};

export const WithCardHeaderContentFooter: Story = {
    parameters: {
        name: 'WithCardHeaderContentFooter',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=12176-115216&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    argTypes: {
        noOverflow: {
            table: { disable: true },
        },
        headerVariant: {
            options: ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'],
            table: { defaultValue: { summary: 'surface-low' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'Header surface type',
        },
        footerVariant: {
            options: ['surface-lowest', 'surface-low', 'surface-high', 'surface-highest'],
            table: { defaultValue: { summary: 'surface-low' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'Footer surface type',
        },
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
    },
    args: {
        ...meta.args,
        headerVariant: 'surface-low',
        footerVariant: 'surface-low',
        title: 'Card Header',
        subtitle: 'Card Subtitle',
    },
    render: (args) => ({
        template: `
        <ds-card style="width:359px;" noBorderRadius="${args.noBorderRadius}" noBorder="${args.noBorder}" elevated="${args.elevated}">
            <ds-card-header title="${args.title}" subtitle="${args.subtitle}" variant="${args.variant}" headerVariant="${args.headerVariant}">
                 <ds-demo-image style="width:20px; height:20px" slot="start" />
                <ds-badge slot="title" variant="primary" size="medium">Label</ds-badge>
                <ds-demo-chevron style="transform: rotate(270deg); width: 16px;" slot="title"/>
                <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
                    Flat Button
                    <ds-demo-icon slot="end" />
                </button>
            </ds-card-header>
            <ds-card-content>
                            <div style="text-align:center; padding: 10px;">
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                            dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                            ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                            deserunt mollit anim id est laborum.</p>
                    </div>
            </ds-card-content>
            <ds-card-footer variant="${args.variant}">
                <ds-divider slot="divider"/>
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
            </ds-card-footer>
        </ds-card>
        `,
    }),
};

const svgDataArray = [
    `
    <svg style="display: block;" width="200" height="150" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
        </svg>
`,
];
