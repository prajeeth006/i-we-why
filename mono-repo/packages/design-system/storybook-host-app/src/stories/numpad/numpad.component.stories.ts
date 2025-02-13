import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsNumpad } from '@frontend/ui/numpad';
import { action } from '@storybook/addon-actions';
import { Meta, StoryObj, argsToTemplate, moduleMetadata } from '@storybook/angular';
import { expect, fn, userEvent, within } from '@storybook/test';

const meta: Meta<DsNumpad> = {
    title: 'Components/Numpad',
    component: DsNumpad,
    parameters: {
        status: generateStatusBadges('UX-2300', ['UX review']),
    },

    excludeStories: /.*Data$/,
    argTypes: {
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the numpad',
        },
        numberSeparator: {
            type: 'string',
            table: { category: 'Input' },
            control: { type: 'text' },
            description: 'The number separator character',
        },
        okText: {
            type: 'string',
            table: { category: 'Input' },
            control: { type: 'text' },
            description: 'The text of the ok button',
        },
    },
    args: {
        inverse: false,
        numberSeparator: '.',
        okText: 'Ok',
    },
    decorators: [],
};

export default meta;

type Story = StoryObj<DsNumpad>;

export const actionsData = {
    onTap: fn(action('tap')),
    onRemove: fn(action('remove')),
    onOk: fn(action('ok')),
};

export const Default: Story = {
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: {
            ...args,
            tap: actionsData.onTap,
            ok: actionsData.onOk,
            remove: actionsData.onRemove,
        },
        template: `<div style="width: 400px;"><ds-numpad ${argsToTemplate({
            ...args,
            tap: actionsData.onTap,
            ok: actionsData.onOk,
            remove: actionsData.onRemove,
        })}>
            </ds-numpad></div>
        `,
    }),
    play: async ({ canvasElement, step }) => {
        await step('check ok being clicked', async () => {
            const canvas = within(canvasElement);
            const buttons = canvas.queryAllByRole('button');
            await expect(buttons.length).toBe(13);
            const user = userEvent.setup();
            for (let i = 0; i < buttons.length; i++) {
                await user.click(buttons[i]);
            }
            await expect(actionsData.onTap).toBeCalledTimes(11);
            await expect(actionsData.onOk).toBeCalledTimes(1);
            await expect(actionsData.onRemove).toBeCalledTimes(1);
        });
    },
};

export const WithIcon: Story = {
    args: {
        ...Default.args,
    },
    decorators: [
        moduleMetadata({
            imports: [DemoIconComponent],
        }),
    ],
    render: (args) => ({
        props: {
            ...args,
        },
        template: `<ds-numpad ${argsToTemplate({
            ...args,
        })}>
            <ng-template #dsNumpadDelete>
                <ds-demo-icon slot="icon" class="ds-numpad-icon"/>
            </ng-template>
            </ds-numpad>
        `,
    }),
};
