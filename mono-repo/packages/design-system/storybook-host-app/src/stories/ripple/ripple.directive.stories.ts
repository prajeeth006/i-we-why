import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DsBadge } from '@frontend/ui/badge';
import { DsButton } from '@frontend/ui/button';
import { DsPill } from '@frontend/ui/pill';
import { DsRipple, DsRippleOptions, provideDsRippleOptions } from '@frontend/ui/ripple';
import { type Meta, type StoryObj, applicationConfig, moduleMetadata } from '@storybook/angular';

const meta: Meta<DsRipple> = {
    title: 'Components/Ripple',
    parameters: {
        status: generateStatusBadges('UX-2575', ['draft']),
    },
    component: DsRipple,
    excludeStories: /.*Data$/,
    args: {
        dsRipple: {
            radius: 0,
            centered: false,
            disabled: false,
            unbound: false,
            animation: {
                enterDuration: 225,
                exitDuration: 150,
            },
        },
    },
    argTypes: {
        dsRipple: {
            type: 'symbol',
            name: 'dsRippleRadius',
            table: {
                defaultValue: { summary: '0' },
                category: 'Styling',
            },
            control: { type: 'object' },
            description: 'The radius of the component, if zero then component size is used',
        },
    },
    decorators: [moduleMetadata({ imports: [DsRipple, DsButton] })],
    render: (ripple) => {
        const rippleArgs = ripple.dsRipple as DsRippleOptions;
        return {
            props: ripple,
            template: `
            <button [dsRipple]="{
                unbound: ${rippleArgs.unbound},
                centered: ${rippleArgs.centered}, 
                disabled: ${rippleArgs.disabled},
                radius: ${rippleArgs.radius},
                animation: {
                    enterDuration: ${rippleArgs.animation.enterDuration}, 
                    exitDuration: ${rippleArgs.animation.exitDuration},
                },
            }"  ds-button >Ripple</button>
        `,
        };
    },
};

export default meta;
type Story = StoryObj<DsRipple>;

export const Default: Story = {
    args: {
        ...meta.args,
    },
};
export const Disabled: Story = {
    ...Default,
    tags: ['docs-template'],
    args: {
        ...Default.args,
        dsRipple: {
            disabled: true,
        },
    },
    render: (ripple) => {
        const rippleArgs = ripple.dsRipple as DsRippleOptions;
        return {
            props: ripple,
            template: `
            <button [dsRipple]="{disabled: ${rippleArgs.disabled}}"  ds-button >Ripple</button>
        `,
        };
    },
};
export const Unbound: Story = {
    ...Default,
    tags: ['docs-template'],
    args: {
        ...Default.args,
        dsRipple: {
            unbound: true,
        },
    },
    render: (ripple) => ({
        props: ripple,
        template: `
            <button [dsRipple]="{unbound: ${(ripple.dsRipple as DsRippleOptions).unbound}}" style="contain: layout style; content-visibility: visible;" ds-button>Ripple</button>
        `,
    }),
};

export const Centered: Story = {
    ...Default,
    tags: ['docs-template'],
    args: {
        ...Default.args,
        dsRipple: {
            centered: true,
        },
    },
    render: (ripple) => {
        const rippleArgs = ripple.dsRipple as DsRippleOptions;
        return {
            props: ripple,
            template: `
            <button [dsRipple]="{centered: ${rippleArgs.centered}}" ds-button>Ripple</button>
        `,
        };
    },
};

export const WithRadius: Story = {
    tags: ['docs-template'],
    ...Default,
    args: {
        ...Default.args,
        dsRipple: {
            radius: 25,
        },
    },
    render: (ripple) => {
        const rippleArgs = ripple.dsRipple as DsRippleOptions;
        return {
            props: ripple,
            template: `
            <button [dsRipple]="{radius: ${rippleArgs.radius}}"  ds-button>Ripple</button>
        `,
        };
    },
};

export const WithColor: Story = {
    ...Default,
    tags: ['docs-template'],
    render: (ripple) => ({
        props: ripple,
        template: `
            <button style="--ds-ripple-background: #00ffff" dsRipple ds-button>Ripple</button>
        `,
    }),
};

export const WithOpacity: Story = {
    ...Default,
    tags: ['docs-template'],
    render: (ripple) => ({
        props: ripple,
        template: `
            <button style="--ds-ripple-opacity: 0.5" dsRipple ds-button>Ripple</button>
        `,
    }),
};

export const WithAnimationDuration: Story = {
    ...Default,
    args: {
        ...Default.args,
        dsRipple: {
            animation: {
                enterDuration: 1000,
                exitDuration: 2000,
            },
        },
    },
    render: (ripple) => {
        const rippleArgs = ripple.dsRipple as DsRippleOptions;
        return {
            props: ripple,
            template: `
            <button [dsRipple]="{
                animation: {
                    enterDuration: ${rippleArgs.animation.enterDuration}, 
                    exitDuration: ${rippleArgs.animation.exitDuration},
                },
            }" ds-button>Ripple</button>
        `,
        };
    },
    tags: ['docs-template'],
};

export const GlobalDisable: Story = {
    ...Default,
    tags: ['docs-template'],
    args: {
        ...Default.args,
        dsRipple: {},
    },
    decorators: [
        moduleMetadata({ imports: [DsRipple] }),
        applicationConfig({
            providers: [
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                provideDsRippleOptions({ disabled: true } as DsRippleOptions),
            ],
        }),
    ],
    render: (ripple) => ({
        props: ripple,
        template: `
            <button dsRipple ds-button>Ripple</button>
        `,
    }),
};

export const GlobalForcedDisabled: Story = {
    ...Default,
    tags: ['docs-template'],
    args: {
        ...Default.args,
        dsRipple: {
            disabled: false,
        },
    },
    decorators: [
        moduleMetadata({ imports: [DsRipple] }),
        applicationConfig({
            providers: [
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                provideDsRippleOptions({ forcedDisabled: true }),
            ],
        }),
    ],
    render: (ripple) => {
        const rippleArgs = ripple.dsRipple as DsRippleOptions;
        return {
            props: ripple,
            template: `
            <button [dsRipple]="{disabled: ${rippleArgs.disabled},}" ds-button>Ripple</button>
        `,
        };
    },
};

export const GlobalAnimation: Story = {
    ...Default,
    tags: ['docs-template'],
    args: {
        ...Default.args,
    },
    decorators: [
        moduleMetadata({ imports: [DsRipple] }),
        applicationConfig({
            providers: [
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                provideDsRippleOptions({ animation: { enterDuration: 2000, exitDuration: 1000 } } as DsRippleOptions),
            ],
        }),
    ],
    render: GlobalDisable.render,
};

export const GlobalRadius: Story = {
    ...Default,
    tags: ['docs-template'],
    args: {
        ...Default.args,
        dsRipple: {},
    },
    decorators: [
        moduleMetadata({ imports: [DsRipple] }),
        applicationConfig({
            providers: [
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                provideDsRippleOptions({ radius: 30 } as DsRippleOptions),
            ],
        }),
    ],
    render: GlobalDisable.render,
};

export const GlobalUnbound: Story = {
    ...Default,
    tags: ['docs-template'],
    args: {
        ...Default.args,
        dsRipple: {},
    },
    decorators: [
        moduleMetadata({ imports: [DsRipple] }),
        applicationConfig({
            providers: [
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                provideDsRippleOptions({ unbound: true } as DsRippleOptions),
            ],
        }),
    ],
    render: (ripple) => ({
        props: ripple,
        template: `
            <button dsRipple style="contain: layout style; content-visibility: visible;" ds-button>Ripple</button>
        `,
    }),
};

export const GlobalCentered: Story = {
    ...Default,
    tags: ['docs-template'],
    args: {
        ...Default.args,
    },
    decorators: [
        moduleMetadata({ imports: [DsRipple] }),
        applicationConfig({
            providers: [
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                provideDsRippleOptions({ centered: true } as DsRippleOptions),
            ],
        }),
    ],
    render: GlobalDisable.render,
};

export const Demo: Story = {
    tags: ['docs-template'],
    decorators: [moduleMetadata({ imports: [DsRipple, DsButton, DsPill, DsBadge] })],
    render: (ripple) => ({
        props: ripple,
        styles: [gridStyles],
        template: `
            <section>
                <div class="example-label">Ripple Config</div>
                <div class="example-row">
                    <button dsRipple ds-button variant="outline">Default</button>
                    <button [dsRipple]="{centered: true}" ds-button variant="outline">Centered</button>
                    <button style="contain: layout style; content-visibility: visible;" [dsRipple]="{unbound: true}" ds-button variant="outline">Unbound</button>
                    <button [dsRipple]="{radius: 10}" ds-button variant="outline">Radius</button>
              </div>
            </section>
            <section>
                <div class="example-label">Effect Styling</div>
                <div class="example-row">
                    <button [dsRipple]="{animation: {enterDuration: 1000, exitDuration: 2000}}" ds-button variant="outline">Animation Speed</button>
                    <button dsRipple style="--ds-ripple-background: #00ffff;" ds-button variant="outline">Colored</button>
                    <button dsRipple style="--ds-ripple-opacity: 1;" ds-button variant="outline">Opacity</button>
                    <button [dsRipple]="{disabled: true}" ds-button variant="outline">Disabled Effect</button>
              </div>
            </section>
                <div class="example-label">Other Elements</div>
                <div class="example-row">
                    <div dsRipple ds-pill>Pill</div>
                    <ds-badge dsRipple variant="secondary">Badge</ds-badge>
                    <div style="background: #00ff00" dsRipple>Div</div>
              </div>
            <section>
            
</section>
        `,
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
          
          .example-row {
            display: flex;
            gap: 10px;
            align-items: center;
          }
        `;
