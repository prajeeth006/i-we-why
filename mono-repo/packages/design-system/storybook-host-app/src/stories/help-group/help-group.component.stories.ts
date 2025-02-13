import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent, DemoSuccessComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsButton } from '@frontend/ui/button';
import { DS_HELP_GROUP_TYPE_ARRAY, DsHelpGroup, DsHelpGroupType, DsHelpItem } from '@frontend/ui/help-group';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DsInputDirective, DsInputField } from '@frontend/ui/input-field';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

type DsHelpGroupStoryType = DsHelpGroup & { type: DsHelpGroupType; isRightAligned: boolean };

const meta: Meta<DsHelpGroupStoryType> = {
    title: 'Components/Help-group',
    component: DsHelpGroup,
    parameters: {
        status: generateStatusBadges('UX-2411', ['UX review']),
    },
    excludeStories: /.*Data$/,
    args: {
        inverse: false,
        type: 'error',
        isRightAligned: false,
    },
    argTypes: {
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the help-group and item',
        },
        type: {
            options: DS_HELP_GROUP_TYPE_ARRAY,
            table: { defaultValue: { summary: 'error' } },
            control: { type: 'select' },
            description: 'The type of the help-item',
        },
        isRightAligned: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The right aligment of the text',
        },
    },
    decorators: [
        moduleMetadata({
            imports: [
                DemoIconComponent,
                DemoSuccessComponent,
                DsButton,
                DsHelpItem,
                DsInputDirective,
                FormsModule,
                ReactiveFormsModule,
                DsInputField,
                DsHelpGroup,
                DsIconButton,
            ],
        }),
    ],
};

export default meta;
type Story = StoryObj<DsHelpGroupStoryType>;

export const Default: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Design',
            type: 'figma',
            url: 'https://www.figma.com/design/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens?node-id=29193-55351&node-type=frame&t=ADeLB3FlBHEJWavF-0',
        },
    },
    render: (args) => ({
        props: {
            ...args,
            form: new FormGroup({
                name: new FormControl(''),
            }),
        },
        template: `
        <form style="width:200px" [formGroup]="form">
        <ds-input-field labelText="Name" size="small">
        <input dsInput type="text"  formControlName="name"  placeholder="enter your name"/>
        <ds-demo-icon slot="start"></ds-demo-icon>
        <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
            <ds-demo-icon iconName='close'></ds-demo-icon>
        </button>
          <ds-help-item type='${args.type}'  inverse="${args.inverse}" isRightAligned="${args.isRightAligned}" slot="bottom">
            <ds-demo-icon slot="icon" iconName="success"/>
            <div slot="text">${args.type} supporting text</div>
          </ds-help-item>
    </ds-input-field>
          </form>
        
        `,
    }),
};

export const StakeInputHelpText: Story = {
    args: {
        ...Default.args,
        isRightAligned: true,
    },
    render: (args) => ({
        props: {
            ...args,
            form: new FormGroup({
                amount: new FormControl(''),
            }),
        },
        template: `
        <form [formGroup]="form"> 
        <ds-input-field labelText="Amount" style="width: 100px"  isRightAligned='true' size="small" floatingLabel="true">
        <input dsInput type="number"  formControlName="amount"  placeholder="$"/>
            <ds-help-item  type='${args.type}' isRightAligned="${args.isRightAligned}" inverse="${args.inverse}" slot="bottom"  >
                <ds-demo-icon slot="icon" iconName="success" />
                <div slot="text">${args.type} supporting text exceeding limit</div>
            </ds-help-item>
    </ds-input-field>
    </form>
      `,
    }),
};

export const InputHelpTextWithGroup: Story = {
    decorators: [moduleMetadata({ imports: [DemoIconComponent, DemoSuccessComponent, DsButton, DsHelpItem, DsHelpGroup] })],

    render: (args) => ({
        props: {
            ...args,
            form: new FormGroup({
                password: new FormControl(''),
            }),
        },
        template: `
        <form [formGroup]="form">
        <ds-input-field labelText="Password">
        <input dsInput type="text"  formControlName="password"  placeholder="enter password"/>
        <ds-demo-icon slot="start"></ds-demo-icon>
        <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
            <ds-demo-icon iconName='close'></ds-demo-icon>
        </button>
        <ds-help-group inverse="${args.inverse}" slot='bottom'>
        <span slot='header'>Header</span>
          <ds-help-item slot="item" type='success' inverse="${args.inverse}" isRightAligned="${args.isRightAligned}">
          <ds-demo-icon slot="icon" iconName="success"/>
  
            <div slot="text">Success supporting text </div>
          </ds-help-item>
  
          <ds-help-item slot="item" type='error' inverse="${args.inverse}" isRightAligned="${args.isRightAligned}">
          <ds-demo-icon slot="icon" iconName="success"/>
  
            <div slot="text">Error supporting text </div>
          </ds-help-item>
          <ds-help-item slot="item" type='caution' inverse="${args.inverse}" isRightAligned="${args.isRightAligned}">
          <ds-demo-icon slot="icon" iconName="success"/>
  
            <div slot="text">Caution supporting text </div>
          </ds-help-item>
          <ds-help-item slot="item" type='info' inverse="${args.inverse}" isRightAligned="${args.isRightAligned}">
          <ds-demo-icon slot="icon" iconName="success"/>
  
            <div slot="text">Info supporting text </div>
          </ds-help-item>
          </ds-help-group>
    </ds-input-field>
    </form>
    
      `,
    }),
};
