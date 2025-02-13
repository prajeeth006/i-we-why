import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsBottomNav, DsBottomNavTab } from '@frontend/ui/bottom-nav';
import { DsNotificationBubble } from '@frontend/ui/notification-bubble';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<DsBottomNav> = {
    title: 'Components/BottomNav',
    component: DsBottomNav,
    decorators: [
        moduleMetadata({
            imports: [DsBottomNav, DsBottomNavTab, DsNotificationBubble, DemoIconComponent],
        }),
    ],
    parameters: {
        status: generateStatusBadges('UX-2401', ['a11y', 'integration ready']),
    },
};

export default meta;
type StoryType = DsBottomNav & {
    activeTab: number;
};

export const Default: StoryObj<StoryType> = {
    args: {
        activeTab: 1,
    },
    argTypes: {
        activeTab: {
            type: 'number',
            table: { defaultValue: { summary: '' } },
            control: 'text',
            description: 'The text/value of name to be active',
        },
    },
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=3440-22461&&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    render: (args) => ({
        props: {
            ...args,
        },

        template: `<div style='height:200px'>
   <ds-bottom-nav style='width:390px'>
        <ds-bottom-nav-tab name="sports" [active]="${args.activeTab === 1}">
          <div class="icon-wrapper">
            <ds-demo-icon iconName="trophy"/>
            <ds-notification-bubble style='position:absolute; top:-7px; right:-7px; z-index:1;'
              variant="utility-dot"
              size="small"
              ></ds-notification-bubble>
          </div>
          <div class="text-wrapper">Sports</div>
        </ds-bottom-nav-tab>
        <ds-bottom-nav-tab name="casino" [active]="${args.activeTab === 2}">
          <div  class="icon-wrapper">
            <ds-demo-icon iconName="trophy"/>
             <ds-notification-bubble style='position:absolute; top:-8px; right:-8px; z-index:1;'
              variant="primary"
              size="small"
            >
              0
             </ds-notification-bubble>
          </div>
          <div class="text-wrapper">Casino</div>
        </ds-bottom-nav-tab>
        <ds-bottom-nav-tab name="promo" [disabled]="true">
          <div  class="icon-wrapper">
            <ds-demo-icon iconName="trophy"/>
          </div>
          <div class="text-wrapper">Promos</div>
        </ds-bottom-nav-tab>
        <ds-bottom-nav-tab name="account" [active]="${args.activeTab === 4}">
          <div class="icon-wrapper">
            <div class="bet-amount">$00.00</div>
          </div>
          <div class="text-wrapper">Account</div>
        </ds-bottom-nav-tab>
      </ds-bottom-nav>
      </div>
    `,
    }),
};
