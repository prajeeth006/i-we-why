import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsBadge } from '@frontend/ui/badge';
import { DsDivider } from '@frontend/ui/divider';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DsListItem } from '@frontend/ui/list-item';
import { DsNotificationBubble } from '@frontend/ui/notification-bubble';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

type DsListItemStoryType = DsListItem & {
    showStartSlot: boolean;
    showCenterSlot: boolean;
    showEndSlot: boolean;
    showDivider?: boolean;
};

const meta: Meta<DsListItemStoryType> = {
    title: 'Components/List Item',
    parameters: {
        status: generateStatusBadges('UX-2307', ['integration ready']),
    },
    component: DsListItem,
    argTypes: {
        title: {
            type: 'string',
            table: { defaultValue: { summary: 'Title' } },
            control: 'text',
            description: 'The title of the list-item',
        },
        subtitle: {
            type: 'string',
            table: { defaultValue: { summary: 'Optional subtitle goes here' } },
            control: 'text',
            description: 'The subtitle of the list-item',
        },
        subtext: {
            type: 'string',
            table: { defaultValue: { summary: 'Optional subtext goes here' } },
            control: 'text',
            description: 'The subtext of the list-item',
        },
        selected: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'The selected state of the list item',
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the list-item',
        },
        boldTitle: {
            type: 'boolean',
            table: { defaultValue: { summary: 'true' }, category: 'Styling' },
            control: 'boolean',
            description: 'The bold title of list-item',
        },
        showStartSlot: {
            type: 'boolean',
            table: { defaultValue: { summary: 'true' } },
            control: 'boolean',
            description: 'The show start slot of list-item',
        },
        showCenterSlot: {
            type: 'boolean',
            table: { defaultValue: { summary: 'true' } },
            control: 'boolean',
            description: 'The show center slot of list-item',
        },
        showEndSlot: {
            type: 'boolean',
            table: { defaultValue: { summary: 'true' } },
            control: 'boolean',
            description: 'The show end slot of list-item',
        },
        showDivider: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'true' },
            },
            control: { type: 'boolean' },
            description: 'Whether we should show divider component on list-item',
        },
    },
    args: {
        title: 'Title',
        subtitle: 'Optional subtitle goes here',
        subtext: 'Optional subtext goes here',
        selected: false,
        inverse: false,
        boldTitle: true,
        showStartSlot: true,
        showCenterSlot: true,
        showEndSlot: true,
        showDivider: false,
    },
    decorators: [
        moduleMetadata({ imports: [DsNotificationBubble, DsListItem, DsBadge, DsIconButton, DemoIconComponent, DemoIconComponent, DsDivider] }),
    ],
};

export default meta;
type Story = StoryObj<DsListItemStoryType>;

export const Default: Story = {
    args: {
        ...meta.args,
    },
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/design/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens?node-id=16229-26872&t=yBn2QMYeJgMdJXf8-0',
        },
    },
    render: (args) => ({
        props: {
            ...args,
        },
        template: `
        <div style="width:500px;">
            <ds-list-item
                [selected]="${args.selected}" 
                [inverse]="${args.inverse}"
                [boldTitle]="${args.boldTitle}"
                [showCenterSlot]="${args.showCenterSlot}"
                [title]="'${args.title}'"
                [subtitle]="'${args.subtitle}'"
                [subtext]="'${args.subtext}'"
            >
                ${
                    args.showStartSlot
                        ? `
                <span slot="start">
                    ${svg}
                </span>
                `
                        : ''
                }
            
                ${
                    args.showEndSlot
                        ? `
                <ng-container slot="end">
                    <ds-demo-icon slot="center" />
                    <ds-badge variant="primary" size="medium">Label</ds-badge>
                    <ds-badge variant="primary" size="medium">Label</ds-badge>
                    <ds-notification-bubble variant="primary" [disabled]="false" size="large" [inverse]="false">0</ds-notification-bubble>
                    <button ds-icon-button size="medium" variant="flat" kind="utility">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z" fill="#1A56DB"/>
                    </svg>
                    </button>
                </ng-container>
                
                `
                        : ''
                }
            </ds-list-item>
       </div>
        ${args.showDivider ? '<ds-divider/>' : ''}
        `,
    }),
};

const svg = `
    <svg aria-hidden="true" width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="56" height="56" rx="28" fill="#F3F4F5"/>
    <path d="M28.0001 8.90909C29.1883 10.5841 33.8519 13.917 43.0001 13.917V25.7875C43.0001 29.9359 40.5929 40.1804 28.0005 47.2662C28.0002 47.2778 28.0007 47.2547 28.0005 47.2662C15.4074 40.1804 13.0001 29.9359 13.0001 25.8217V13.9511C22.1483 13.9511 26.8119 10.5841 28.0001 8.90909Z" fill="url(#paint0_linear_19318_23026)"/>
    <path d="M28.0004 43.6984C17.814 37.2983 16.0676 28.8545 16.0676 25.8217V16.8954C21.5363 16.4452 25.5015 14.8238 28.0045 13.0607C30.5106 14.8148 34.4749 16.417 39.9326 16.8623V25.7875C39.9326 28.8552 38.1847 37.2993 28.0004 43.6984ZM28.7201 45.9874L28.7412 45.9498C29.0487 46.0072 29.3646 46.1077 29.6851 46.2627C29.6617 46.2775 29.6384 46.2922 29.6149 46.3069C29.3448 46.1785 29.0444 46.0651 28.7201 45.9874Z" stroke="url(#paint1_linear_19318_23026)" stroke-width="6.13505"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M28.0023 11.7265C30.3423 13.5934 34.6221 15.5412 41.0369 15.8761V25.7048L41.0403 25.7624C41.2363 29.0941 39.1209 38.1676 28.0002 44.8552C16.8767 38.168 14.7637 29.1256 14.9595 25.7965L14.9629 25.739V15.9098C21.3856 15.5713 25.6653 13.6013 28.0023 11.7265Z" fill="#DCDFE4"/>
    <path d="M27.9996 44.855V11.7284C28.0004 11.7278 28.0012 11.7271 28.002 11.7265C30.342 13.5934 34.6218 15.5412 41.0366 15.8761V25.7048L41.04 25.7624C41.236 29.0941 39.1205 38.1676 27.9999 44.8552L27.9996 44.855Z" fill="#C3C4C7"/>
    <path d="M27.9996 47.2662L27.9999 47.2663C28.2338 47.1347 28.4642 47.002 28.6912 46.8683L28.7253 46.8482C40.6854 39.7848 42.9995 29.8974 42.9995 25.7876V13.9171C35.401 13.9171 30.8964 11.6177 28.9075 9.87885C28.5019 9.52427 28.2009 9.19301 27.9996 8.9093V10.826C28.0001 10.8256 28.0005 10.8253 28.0009 10.8249C30.1574 12.7359 34.6169 14.9567 41.6909 15.2032V25.7876C41.6909 29.4942 39.5707 38.9513 27.9999 45.7567L27.9996 45.7565V47.2662Z" fill="#C3C4C7"/>
    <path d="M27.9996 47.2662L27.9993 47.2663C27.7654 47.1347 27.535 47.002 27.3081 46.8683L27.2739 46.8482C15.3139 39.7848 12.9997 29.8974 12.9997 25.7876V13.9171C20.5983 13.9171 25.1028 11.6177 27.0918 9.87885C27.4974 9.52427 27.7984 9.19301 27.9996 8.9093V10.826C27.9992 10.8256 27.9988 10.8253 27.9983 10.8249C25.8418 12.7359 21.3824 14.9567 14.3084 15.2032V25.7876C14.3084 29.4942 16.4286 38.9513 27.9993 45.7567L27.9996 45.7565V47.2662Z" fill="#DCDFE4"/>
    <defs>
    <linearGradient id="paint0_linear_19318_23026" x1="28.0001" y1="13.0576" x2="28.0001" y2="49.1391" gradientUnits="userSpaceOnUse">
    <stop stop-color="#858585"/>
    <stop offset="0.250185" stop-color="white"/>
    <stop offset="0.550534" stop-color="#FCFCFC"/>
    <stop offset="1" stop-color="#757576"/>
    </linearGradient>
    <linearGradient id="paint1_linear_19318_23026" x1="28.0001" y1="8.90909" x2="28.0001" y2="47.2696" gradientUnits="userSpaceOnUse">
    <stop stop-color="white"/>
    <stop offset="0.355148" stop-color="white"/>
    <stop offset="1" stop-color="white"/>
    </linearGradient>
    </defs>
    </svg>`;
