import { Meta, StoryObj } from '@storybook/angular';

import { DsTokens } from '../../../lib/storybook-components/tokens/tokens.component';
import { SEMANTIC_TOKEN_TYPE_ARRAY } from '../../../lib/storybook-components/tokens/tokens.utils';

const meta: Meta<DsTokens> = {
    title: 'Tokens/Semantic tokens',
    component: DsTokens,
    parameters: {
        name: 'Default',
        viewMode: 'docs',
    },
    argTypes: {
        tokenType: {
            type: 'string',
            options: SEMANTIC_TOKEN_TYPE_ARRAY,
            table: { defaultValue: { summary: 'true' }, category: 'Type' },
            control: { type: 'select' },
            description: 'The type of tokens to be displayed',
        },
    },
    excludeStories: /.*Data$/,
    render: (args) => ({
        template: `
        <ds-storybook-tokens tokenType="${args.tokenType}"/>
        `,
    }),
};

export default meta;
type Story = StoryObj<DsTokens>;

export const Colors: Story = {
    args: {
        tokenType: 'color',
    },
};

export const Sizes: Story = {
    args: {
        tokenType: 'size',
    },
};

export const Spacing: Story = {
    args: {
        tokenType: 'spacing',
    },
};

export const BorderRadius: Story = {
    args: {
        tokenType: 'borderRadius',
    },
};

export const Elevation: Story = {
    args: {
        tokenType: 'elevation',
    },
};

export const FontSize: Story = {
    args: {
        tokenType: 'fontSize',
    },
};

export const LineHeight: Story = {
    args: {
        tokenType: 'lineHeight',
    },
};

export const FontWeight: Story = {
    args: {
        tokenType: 'fontWeight',
    },
};

export const FontFamily: Story = {
    args: {
        tokenType: 'fontFamily',
    },
};

export const Typography: Story = {
    render: () => ({
        template: `
        <ds-storybook-tokens typographyPage="true"/>
        `,
    }),

    argTypes: {
        tokenType: {
            table: {
                disable: true,
            },
        },
    },
};
