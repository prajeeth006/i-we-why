import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { DsMyFontSelector } from './my-font-selector.component';
import { FONT_NAMES_ARRAY } from './my-font-selector.utils';

const meta: Meta<DsMyFontSelector> = {
    title: 'Font Selector',
    decorators: [moduleMetadata({ imports: [DsMyFontSelector] })],
    argTypes: {
        fontFamilyOne: {
            type: 'string',
            options: FONT_NAMES_ARRAY,
            table: { defaultValue: { summary: 'sans-serif' } },
            control: { type: 'select' },
            description: 'Select font family for paragraph one',
        },
        fontFamilyTwo: {
            type: 'string',
            options: FONT_NAMES_ARRAY,
            table: { defaultValue: { summary: 'GT America' } },
            control: { type: 'select' },
            description: 'Select font family for paragraph two',
        },
        fontSize: {
            type: 'number',
            table: { defaultValue: { summary: '48' } },
            control: {
                type: 'number',
                min: 0,
                max: 100,
                step: 1,
            },
            description: 'The font size of the paragraph in px',
        },
        lineHeight: {
            type: 'number',
            table: { defaultValue: { summary: '1' } },
            control: {
                type: 'number',
                min: 0,
                max: 100,
                step: 1,
            },
            description: 'The line height number multiplied by the element font size',
        },
        title: {
            type: 'string',
            table: { defaultValue: { summary: 'Lorem Qq Pp Yy' } },
            control: 'text',
            description: 'Some dummy text for both element 1 and 2',
        },
        overlapElement: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'Determines whether Font 2 should overlap Font 1',
        },
    },
    args: {
        fontFamilyOne: 'sans-serif',
        fontFamilyTwo: 'GT America',
        fontSize: 48,
        lineHeight: 1,
        title: 'Lorem Qq Pp Yy',
        overlapElement: false,
    },
    excludeStories: /.*Data$/,
    tags: ['docs-template'],
    parameters: {
        docs: {
            source: {
                code: null,
            },
        },
    },
    render: (args) => ({
        template: `
        <ds-my-font-selector title="${args.title}" fontFamilyOne="${args.fontFamilyOne}" fontFamilyTwo="${args.fontFamilyTwo}" 
        fontSize="${args.fontSize}" lineHeight="${args.lineHeight}"
        [overlapElement]="${args.overlapElement}"/>
        `,
    }),
};

export default meta;
type Story = StoryObj<DsMyFontSelector>;

export const FontSelector: Story = {};
