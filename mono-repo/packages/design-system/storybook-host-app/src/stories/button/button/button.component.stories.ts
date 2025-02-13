import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DS_BUTTON_KIND_ARRAY, DS_BUTTON_SIZES_ARRAY, DS_BUTTON_VARIANTS_ARRAY, DsButton } from '@frontend/ui/button';
import { DsRipple } from '@frontend/ui/ripple';
import { DsComplexityRatingComponent, getVariantInfo } from '@frontend/ui/utils';
import { withActions } from '@storybook/addon-actions/decorator';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { isUnsupportedCombination } from '../../utils/button-utils';

type DsButtonStoryType = DsButton & { label: string; subText: string };

const meta: Meta<DsButtonStoryType> = {
    title: 'Components/Button/Button',
    parameters: {
        status: generateStatusBadges('UX-2301', ['a11y', 'stable']),
    },
    component: DsButton,
    excludeStories: /.*Data$/,
    args: {
        kind: 'primary',
        variant: 'filled',
        size: 'large',
        disabled: false,
        subText: '',
        label: 'Filled Button',
        inverse: false,
    },
    argTypes: {
        variant: {
            options: DS_BUTTON_VARIANTS_ARRAY,
            table: {
                defaultValue: { summary: 'primary' },
                category: 'Styling',
            },
            control: { type: 'select' },
            description: 'The variant of the button',
        },
        kind: {
            options: DS_BUTTON_KIND_ARRAY,
            table: {
                defaultValue: { summary: 'success' },
                category: 'Styling',
            },
            control: { type: 'select' },
            description: 'The kind of the button',
        },
        size: {
            options: DS_BUTTON_SIZES_ARRAY,
            table: {
                defaultValue: { summary: 'large' },
                category: 'Styling',
            },
            control: { type: 'select' },
            description: 'The size of the button',
        },
        disabled: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'The disabled state of the button',
        },
        label: {
            type: 'string',
            control: {
                type: 'text',
            },
            table: {
                defaultValue: { summary: 'Button' },
            },
            description: 'The label of the button',
        },
        subText: {
            type: 'string',
            control: {
                type: 'text',
            },
            if: { arg: 'size', eq: 'large' },
            table: {
                defaultValue: { summary: '' },
            },
            description: 'The sub text of the button',
        },
        inverse: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
                category: 'Styling',
            },
            control: { type: 'boolean' },
            description: 'The inverse state of the button',
        },
    },

    decorators: [withActions],

    render: ({ ...args }) => ({
        props: {
            ...args,
        },
    }),
};

export default meta;
type Story = StoryObj<DsButtonStoryType>;

// unsupported combinations

export const NoIcon: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43236&mode=design&t=fS1qO73SS8lGciLj-4',
        },
        controls: { exclude: ['subText'] },
    },
    render: (button) => {
        const variant = button.variant;
        const kind = button.kind;
        const isUnsupported = isUnsupportedCombination(variant, kind);

        return {
            props: button,
            template: `
                ${
                    isUnsupported
                        ? `
                    <div style="color: red;">Not Supported</div>
                `
                        : `
                    <button ds-button variant="${variant}" kind="${kind}" size="${button.size}" ${button.disabled ? 'disabled' : ''} inverse="${button.inverse}">
                        ${button.label}
                    </button>
                `
                }
            `,
        };
    },
};

export const LeftIcon: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43209&mode=design&t=fS1qO73SS8lGciLj-4',
        },
        controls: { exclude: ['subText'] },
    },
    decorators: [moduleMetadata({ imports: [DemoIconComponent] })],
    render: (button) => ({
        props: button,
        template: `
          ${
              isUnsupportedCombination(button.variant, button.kind)
                  ? `
                <div style="color: red;">Not Supported</div>
            `
                  : `
                <button ds-button variant="${button.variant}" kind="${button.kind}" size="${button.size}" ${button.disabled ? 'disabled' : ''} inverse="${button.inverse}">
                    ${button.label}
                <ds-demo-icon slot="start"/>
                </button>
            `
          }
        `,
    }),
};

export const LeftIconSubText: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43244&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
        subText: 'label',
        wrapText: false,
    },
    decorators: [moduleMetadata({ imports: [DemoIconComponent] })],
    render: (button) => ({
        props: button,
        template: `
           ${
               isUnsupportedCombination(button.variant, button.kind)
                   ? `
                <div style="color: red;">Not Supported</div>
            `
                   : `
                 <div style="width:200px">
                <button ds-button variant="${button.variant}" kind="${button.kind}" [wrapText]="${button.wrapText}" size="${button.size}" ${button.disabled ? 'disabled' : ''} inverse="${button.inverse}">
                    ${button.label}
                <ds-demo-icon slot="start"/>
                    <span slot="subtext">${button.subText}</span>
                </button>
                </div>
            `
           }
        `,
    }),
};

export const RightIcon: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43219&mode=design&t=fS1qO73SS8lGciLj-4',
        },
        controls: { exclude: ['subText'] },
    },
    decorators: [moduleMetadata({ imports: [DemoIconComponent] })],
    render: (button) => ({
        props: button,
        template: `
        ${
            isUnsupportedCombination(button.variant, button.kind)
                ? `
                <div style="color: red;">Not Supported</div>
            `
                : `
                <button ds-button variant="${button.variant}" kind="${button.kind}" size="${button.size}" ${button.disabled ? 'disabled' : ''} inverse="${button.inverse}">
                    ${button.label}
                    <ds-demo-icon slot="end"/>
                </button>
            `
        }
        `,
    }),
};

export const RightIconSubText: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43252&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
        subText: 'label',
        wrapText: false,
    },
    decorators: [moduleMetadata({ imports: [DemoIconComponent] })],
    render: (button) => ({
        props: button,
        template: `
         ${
             isUnsupportedCombination(button.variant, button.kind)
                 ? `
                <div style="color: red;">Not Supported</div>
            `
                 : `
                 <div style="width:200px">
                <button ds-button variant="${button.variant}" kind="${button.kind}" [wrapText]="${button.wrapText}" size="${button.size}" ${button.disabled ? 'disabled' : ''} inverse="${button.inverse}">
                    ${button.label}
                    <ds-demo-icon slot="end"/>
                    <span slot="subtext">${button.subText}</span>
                </button>
                </div>
            `
         }
        `,
    }),
};

export const SubText: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43261&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
        subText: 'label',
        wrapText: false,
    },

    decorators: [moduleMetadata({ imports: [DemoIconComponent] })],
    render: (button) => ({
        props: button,
        template: `
          ${
              isUnsupportedCombination(button.variant, button.kind)
                  ? `
                <div style="color: red;">Not Supported</div>
            `
                  : `
                  <div style="width:200px">
                <button ds-button variant="${button.variant}" [wrapText]=${button.wrapText}  kind="${button.kind}" size="${button.size}" ${button.disabled ? 'disabled' : ''} inverse="${button.inverse}">
                    ${button.label}
                <span slot="subtext">${button.subText}</span>
                </button>
                </div>
            `
          }
        `,
    }),
};

export const TruncateTextButton: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43236&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        truncate: true,
    },
    argTypes: {
        truncate: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'true  ' },
                category: 'Styling',
            },
            control: { type: 'boolean' },

            description: 'The truncation for text of the button',
        },
        label: {
            table: { disable: true },
        },
        subText: {
            table: { disable: true },
        },
    },
    render: (button) => ({
        props: button,
        template: `
         ${
             isUnsupportedCombination(button.variant, button.kind)
                 ? `
                <div style="color: red;">Not Supported</div>
            `
                 : `<div style="width: 100px">
               <button ds-button kind="primary" [truncate]=${button.truncate}  variant="${button.variant}" kind="${button.kind}" size="${button.size}" ${button.disabled ? 'disabled' : ''} inverse="${button.inverse}">
                Text to truncate
                <span slot="subtext">Subtext to truncate</span>
            </button>
                </div>
            `
         }
        `,
    }),
};

export const variantInfo = {
    ...getVariantInfo(meta),
    tags: ['docs-template'],
    parameters: {
        a11y: {
            disable: true,
        },
    },
};

export const ComplexityLevel: Story = {
    tags: ['docs-template'],

    render: () => ({
        moduleMetadata: {
            imports: [DsComplexityRatingComponent],
        },
        template: `
            <ds-complexity-rating 
                [totalVariants]="variantInfo.totalCombinations"
                [variantOptions]="variantInfo.variantOptions"
                [sizeOptions]="variantInfo.sizeOptions"
                [kindOptions]="variantInfo.kindOptions"
            ></ds-complexity-rating>
        `,
        props: {
            variantInfo,
        },
    }),
};
export const WrapText: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43236&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
        wrapText: true,
    },
    argTypes: {
        wrapText: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'true' },
                category: 'Styling',
            },
            control: { type: 'boolean' },

            description: 'The wrapping for text of the button',
        },
    },
    render: (button) => ({
        props: button,
        template: `
               

          ${
              isUnsupportedCombination(button.variant, button.kind)
                  ? `
                <div style="color: red;">Not Supported</div>
            `
                  : ` <div style="width: 100px">
              <button ds-button kind="primary" [wrapText]=${button.wrapText}  variant="${button.variant}" kind="${button.kind}" size="${button.size}" ${button.disabled ? 'disabled' : ''} inverse="${button.inverse}">
            ${button.label}
            <span slot="subtext">${button.subText}</span>
            </button>
                </div>
            `
          }
        `,
    }),
};

export const ProcessingButton: Story = {
    tags: ['docs-template'],
    render: () => ({
        template: `<button ds-button loading="true">Loading</button>`,
    }),
};

export const ProcessingButtonWithTemplate: Story = {
    tags: ['docs-template'],
    render: (button) => ({
        template: `
         ${
             isUnsupportedCombination(button.variant, button.kind)
                 ? `
                <div style="color: red;">Not Supported</div>
            `
                 : `
        <button ds-button loading="true">
            Login
            <ng-template #loadingTemplate>Processing...</ng-template>
        </button>
 `
         }
        `,
    }),
};

export const AllButtons: Story = {
    tags: ['docs-template'],
    decorators: [moduleMetadata({ imports: [DemoIconComponent] })],
    render: () => ({
        template: `
            <section>
                <div class="example-label">Flat</div>
                <div class="example-button-row">
                    <button ds-button variant="flat" kind="tertiary">Tertiary</button>
                    <button ds-button variant="flat" kind="utility">Utility</button>

                </div>
            </section>
            <section>
                <div class="example-label">Outline</div>
                <div class="example-button-row">
                    <button ds-button variant="outline" kind="primary">Primary</button>
                    <button ds-button variant="outline" kind="secondary">Secondary</button>
                    <button ds-button variant="outline" kind="tertiary">Tertiary</button>
                </div>
            </section>
            <section>
                <div class="example-label">Filled</div>
                <div class="example-button-row">
                    <button ds-button variant="filled" kind="primary">Primary</button>
                    <button ds-button variant="filled" kind="secondary">Secondary</button>
                    <button ds-button variant="filled" kind="tertiary">Tertiary</button>
                    <button ds-button variant="filled" kind="success">Success</button>
                </div>
            </section>
            <section>
                <div class="example-label">With icons</div>
                <div class="example-button-row">
                    <button ds-button variant="filled" kind="primary">
                        <ds-demo-icon slot="start"/>
                        Before
                    </button>
                    <button ds-button variant="filled" kind="secondary">
                        After
                        <ds-demo-icon slot="end"/>
                    </button>
                    <button ds-button variant="filled" kind="tertiary">
                        <ds-demo-icon slot="start"/>
                        Both sides
                        <ds-demo-icon slot="end"/>
                    </button>
                </div>
            </section>
            <section>
                <div class="example-label">With subtext</div>
                <div class="example-button-row">
                    <button ds-button variant="filled" kind="tertiary">
                        Both sides
                        <span slot="subtext">Subtext</span>
                    </button>
                    <button ds-button variant="filled" kind="secondary">
                        <ds-demo-icon slot="start"/>
                        Icon with subtext
                        <span slot="subtext">Subtext</span>
                    </button>
                    <button ds-button variant="filled" kind="secondary">
                        <ds-demo-icon slot="end"/>
                        Icon with subtext
                        <span slot="subtext">Very Long Subtext</span>
                    </button>
                </div>
            </section>
            `,
        styles: [gridStyles],
    }),
};

export const AllButtonSizes: Story = {
    tags: ['docs-template'],
    render: () => ({
        template: `
            <div class="example-button-row">
                <button ds-button size="small" kind="primary">Small</button>
                <button ds-button size="medium" kind="secondary">Medium</button>
                <button ds-button size="large" kind="tertiary">Large</button>
                <button ds-button kind="success">Default size (large)</button>
            </div>
        `,
        styles: [gridStyles],
    }),
};

export const AllButtonVariants: Story = {
    tags: ['docs-template'],
    render: () => ({
        template: `
            <div class="example-button-row">
                <button ds-button variant="filled" kind="primary">Filled</button>
                <button ds-button variant="outline" kind="secondary">Outline</button>
                <button ds-button variant="flat" kind="tertiary">Flat</button>
            </div>
        `,
        styles: [gridStyles],
    }),
};

export const DisabledButtons: Story = {
    tags: ['docs-template'],
    decorators: [moduleMetadata({ imports: [DemoIconComponent] })],
    render: () => ({
        template: `
            <section>
                <div class="example-label">Flat</div>
                <div class="example-button-row">
                    <button ds-button disabled variant="flat" kind="tertiary">Tertiary</button>
                    <button ds-button disabled variant="flat" kind="utility">Utility</button>
              </div>
            </section>
            <section>
                <div class="example-label">Outline</div>
                <div class="example-button-row">
                    <button ds-button disabled variant="outline" kind="primary">Primary</button>
                    <button ds-button disabled variant="outline" kind="secondary">Secondary</button>
                    <button ds-button disabled variant="outline" kind="tertiary">Tertiary</button>
                </div>
            </section>
            <section>
                <div class="example-label">Filled</div>
                <div class="example-button-row">
                    <button ds-button disabled variant="filled" kind="primary">Primary</button>
                    <button ds-button disabled variant="filled" kind="secondary">Secondary</button>
                    <button ds-button disabled variant="filled" kind="tertiary">Tertiary</button>
                    <button ds-button disabled variant="filled" kind="success">Success</button>
                </div>
            </section>
            <section>
                <div class="example-label">With icons</div>
                <div class="example-button-row">
                    <button ds-button disabled variant="filled" kind="primary">
                        <ds-demo-icon slot="start"/>
                        Before
                    </button>
                    <button ds-button disabled variant="filled" kind="secondary">
                        After
                        <ds-demo-icon slot="end"/>
                    </button>
                    <button ds-button disabled variant="filled" kind="tertiary">
                        <ds-demo-icon slot="start"/>
                        Both sides
                        <ds-demo-icon slot="end"/>
                    </button>
                </div>
            </section>
            <section>
                <div class="example-label">With subtext</div>
                <div class="example-button-row">
                    <button ds-button disabled variant="filled" kind="tertiary">
                        Both sides
                        <span slot="subtext">Subtext</span>
                    </button>
                    <button ds-button disabled variant="filled" kind="secondary">
                        <ds-demo-icon slot="start"/>
                        Icon with subtext
                        <span slot="subtext">Subtext</span>
                    </button>
                    <button ds-button disabled variant="filled" kind="secondary">
                        <ds-demo-icon slot="end"/>
                        Icon with subtext
                        <span slot="subtext">Very Long Subtext</span>
                    </button>
                </div>
            </section>
            `,
        styles: [gridStyles],
    }),
};

const gridStyles = `
        section {
            display: grid;
            grid-template-columns: 100px 1fr;
            align-items: center;
            margin-bottom: 10px;
          }
          
          .example-label {
            font-size: 14px;
            margin-left: 8px;
          }
          
          .example-button-row {
            display: flex;
            gap: 10px;
            align-items: center;
          }
        `;

export const RightIconSubTextRipple: Story = {
    tags: ['docs-template'],
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43252&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    args: {
        ...meta.args,
        subText: 'with Ripple',
        wrapText: false,
    },
    decorators: [moduleMetadata({ imports: [DemoIconComponent, DsRipple] })],
    render: (button) => ({
        props: button,
        template: `
         ${
             isUnsupportedCombination(button.variant, button.kind)
                 ? `
                <div style="color: red;">Not Supported</div>
            `
                 : `
                <button dsRipple ds-button variant="${button.variant}" [wrapText]="${button.wrapText}" kind="${button.kind}" size="${button.size}" ${button.disabled ? 'disabled' : ''} inverse="${button.inverse}">
                    ${button.label}
                    <ds-demo-icon slot="end"/>
                    <span slot="subtext">${button.subText}</span>
                </button>
            `
         }
        `,
    }),
};
