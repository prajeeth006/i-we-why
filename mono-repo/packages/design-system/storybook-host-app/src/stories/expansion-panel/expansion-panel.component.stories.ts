import { DemoIconComponent, DemoSuccessComponent, DsEntityLogoDemo } from '@design-system/storybook-demo-cmp-lib';
import { DS_ACCORDION_SIZE_ARRAY, DS_ACCORDION_VARIANT_ARRAY, DsAccordion, DsAccordionModule } from '@frontend/ui/accordion';
import { DsBadge } from '@frontend/ui/badge';
import { DsCard } from '@frontend/ui/card';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

type ExpansionPanelStoryType = DsAccordion & { withDivider: boolean };

const meta: Meta<ExpansionPanelStoryType> = {
    title: 'Components/Expansion Panel',
    component: DsAccordion,
    parameters: {
        status: {
            type: [
                {
                    name: 'jira',
                    url: "javascript:(function(){window.open('https://jira.corp.entaingroup.com/browse/UX-2399');})()",
                },
                'integration ready',
            ],
        },
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
    decorators: [moduleMetadata({ imports: [DemoSuccessComponent, DemoIconComponent, DsBadge, DsAccordionModule, DsEntityLogoDemo, DsCard] })],
};

export default meta;

type Story = StoryObj<ExpansionPanelStoryType>;

export const Default: Story = {
    args: { ...meta.args },
    render: (args) => ({
        props: args,
        template: `
            <ds-card style="width: 400px;" noOverflow>
                <ds-accordion>
                    <ds-accordion-header>
                      <div slot="start">
                        <div slot="title">Accordion</div>
                        <div slot="subtitle">Optional Subtext</div>
                      </div> 
                    </ds-accordion-header>
                    <ds-accordion-content>
                      some normal content
                    </ds-accordion-content>
                </ds-accordion>
            </ds-card>
        `,
    }),
};
export const Multiple: Story = {
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: args,
        template: `
            <ds-card style="width: 400px;" noOverflow>
                <ds-accordion variant="transparent">
                    <ds-accordion-header>
                          <ds-entity-logo-demo slot="start" variant="with-background">
                            <ds-demo-icon/>
                          </ds-entity-logo-demo>
                          <div slot="start">
                            <div slot="title">Accordion</div>
                          </div> 
                          <ds-badge slot="end" variant="blue">Slot</ds-badge>
                    </ds-accordion-header>
                    <ds-accordion-content>
                      some normal content
                    </ds-accordion-content>
                </ds-accordion>
                <ds-accordion variant="surface-lowest">
                    <ds-accordion-header>
                          <ds-entity-logo-demo slot="start" variant="with-background">
                            <ds-demo-icon/>
                          </ds-entity-logo-demo>
                          <div slot="start">
                            <div slot="title">
                                Accordion
                                <ds-badge variant="secondary">Slot</ds-badge>
                            </div>
                            <div slot="subtitle">Optional Subtext</div>
                          </div> 
                          <ds-badge slot="end" variant="blue">Slot</ds-badge>
                    </ds-accordion-header>
                    <ds-accordion-content>
                      some normal content
                    </ds-accordion-content>
                </ds-accordion>
                <ds-accordion variant="surface-low">
                    <ds-accordion-header>
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
                <ds-accordion variant="surface-high">
                    <ds-accordion-header hideToggle>
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
                <ds-accordion variant="surface-highest">
                    <ds-accordion-header>
                          <ds-entity-logo-demo slot="start" variant="with-background">
                            <ds-demo-icon/>
                          </ds-entity-logo-demo>
                          <div slot="start">
                            <div slot="title">Accordion</div>
                            <div slot="subtitle">Optional Subtext</div>
                          </div> 
                          <ds-badge slot="end" variant="blue">Slot</ds-badge>
                    </ds-accordion-header>
                    <ds-accordion-content>
                      some normal content
                    </ds-accordion-content>
                </ds-accordion>
            </ds-card>
        `,
    }),
};
