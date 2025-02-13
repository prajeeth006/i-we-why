import { NgTemplateOutlet } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsHelpGroup, DsHelpItem } from '@frontend/ui/help-group';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DS_INPUT_FIELDS_SIZE_ARRAY, DsInputDirective, DsInputField } from '@frontend/ui/input-field';
import { DsScrollbar } from '@frontend/ui/scrollbar';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

type DsInputFieldType = DsInputField & { elementType: string };

const meta: Meta<DsInputFieldType> = {
    title: 'Components/Input Fields',
    parameters: {
        status: generateStatusBadges('UX-2314', ['integration ready']),
    },
    component: DsInputField,
    argTypes: {
        elementType: {
            options: ['input', 'textarea'],
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'select' },
            description: 'The element type of the input field',
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the input field',
        },
        isFieldRequired: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'The required state of the input field',
        },
        isRightAligned: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'The alignment of the input field',
        },
        floatingLabel: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'The floating label state of the input field',
        },
        size: {
            options: DS_INPUT_FIELDS_SIZE_ARRAY,
            table: {
                defaultValue: { summary: 'medium' },
                category: 'Styling',
            },
            control: { type: 'select' },
            description: 'The size of the input field',
        },
    },
    args: {
        elementType: 'input',
        inverse: false,
        isFieldRequired: false,
        isRightAligned: false,
        floatingLabel: false,
        size: 'medium',
    },
    decorators: [
        moduleMetadata({
            imports: [
                DsHelpItem,
                FormsModule,
                DsHelpGroup,
                ReactiveFormsModule,
                DsInputField,
                DsInputDirective,
                DemoIconComponent,
                DsIconButton,
                DsScrollbar,
                NgTemplateOutlet,
            ],
        }),
    ],
};

export default meta;

type Story = StoryObj<DsInputFieldType>;
export const Default: Story = {
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: {
            ...args,
            form: new FormBuilder().group({
                username1: [
                    'Text',
                    args.isFieldRequired ? [Validators.required, Validators.minLength(10)] : [Validators.nullValidator, Validators.minLength(1)],
                ],
            }),
        },

        template: `

        @if (${args.elementType === 'textarea'}) {
  <ds-scrollbar>
    <ng-container [ngTemplateOutlet]="formContent"></ng-container>
  </ds-scrollbar>
} @else {
  <ng-container [ngTemplateOutlet]="formContent"></ng-container>
}

<ng-template #formContent>
  <form style="width: 250px;" [formGroup]="form">
    <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}"  isFieldRequired="${args.isFieldRequired}"
      [floatingLabel]="${args.floatingLabel}" [inverse]="${args.inverse}" labelText="Label">
      
      @if (${args.elementType === 'textarea'}) {
        <textarea dsInput placeholder="Placeholder" name="username-id1" id="username-id1" 
          autocomplete="username" formControlName="username1"></textarea>
      } @else {
        <input dsInput placeholder="Placeholder" type="text" name="username-id1" 
          autocomplete="username" formControlName="username1" />
      }

      <ds-demo-icon slot="start"></ds-demo-icon>
      <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
        <ds-demo-icon iconName="close"></ds-demo-icon>
      </button>

      <div slot="bottom">
        @if (form.get('username1').invalid && form.get('username1').touched) {
          <ds-help-item type="error" [inverse]="${args.inverse}" [isRightAligned]="${args.isRightAligned}">
            <ds-demo-icon slot="icon" iconName="error"></ds-demo-icon>
            <div slot="text">Your message must be at least 10 characters long.</div>
          </ds-help-item>
        } @else if (form.get('username1').valid) {
          <ds-help-item type="success" [inverse]="${args.inverse}" [isRightAligned]="${args.isRightAligned}">
            <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
            <div slot="text">Success!</div>
          </ds-help-item>
        } @else {
          <ds-help-item type="info" [inverse]="${args.inverse}" [isRightAligned]="${args.isRightAligned}">
            <ds-demo-icon slot="icon" iconName="info"></ds-demo-icon>
            <div slot="text">Minimum of 10 characters required</div>
          </ds-help-item>
        }
      </div>

    </ds-input-field>
  </form>
</ng-template>




        `,
    }),
};

export const TextInput: Story = {
    args: {
        ...meta.args,
    },
    argTypes: {
        elementType: {
            table: {
                disable: true,
            },
        },
    },
    render: (args) => {
        const form = new FormBuilder().group({
            username2: [
                'Text',
                args.isFieldRequired ? [Validators.required, Validators.minLength(6)] : [Validators.nullValidator, Validators.minLength(1)],
            ],
        });
        return {
            props: {
                ...args,
                form,
            },
            template: `
            <form style="width: 250px;" [formGroup]="form">
                <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" isFieldRequired="${args.isFieldRequired}" [floatingLabel]="${args.floatingLabel}" [inverse]="${args.inverse}" labelText="Label">
                    <input dsInput placeholder="Placeholder" type="text" name="username-id2" autocomplete="username" formControlName="username2"/>
                    <ds-demo-icon slot="start"></ds-demo-icon>
                    <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                        <ds-demo-icon iconName='close'></ds-demo-icon>
                    </button>
                    <div slot="bottom">
                      <ds-help-item type="info" [inverse]="${args.inverse}" [isRightAligned]="${args.isRightAligned}">
                          <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                          <div slot="text">Help text</div>
                      </ds-help-item>
                      </div>
                </ds-input-field>
            </form>
        `,
        };
    },
};

export const TextInputLeftSlot: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    argTypes: {
        elementType: {
            table: {
                disable: true,
            },
        },
    },
    render: (args) => {
        const form2 = new FormBuilder().group({
            username21: [
                'Text',
                args.isFieldRequired ? [Validators.required, Validators.minLength(6)] : [Validators.nullValidator, Validators.minLength(1)],
            ],
        });
        return {
            props: {
                ...args,
                form2,
            },
            template: `
            <form style="width: 250px;" [formGroup]="form2">
                <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" isFieldRequired="${args.isFieldRequired}" [floatingLabel]="${args.floatingLabel}" [inverse]="${args.inverse}" labelText="Label">
                    <input dsInput placeholder="Placeholder" type="text" name="username-id21" autocomplete="username" formControlName="username21"/>
                    <ds-demo-icon slot="start"></ds-demo-icon>
                    <div slot="bottom">
                      <ds-help-item type="info" [inverse]="${args.inverse}" [isRightAligned]="${args.isRightAligned}">
                          <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                          <div slot="text">Help text</div>
                      </ds-help-item>
                      </div>
                </ds-input-field>
            </form>
        `,
        };
    },
};

export const TextInputRightSlot: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    argTypes: {
        elementType: {
            table: {
                disable: true,
            },
        },
    },
    render: (args) => {
        const form = new FormBuilder().group({
            username22: [
                'Text',
                args.isFieldRequired ? [Validators.required, Validators.minLength(6)] : [Validators.nullValidator, Validators.minLength(1)],
            ],
        });
        return {
            props: {
                ...args,
                form,
            },
            template: `
            <form style="width: 250px;" [formGroup]="form">
                <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" isFieldRequired="${args.isFieldRequired}" [floatingLabel]="${args.floatingLabel}" [inverse]="${args.inverse}" labelText="Label">
                    <input dsInput placeholder="Placeholder" type="text" name="username-id22" autocomplete="username" formControlName="username22"/>
                    <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                        <ds-demo-icon iconName='close'></ds-demo-icon>
                    </button>
                    <div slot="bottom">
                      <ds-help-item type="info" [inverse]="${args.inverse}" [isRightAligned]="${args.isRightAligned}">
                          <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                          <div slot="text">Help text</div>
                      </ds-help-item>
                      </div>
                </ds-input-field>
            </form>
        `,
        };
    },
};

export const TextInputSmall: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: {
            ...args,
            form: new FormBuilder().group({
                username3: [
                    'Text',
                    args.isFieldRequired ? [Validators.required, Validators.minLength(6)] : [Validators.nullValidator, Validators.minLength(1)],
                ],
            }),
        },
        template: `
            <form style="width: 250px;" [formGroup]="form">
                <ds-input-field size="small" [isRightAligned]="${args.isRightAligned}" isFieldRequired="${args.isFieldRequired}" [inverse]="${args.inverse}" labelText="Label">
                    <input dsInput placeholder="Placeholder" type="text" name="username-id3" autocomplete="username" formControlName="username3"/>
                    <div slot="bottom">
                        <ds-help-item type="info" [inverse]="${args.inverse}" [isRightAligned]="${args.isRightAligned}">
                            <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                            <div slot="text">Help text</div>
                        </ds-help-item>
                    </div>
                </ds-input-field>
            </form>
        `,
    }),
};

export const TextInputMedium: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: {
            ...args,
            form: new FormBuilder().group({
                username4: [
                    'Text',
                    args.isFieldRequired ? [Validators.required, Validators.minLength(6)] : [Validators.nullValidator, Validators.minLength(1)],
                ],
            }),
        },
        template: `
            <form style="width: 250px;" [formGroup]="form">
                <ds-input-field size="medium" [isRightAligned]="${args.isRightAligned}" isFieldRequired="${args.isFieldRequired}" [inverse]="${args.inverse}" labelText="Label">
                    <input dsInput placeholder="Placeholder" type="text" name="username-id4" autocomplete="username" formControlName="username4"/>
                    <div slot="bottom">
                        <ds-help-item type="info" [inverse]="${args.inverse}" [isRightAligned]="${args.isRightAligned}">
                            <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                            <div slot="text">Help text</div>
                        </ds-help-item>
                    </div>
                </ds-input-field>
            </form>
        `,
    }),
};

export const TextInputRightAligned: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: {
            ...args,
            form: new FormBuilder().group({
                username5: [
                    'Text',
                    args.isFieldRequired ? [Validators.required, Validators.minLength(6)] : [Validators.nullValidator, Validators.minLength(1)],
                ],
            }),
        },
        template: `
            <form style="width: 250px;" [formGroup]="form">
                <ds-input-field size="medium" isRightAligned="true" [inverse]="${args.inverse}" labelText="Label">
                    <input dsInput placeholder="Placeholder" type="text" name="username-id5" autocomplete="username" formControlName="username5"/>
                    <ds-help-item slot="bottom" type="info" [inverse]="${args.inverse}" isRightAligned="true">
                        <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                        <div slot="text">Help text</div>
                    </ds-help-item>
                </ds-input-field>
            </form>
        `,
    }),
};

export const TextInputAll: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },

    render: (args) => {
        const form = new FormBuilder().group({
            username1all: ['Text', [Validators.required, Validators.minLength(1)]],
            username2all: ['Text', [Validators.required, Validators.minLength(10)]],
            username3all: ['Text'],
            username4all: [{ value: 'Text', disabled: true }],
            username5all: ['', [Validators.required, Validators.minLength(1)]],
            username6all: ['', [Validators.required, Validators.minLength(1)]],
            username7all: [''],
            username8all: [{ value: '', disabled: true }],
        });

        form.get('username2all')?.markAsTouched();
        form.get('username6all')?.markAsTouched();
        return {
            props: {
                ...args,
                form, // Pass the form into the props
            },
            template: `
                <form [formGroup]="form"
                    style="display: grid; grid-template-columns: 50px 1fr 1fr; grid-template-rows: repeat(4, 1fr); grid-auto-flow: column; column-gap: 30px; row-gap: 50px;">
                    <p>Enabled</p>
                    <p>Error</p>
                    <p>Locked</p>
                    <p>Disabled</p>
                    <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" [inverse]="${args.inverse}"
                        labelText="Your Username">
                        <input dsInput placeholder="Placeholder" type="text" name="username-id1all" autocomplete="username"
                            formControlName="username1all" />
                        <ds-demo-icon slot="start"></ds-demo-icon>
                        <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                            <ds-demo-icon iconName='close'></ds-demo-icon>
                        </button>
                    </ds-input-field>
                    <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" [inverse]="${args.inverse}"
                        labelText="Your Username">
                        <input dsInput type="text" placeholder="Username" name="username-id2all" formControlName="username2all" />
                        <ds-demo-icon slot="start"></ds-demo-icon>
                        <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                            <ds-demo-icon iconName='close'></ds-demo-icon>
                        </button>
                    </ds-input-field>
                    <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" [inverse]="${args.inverse}"
                        labelText="Your Username">
                        <input readonly dsInput type="text" placeholder="Username" name="username-id3all"
                            formControlName="username3all" />
                        <ds-demo-icon slot="start"></ds-demo-icon>
                        <button disabled slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                            <ds-demo-icon iconName='close'></ds-demo-icon>
                        </button>
                    </ds-input-field>
                    <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" [inverse]="${args.inverse}"
                        labelText="Your Username">
                        <input dsInput type="text" placeholder="Username" name="username-id4all" formControlName="username4all" />
                        <ds-demo-icon slot="start"></ds-demo-icon>
                        <button disabled slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                            <ds-demo-icon iconName='close'></ds-demo-icon>
                        </button>
                    </ds-input-field>
                    <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" [inverse]="${args.inverse}"
                        labelText="Your Username">
                        <input dsInput placeholder="Placeholder" type="text" name="username-id5all" autocomplete="username"
                            formControlName="username5all" />
                        <ds-demo-icon slot="start"></ds-demo-icon>
                        <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                            <ds-demo-icon iconName='close'></ds-demo-icon>
                        </button>
                    </ds-input-field>
                    <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" [inverse]="${args.inverse}"
                        labelText="Your Username">
                        <input dsInput type="text" placeholder="Username" name="username-id6all" formControlName="username6all" />
                        <ds-demo-icon slot="start"></ds-demo-icon>
                        <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                            <ds-demo-icon iconName='close'></ds-demo-icon>
                        </button>
                    </ds-input-field>
                    <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" [inverse]="${args.inverse}"
                        labelText="Your Username">
                        <input readonly dsInput type="text" placeholder="Username" name="username-id7all"
                            formControlName="username7all" />
                        <ds-demo-icon slot="start"></ds-demo-icon>
                        <button disabled slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                            <ds-demo-icon iconName='close'></ds-demo-icon>
                        </button>
                    </ds-input-field>
                    <ds-input-field size="${args.size}" [isRightAligned]="${args.isRightAligned}" [inverse]="${args.inverse}"
                        labelText="Your Username">
                        <input dsInput type="text" placeholder="Username" name="username-id8all" formControlName="username8all" />
                        <ds-demo-icon slot="start"></ds-demo-icon>
                        <button disabled slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                            <ds-demo-icon iconName='close'></ds-demo-icon>
                        </button>
                    </ds-input-field>
                </form>
            `,
        };
    },
};

export const TextArea: Story = {
    argTypes: {
        elementType: {
            table: {
                disable: true,
            },
        },
    },
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: {
            ...args,
            form1: new FormBuilder().group({
                username6: [
                    'Text',
                    args.isFieldRequired ? [Validators.required, Validators.minLength(6)] : [Validators.nullValidator, Validators.minLength(1)],
                ],
            }),
        },
        template: `
            <ds-scrollbar>
                <form [formGroup]="form1" style="width: 250px;">
                    <ds-input-field size="${args.size}" [inverse]="${args.inverse}" labelText="Label">
                        <textarea dsInput placeholder="Placeholder" type="text" name="username-id6" id="username-id6"
                            autocomplete="username" formControlName="username6"></textarea>
                        <div slot="bottom" [inverse]="${args.inverse}">
                            <ds-help-item type="info" [inverse]="${args.inverse}" [isRightAligned]="${args.isRightAligned}">
                                <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                                <div slot="text">Help text</div>
                            </ds-help-item>
                        </div>
                    </ds-input-field>
                </form>
            </ds-scrollbar>
        `,
    }),
};

export const TextAreaAll: Story = {
    tags: ['docs-template'],
    args: {
        ...meta.args,
    },
    render: (args) => {
        const form2 = new FormBuilder().group({
            username9all: ['Text', [Validators.required, Validators.minLength(1)]],
            username10all: ['Text', [Validators.required, Validators.minLength(10)]],
            username11all: ['Text'],
            username12all: [{ value: 'Text', disabled: true }],
            username13all: ['', [Validators.required, Validators.minLength(1)]],
            username14all: ['', [Validators.required, Validators.minLength(1)]],
            username15all: [''],
            username16all: [{ value: '', disabled: true }],
        });

        form2.get('username10all')?.markAsTouched();
        form2.get('username14all')?.markAsTouched();
        return {
            props: {
                ...args,
                form2,
            },
            template: `
            <ds-scrollbar>
                <form [formGroup]="form2"
                    style="display: grid; grid-template-columns: 50px minmax(250px, auto) minmax(250px, auto); grid-template-rows: repeat(4, 1fr); grid-auto-flow: column; column-gap: 30px; row-gap: 50px;">
                    <p>Enabled</p>
                    <p>Error</p>
                    <p>Locked</p>
                    <p>Disabled</p>
                    <ds-input-field [inverse]="${args.inverse}" labelText="Your Username">
                        <textarea dsInput placeholder="Placeholder" type="text" name="username-id9all" autocomplete="username"
                            formControlName="username9all"></textarea>
                    </ds-input-field>

                    <ds-input-field [inverse]="${args.inverse}" labelText="Your Username">
                        <textarea dsInput placeholder="Placeholder" type="text" name="username-id10all" autocomplete="username"
                            formControlName="username10all"></textarea>
                    </ds-input-field>

                    <ds-input-field [inverse]="${args.inverse}" labelText="Your Username">
                        <textarea readonly dsInput placeholder="Placeholder" type="text" name="username-id11all"
                            autocomplete="username" formControlName="username11all"></textarea>
                    </ds-input-field>

                    <ds-input-field [inverse]="${args.inverse}" labelText="Your Username">
                        <textarea dsInput placeholder="Placeholder" type="text" name="username-id11all" autocomplete="username"
                            formControlName="username12all"></textarea>
                    </ds-input-field>

                    <ds-input-field [inverse]="${args.inverse}" labelText="Your Username">
                        <textarea dsInput placeholder="Placeholder" type="text" name="username-id13all" id="username-id13all"
                            formControlName="username13all"></textarea>
                    </ds-input-field>

                    <ds-input-field [inverse]="${args.inverse}" labelText="Your Username">
                        <textarea dsInput placeholder="Placeholder" type="text" name="username-id14all" id="username-id14all"
                            formControlName="username14all"></textarea>
                    </ds-input-field>

                    <ds-input-field [inverse]="${args.inverse}" labelText="Your Username">
                        <textarea readonly dsInput placeholder="Placeholder" type="text" name="username-id15all"
                            id="username-id15all" formControlName="username15all"></textarea>
                    </ds-input-field>

                    <ds-input-field [inverse]="${args.inverse}" labelText="Your Username">
                        <textarea dsInput placeholder="Placeholder" type="text" name="username-id16all" id="username-id16all"
                            formControlName="username16all"></textarea>
                    </ds-input-field>
                </form>
            </ds-scrollbar>
        `,
        };
    },
};
