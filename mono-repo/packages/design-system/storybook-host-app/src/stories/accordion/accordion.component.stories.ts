import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent, DemoSuccessComponent, DsEntityLogoDemo } from '@design-system/storybook-demo-cmp-lib';
import { DS_ACCORDION_SIZE_ARRAY, DS_ACCORDION_VARIANT_ARRAY, DsAccordion, DsAccordionModule } from '@frontend/ui/accordion';
import { DsBadge } from '@frontend/ui/badge';
import { Meta, StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';

type DsAccordionStoryType = DsAccordion & { withDivider: boolean };

const meta: Meta<DsAccordionStoryType> = {
    title: 'Components/Accordion',
    component: DsAccordion,
    parameters: {
        status: generateStatusBadges('UX-2306', ['integration ready']),
    },

    excludeStories: /.*Data$/,
    argTypes: {
        open: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Control' },
            control: { type: 'boolean' },
            description: 'The open state of the accordion',
        },
        size: {
            options: DS_ACCORDION_SIZE_ARRAY,
            table: { defaultValue: { summary: 'medium' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'The size of the badge',
        },
        variant: {
            options: DS_ACCORDION_VARIANT_ARRAY,
            table: { defaultValue: { summary: 'primary' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'The variant of the accordion',
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the accordion',
        },
    },
    args: {
        size: 'large',
        variant: 'transparent',
        inverse: false,
        open: false,
    },
    decorators: [moduleMetadata({ imports: [DemoSuccessComponent, DemoIconComponent, DsBadge, DsAccordionModule, DsEntityLogoDemo] })],
};

export default meta;

type Story = StoryObj<DsAccordionStoryType>;

export const Default: Story = {
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: args,
        template: `
            <ds-accordion ${argsToTemplate(args)} style="width: 400px;">
                <ds-accordion-header>
                      <ds-entity-logo-demo slot="start" variant="with-background">
                        <ds-demo-icon/>
                      </ds-entity-logo-demo>
                      
                      <div slot="start">
                        <div slot="title">Accordion</div>
                        <div slot="subtitle">Optional Subtext</div>
                      </div> 
                      
                      <ds-badge slot="end" variant="blue">Slot</ds-badge>
                      <ds-badge slot="end" variant="blue">Slot</ds-badge>
                </ds-accordion-header>
                
                <ds-accordion-content>
                  some normal content
                </ds-accordion-content>
            </ds-accordion>
        `,
    }),
};

export const WithCustomToggle: Story = {
    name: 'Custom Toggle',
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: args,
        template: `
            <ds-accordion ${argsToTemplate(args)}>
                <ds-accordion-header>
                    <div slot="start">
                        <div slot="title">Hello title</div>
                        <div slot="subtitle">Hello subtitle</div>
                    </div>
                    
                    <ds-badge slot="end" variant="blue">0</ds-badge>
                    
                    <button *dsAccordionTrigger="let isOpen">
                        @if (isOpen) {
                          down
                        } @else {
                          up
                        }
                        
                        ({{isOpen ? 'open' : 'closed'}}) 
                    </button>
                </ds-accordion-header>
                
                <ds-accordion-content>
                  some normal content
                </ds-accordion-content>
                
<!--                <ng-template #content>-->
<!--                  lazy template-->
<!--                </ng-template>-->
            </ds-accordion>
        `,
    }),
};
