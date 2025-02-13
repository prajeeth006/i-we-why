import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DsScrollbar } from '@frontend/ui/scrollbar';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';
import { NgScrollbarModule } from 'ngx-scrollbar';

type DsScrollbarStoryType = DsScrollbar & { label: string };

const meta: Meta<DsScrollbarStoryType> = {
    title: 'Components/Scrollbar',
    parameters: {
        status: generateStatusBadges('UX-2400', ['stable']),
    },
    component: DsScrollbar,
    excludeStories: /.*Data$/,
    argTypes: {},
    args: {
        // default args
    },
    decorators: [moduleMetadata({ imports: [DsScrollbar, NgScrollbarModule] })],
};

export default meta;
type Story = StoryObj<DsScrollbarStoryType>;

export const Ngx: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=10741-30071&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    render: () => ({
        template: `
        <ds-scrollbar>
            <ng-scrollbar class="ngx-scrollbar" style="height: 300px; width: 140px; background: #fafafa">
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
            </ng-scrollbar>
        </ds-scrollbar>
        
        `,
    }),
};

export const Browser: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=10741-30071&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    render: () => ({
        template: `
        <ds-scrollbar>
            <div class="default-scrollbar ds-scrollbar" style="height: 300px; width: 140px; background: #fafafa; overflow: auto">
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
                <div style="width: 50px; height: 50px; margin: 40px; background: #00006b; border-radius: 5px"></div>      
            </div>
        </ds-scrollbar>
        
        `,
    }),
};
