import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsButton } from '@frontend/ui/button';
import { DsIconButton } from '@frontend/ui/icon-button';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

@Component({
    selector: 'ds-demo-button-toggle',
    standalone: true,
    imports: [DsIconButton, DemoIconComponent],
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DsDemoButtonToggle {
    selected = input(false);
}

const meta: Meta<DsDemoButtonToggle> = {
    title: 'Components/Button/Button Toggle',
    component: DsDemoButtonToggle,
    excludeStories: /.*Data$/,
    parameters: {
        status: generateStatusBadges('UX-4086', ['a11y', 'stable']),
    },
    args: {
        selected: false,
    },
    argTypes: {
        selected: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'Selected state of the button',
        },
    },
};

export default meta;
type Story = StoryObj<DsDemoButtonToggle>;

export const ButtonToggle: Story = {
    decorators: [moduleMetadata({ imports: [DsDemoButtonToggle, DsButton] })],
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: {
            ...args,
        },
        template: `
        <button ds-button [kind]="selected ? 'tertiary' : 'success'" (click)="selected = !selected">{{selected ? 'Label toggled' : 'Default label'}}</button>
            `,
    }),
};

export const IconButtonToggle: Story = {
    decorators: [moduleMetadata({ imports: [DsDemoButtonToggle, DsIconButton, DemoIconComponent] })],
    args: {
        ...meta.args,
    },
    render: (args) => ({
        props: {
            ...args,
        },
        template: `
        <button ds-icon-button [kind]="selected ? 'secondary' : 'primary'" (click)="selected = !selected">
            <ds-demo-icon [iconName]="selected ? 'close' : 'chevron'"></ds-demo-icon>
        </button>
            `,
    }),
};
