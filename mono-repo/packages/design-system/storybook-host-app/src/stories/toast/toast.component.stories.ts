import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsButton } from '@frontend/ui/button';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DS_TOAST_TYPE, DsToast } from '@frontend/ui/toast';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { ToastrModule } from 'ngx-toastr';

type DsToastStoryType = DsToast & {
    description: string;
    showClose: boolean;
    showAction: boolean;
};

const meta: Meta<DsToastStoryType> = {
    title: 'Components/Toast',
    component: DsToast,
    parameters: {
        status: generateStatusBadges('UX-2302', ['draft']),
    },
    excludeStories: /.*Data$/,
    argTypes: {
        description: {
            type: 'string',
            table: { defaultValue: { summary: 'Feedback description' } },
            control: { type: 'text' },
        },
        type: {
            options: DS_TOAST_TYPE,
            table: {
                defaultValue: { summary: 'info' },
                category: 'Styling',
            },
            control: { type: 'select' },
        },
        showClose: {
            type: 'boolean',
            table: { defaultValue: { summary: 'true' } },
            control: { type: 'boolean' },
            description: 'Show the close icon or not',
        },
        showAction: {
            type: 'boolean',
            table: { defaultValue: { summary: 'true' } },
            control: { type: 'boolean' },
            description: 'Show the action button or not',
        },
    },
    args: {
        description: 'Feedback description',
        showAction: true,
        showClose: true,
        type: 'info',
    },
    decorators: [moduleMetadata({ imports: [DsToast, ToastrModule, DemoIconComponent, DsButton, DsIconButton] })],
};

export default meta;
type Story = StoryObj<DsToastStoryType>;

export const Default: Story = {
    name: 'Playground',
    render: (toast) => ({
        template: `
        <div style="width:375px">
            <ds-toast type="${toast.type}">
                <ds-demo-icon slot="statusIcon" iconName="success"/>
                ${toast.description}
                ${toast.showAction ? `<button [ds-button] slot="action" variant="outline" size="small">Online Button</button>` : ''} 
                ${
                    toast.showClose
                        ? `<button ds-icon-button slot="close" size="small" variant="utility" kind="flat">
                                        <ds-demo-icon iconName="close" size="small"/>
                                    </button>`
                        : ''
                } 
            </ds-toast>
        </div>
        `,
    }),
};

export const withAllElements: Story = {
    tags: ['docs-template'],
    render: (toast) => ({
        template: `
        <div style="width:375px">
            <ds-toast type="info">
                <ds-demo-icon slot="statusIcon"/>
                 ${toast.description}
                 <button [ds-button] slot="action" variant="outline" size="small">Online Button</button>
                <button ds-icon-button slot="close" size="small" variant="utility" kind="flat">
                                        <ds-demo-icon iconName="close" size="small"/>
                                    </button>
            </ds-toast>
        </div>
        `,
    }),
};

export const NoAction: Story = {
    tags: ['docs-template'],
    render: (toast) => ({
        template: `
        <div style="width:375px">
            <ds-toast  type="info">
                <ds-demo-icon slot="statusIcon"/>
                ${toast.description}
               <button ds-icon-button slot="close" size="small" variant="utility" kind="flat">
                                        <ds-demo-icon iconName="close" size="small"/>
                                    </button>
            </ds-toast>
        </div>
        `,
    }),
};

export const NoCloseIcon: Story = {
    tags: ['docs-template'],
    render: (toast) => ({
        template: `
        <div style="width:375px">
            <ds-toast  type="info">
                <ds-demo-icon slot="statusIcon"/>
                ${toast.description}
                <button [ds-button] slot="action" variant="outline" size="small">Online Button</button>
            </ds-toast>
        </div>
        `,
    }),
};

export const NoAllActions: Story = {
    tags: ['docs-template'],
    render: (toast) => ({
        template: `
        <div style="width:375px">
            <ds-toast  type="info">
                <ds-demo-icon  slot="statusIcon"/>
                ${toast.description}
            </ds-toast>
        </div>
        `,
    }),
};
