import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent, DemoSuccessComponent } from '@design-system/storybook-demo-cmp-lib';
import { DS_ALERT_TYPE_ARRAY, DsAlert } from '@frontend/ui/alert';
import { DsButton } from '@frontend/ui/button';
import { DsIconButton } from '@frontend/ui/icon-button';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

type DsAlertType = DsAlert & { hideHeader: boolean; hideRightIcon: boolean; hideFooter: boolean; content: string; footerButtonsCount: number };

const meta: Meta<DsAlertType> = {
    title: 'Components/Alert',
    component: DsAlert,
    parameters: {
        status: generateStatusBadges('UX-2411', ['integration ready']),
    },
    excludeStories: /.*Data$/,
    args: {
        type: 'success',
        inverse: false,
        hideRightIcon: false,
        content: 'Lorem ipsum dolor sit amet consectetur!',
    },
    argTypes: {
        type: {
            options: DS_ALERT_TYPE_ARRAY,
            table: {
                defaultValue: { summary: 'success' },
                category: 'Styling',
            },
            control: { type: 'select' },
            description: 'The type of the alert',
        },
        inverse: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'The inverse state of the alert',
        },
        hideRightIcon: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'The hide close icon of the alert',
        },
        content: {
            type: 'string',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'text' },
            description: 'The hide close icon of the alert',
        },
    },
    decorators: [moduleMetadata({ imports: [DsAlert] })],
};

export default meta;
type Story = StoryObj<DsAlertType>;

export const Subtle: Story = {
    decorators: [moduleMetadata({ imports: [DemoIconComponent, DemoSuccessComponent, DsButton, DsIconButton] })],

    render: (args) => ({
        props: args,
        template: `
        <div style="width:350px">
        <ds-alert type="${args.type}" inverse="${args.inverse}">
            ${args.content} 
            @if(!${args.hideRightIcon}){
                <button slot="actionIcon" ds-icon-button variant="flat" kind='tertiary' size="small" inverse=${args.inverse} style="
                transform: rotate(-90deg);
            ">
                <ds-demo-icon  iconName="chevron"/>
                </button>
            }
        </ds-alert>
        </div>
        `,
    }),
};

export const Strong: Story = {
    args: {
        hideHeader: false,
        hideFooter: false,
        content: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti?',
        footerButtonsCount: 2,
    },
    argTypes: {
        hideHeader: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'The hide header of the alert',
        },
        hideFooter: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'The hide Footer of the alert',
        },
        footerButtonsCount: {
            options: [1, 2, 3],
            table: {
                defaultValue: { summary: '2' },
                category: 'Styling',
            },
            control: { type: 'select' },
            description: 'displaying number of buttons',
        },
    },

    decorators: [moduleMetadata({ imports: [DemoIconComponent, DemoSuccessComponent, DsButton, DsIconButton] })],

    render: (args) => ({
        props: args,
        template: `
        <div style="width:337px">
        <ds-alert type="${args.type}" inverse="${args.inverse}">
        @if(!${args.hideHeader}){
            <span slot="header">Title of the code</span>

        }
            ${args.content}
                @if(!${args.hideFooter}){
                    <span slot="footer">
                    ${Array.from({ length: args.footerButtonsCount })
                        .map(
                            (_) => `
                            <button ds-button 
                                variant="flat-reduced" 
                                kind="tertiary" 
                                size="small" 
                                inverse="${args.inverse}">
                                Button 
                            </button>
                        `,
                        )
                        .join('')}
                </span>
                }
            @if(!${args.hideRightIcon}){
                <button ds-icon-button variant="flat" kind="tertiary" size="small" slot="closeIcon" inverse=${args.inverse}>
                <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" fill="currentColor" stroke-width="2" />
                </svg>
            </button>
            }
        </ds-alert>
        </div>
        `,
    }),
};

export const AllAlerts: Story = {
    tags: ['docs-template'],
    decorators: [moduleMetadata({ imports: [DemoIconComponent, DsButton, DsIconButton] })],
    render: () => ({
        template: `
            <section>
                <div style="width:337px">
                <p class="label">Success</p>
                <ds-alert type="success" >
                <span slot="header">Title of the code</span>
                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti? 
                        <span slot="footer">
                        <button ds-button variant="flat-reduced" kind='tertiary' size="small">Button</button>
                        <button ds-button variant="flat-reduced" kind='tertiary' size="small">Button</button>
                    </span>
                    <button ds-icon-button variant="flat" kind="tertiary" size="small" slot="closeIcon">
            <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" fill="currentColor" stroke-width="2" />
            </svg>
        </button>
                </ds-alert>
                <ds-alert type="success" >
                Lorem ipsum dolor sit amet consectetur 
                    <button slot="actionIcon" ds-icon-button variant="flat" kind='tertiary' size="small" style="
                    transform: rotate(-90deg);
                ">
                    <ds-demo-icon  iconName="chevron" />
                    </button>
    
            </ds-alert>
                <p class="label">Caution</p>
                <ds-alert type="caution" >
                <span slot="header">Title of the code</span>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti?
                        <span slot="footer">
                        <button ds-button variant="flat-reduced" kind='tertiary' size="small">Button</button>
                        <button ds-button variant="flat-reduced" kind='tertiary' size="small">Button</button>
                    </span>
                    <button ds-icon-button variant="flat" kind="tertiary" size="small" slot="closeIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" fill="currentColor" stroke-width="2" />
                    </svg>
                </button>
                </ds-alert>
                <ds-alert type="caution" >
                 Lorem ipsum dolor sit amet consectetur 
                    <button slot="actionIcon" ds-icon-button variant="flat" kind='tertiary' size="small" style="
                    transform: rotate(-90deg);
                ">
                    <ds-demo-icon  iconName="chevron"/>
                    </button>
    
            </ds-alert>
                <p class="label">Info</p>
                <ds-alert type="info" >
                <span slot="header">Title of the code</span>
                   Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti? 
                        <span slot="footer">
                        <button ds-button variant="flat-reduced" kind='tertiary' size="small">Button</button>
                        <button ds-button variant="flat-reduced" kind='tertiary' size="small">Button</button>
                    </span>
                    <button ds-icon-button variant="flat" kind="tertiary" size="small" slot="closeIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" fill="currentColor" stroke-width="2" />
                    </svg>
                </button>
                </ds-alert>
                <ds-alert type="info" >
                Lorem ipsum dolor sit amet consectetur
                    <button slot="actionIcon" ds-icon-button variant="flat" kind='tertiary' size="small" style="
                    transform: rotate(-90deg);
                ">
                    <ds-demo-icon  iconName="chevron"/>
                    </button>
    
            </ds-alert>
                <p class="label">Error</p>
                <ds-alert type="error" >
                <span slot="header">Title of the code</span>
                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti? Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti? 
                        <span slot="footer">
                        <button ds-button variant="flat-reduced" kind='tertiary' size="small">Button</button>
                        <button ds-button variant="flat-reduced" kind='tertiary' size="small">Button</button>
                    </span>
                    <button ds-icon-button variant="flat" kind="tertiary" size="small" slot="closeIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" fill="currentColor" stroke-width="2" />
                    </svg>
                </button>
                    </ds-alert>
                    <ds-alert type="error" >
                     Lorem ipsum dolor sit amet consectetur
                        <button slot="actionIcon" ds-icon-button variant="flat" kind='tertiary' size="small" style="
                        transform: rotate(-90deg);
                    ">
                        <ds-demo-icon  iconName="chevron"/>
                        </button>
        
                </ds-alert>
                </div>
                </section>
            `,
        styles: [gridStyles],
    }),
};

export const Inverse: Story = {
    tags: ['docs-template'],
    decorators: [moduleMetadata({ imports: [DemoIconComponent, DsButton, DsIconButton] })],
    render: () => ({
        template: `
            <section>
                <div style="width:300px">
                <p class="label">Inverse</p>
                <ds-alert type="success" inverse="true" >
                <span slot="header">Title of the code</span>
                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolore, deleniti?
                        <span slot="footer">
                        <button ds-button variant="flat-reduced" kind='tertiary' size="small" inverse="true">Button</button>
                        <button ds-button variant="flat-reduced" kind="tertiary" size="small" inverse="true">Button</button>
                    </span>
                    <button ds-icon-button variant="flat" kind="tertiary" size="small" slot="closeIcon" inverse='true'>
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" fill="currentColor" stroke-width="2" />
                    </svg>
                </button>
                </ds-alert>
 </div>
                </section>
            `,
        styles: [gridStyles],
    }),
};

const gridStyles = `
        section {
            display: flex;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .label {
            font-size: 14px;
            text-align:center;
            margin-left: 8px;
          }
          
          ds-alert {
            margin-bottom:5px
          }
        `;
