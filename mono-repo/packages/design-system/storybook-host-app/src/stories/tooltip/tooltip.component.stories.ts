import { CdkScrollableModule } from '@angular/cdk/scrolling';

import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsButton } from '@frontend/ui/button';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DsNotificationBubble } from '@frontend/ui/notification-bubble';
import {
    DS_ARROW_POSITION_ARRAY,
    DS_TOOLTIP_POSITION_ARRAY,
    DS_TOOLTIP_VARIANT_ARRAY,
    DsTooltipModule,
    DsTooltipTrigger,
    DsTooltipVariant,
} from '@frontend/ui/tooltip';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

type StoryType = DsTooltipTrigger & {
    svgDataArray: string[];
    autoOpen: boolean;
    tooltipToggle: boolean;
    autoCloseTime: number;
    variant: DsTooltipVariant;
};

export default {
    title: 'Components/Tooltip',
    parameters: {
        status: generateStatusBadges('UX-2413', ['integration ready']),
    },
    args: {
        position: 'top',
        arrowPosition: 'start',
        autoOpen: true,
        closeOnScroll: false,
        hasBackdrop: false,
        ariaLabel: 'Close icon',
        tooltipToggle: false, // Default value for externalVisible
        autoCloseTime: 10_000,
        variant: 'neutral',
    },
    argTypes: {
        variant: {
            options: DS_TOOLTIP_VARIANT_ARRAY,
            table: {
                defaultValue: { summary: 'neutral' },
                category: 'Styling',
                type: { summary: 'neutral, utility' },
            },
            control: { type: 'select' },
            description: 'The variant of the tooltip',
        },
        position: {
            options: DS_TOOLTIP_POSITION_ARRAY,
            table: {
                defaultValue: { summary: 'top' },
                category: 'Styling',
            },
            control: { type: 'select' },
        },
        arrowPosition: {
            options: DS_ARROW_POSITION_ARRAY,
            table: { defaultValue: { summary: 'start' }, category: 'Styling' },
            control: { type: 'select' },
        },
        closeOnScroll: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'Enable or disable closing tooltip on scroll',
        },
        hasBackdrop: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'Enable or disable backdrop behind tooltip',
        },
        autoOpen: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'The auto open of tooltip',
        },
        autoCloseTime: {
            type: 'number',
            table: { defaultValue: { summary: '10000' } },
            control: 'number',
            description: 'Auto-close delay in milliseconds. Set to 0 to disable auto-close.',
        },
        tooltipToggle: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' } },
            control: { type: 'boolean' },
            description: 'Control tooltip visibility from outside',
        },
        ariaLabel: {
            type: 'string',
            description: 'The aria-label for the close icon',
            table: {
                disable: true,
            },
        },
    },
    decorators: [
        moduleMetadata({
            imports: [DsButton, DsIconButton, DsTooltipModule, DsNotificationBubble, DemoIconComponent, CdkScrollableModule],
        }),
    ],
} as Meta<StoryType>;

export const Default: StoryObj<StoryType> = {
    argTypes: {
        closeOnScroll: {
            table: { disable: true },
        },

        hasBackdrop: {
            table: { disable: true },
        },
    },
    render: (args) => ({
        props: args,
        template: `
            <div style="width: 400px; height: 400px; display: grid; place-content: center;">
                <button 
                   ds-button 
                   class="ds-trigger-button" 
                   [dsTooltipTriggerFor]="tooltipTemplate"
                   position="${args.position}"
                   arrowPosition="${args.arrowPosition}"
                   [dsTooltipOnFocus]
                   [autoOpen]="autoOpen"
                   [autoCloseTime]= "autoCloseTime"
                   [tooltipToggle]="tooltipToggle"
                   >
                  Open Tooltip
                </button>
                
                <ng-template #tooltipTemplate>
                  <ds-tooltip-content variant="${args.variant}">
                    <button slot="close" ds-icon-button variant="flat" kind="utility" size="small">
                        <ds-demo-icon iconName='close'></ds-demo-icon>
                    </button>
                    <div slot="title">Tooltip title</div>
                    <div slot="description">You will not be able to use this restricted amount as the bonus is still restricted due to unsettled Sports bets or unfinished Casino game where the bonus money was used.</div>
                    <div slot="action">
                    <button ds-button variant="flat" kind="${args.variant === 'neutral' ? 'utility' : 'tertiary'}" inverse="${args.variant === 'neutral' ? 'false' : 'true'}" size="small" style="margin-left: auto">
                        Action
                    </button>
                    </div>
                  </ds-tooltip-content>
                </ng-template>
            </div>
      `,
    }),
};

export const TooltipOnClick: StoryObj<StoryType> = {
    args: {
        hasBackdrop: false,
        closeOnScroll: true,
        autoCloseTime: 0,
    },
    render: (args) => ({
        props: args,
        template: `
        <div style="width: 400px; height: 300px; display: grid; place-content: center; overflow-y: auto" cdkScrollable tabindex="0">
                 <div style="width: 50px; height: 50px; margin-top: 40px; background: #00006b; border-radius: 5px"></div>
                 <div style="width: 50px; height: 50px; margin-top: 40px; background: #00006b; border-radius: 5px"></div>
                 <div style="width: 50px; height: 50px; margin-top: 40px; margin-bottom: 40px; background: #00006b; border-radius: 5px"></div>
                <ds-notification-bubble 
                    [dsTooltipTriggerFor]="tooltipTemplate"
                    position="${args.position}"
                    [autoOpen]="autoOpen"
                    [tooltipToggle]="tooltipToggle"
                    [closeOnScroll]="closeOnScroll"
                    [hasBackdrop]="hasBackdrop"
                    [autoCloseTime]= "autoCloseTime"
                    arrowPosition="${args.arrowPosition}" size="large">0
                </ds-notification-bubble>
                <div style="width: 50px; height: 50px; margin-top: 40px; background: #00006b; border-radius: 5px"></div>
                <div style="width: 50px; height: 50px; margin-top: 40px; background: #00006b; border-radius: 5px"></div>
                <div style="width: 50px; height: 50px; margin-top: 40px; background: #00006b; border-radius: 5px"></div>
        </div>
                <ng-template #tooltipTemplate>  
                    <ds-tooltip-content variant="${args.variant}">
                        <button slot="close" ds-icon-button variant="flat" kind="utility" size="small">
                            <ds-demo-icon iconName='close'></ds-demo-icon>
                        </button>
                        <div slot="title">Tooltip title</div>
                        <div slot="description">You will not be able to use this restricted amount as the bonus is still restricted due to unsettled Sports bets or unfinished Casino game where the bonus money was used.</div>
                        <div slot="action">
                        <button ds-button variant="flat" kind="${args.variant === 'neutral' ? 'utility' : 'tertiary'}" inverse="${args.variant === 'neutral' ? 'false' : 'true'}" size="small" style="margin-left: auto">
                            Action
                        </button>
                        </div>
                    </ds-tooltip-content>                    
                </ng-template>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
      `,
    }),
};
