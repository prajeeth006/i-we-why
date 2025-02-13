import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsButton } from '@frontend/ui/button';
import { DS_SEARCH_SIZES_ARRAY, DsSearchBar, DsSearchInput } from '@frontend/ui/searchbar';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

const meta: Meta<DsSearchBar> = {
    title: 'Components/Searchbar',
    parameters: {
        status: generateStatusBadges('UX-2416', ['integration ready']),
    },
    component: DsSearchBar,
    args: {
        placeholder: 'placeholder',
        disabled: false,
        inverse: false,
        size: 'small',
    },
    argTypes: {
        placeholder: {
            type: 'string',
            control: 'text',
            description: 'placeholder',
        },
        disabled: {
            type: 'boolean',
        },
        inverse: {
            type: 'boolean',
        },
        size: {
            options: DS_SEARCH_SIZES_ARRAY,
            table: {
                defaultValue: { summary: 'large' },
                category: 'Styling',
                type: { summary: 'small, large' },
            },
            control: { type: 'select' },
            description: 'The size of the search bar',
        },
    },
};
type Story = StoryObj<DsSearchBar>;

export const Default: Story = {
    parameters: {
        name: 'Default',
    },
    decorators: [moduleMetadata({ imports: [DemoIconComponent, DsSearchInput, DsButton] })],

    render: (args) => ({
        props: args,
        template: `
        <div style="width:200px">
        <ds-search-bar disabled="${args.disabled}" inverse="${args.inverse}" size="${args.size}">
        <ng-template #searchIcon>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M7.81578 14.5895C11.5568 14.5895 14.5895 11.5568 14.5895 7.81578C14.5895 4.07478 11.5568 1.0421 7.81578 1.0421C4.07478 1.0421 1.0421 4.07478 1.0421 7.81578C1.0421 11.5568 4.07478 14.5895 7.81578 14.5895ZM7.81578 15.6316C12.1323 15.6316 15.6316 12.1323 15.6316 7.81578C15.6316 3.49924 12.1323 0 7.81578 0C3.49924 0 0 3.49924 0 7.81578C0 12.1323 3.49924 15.6316 7.81578 15.6316Z" fill="currentColor"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.2632 16L12.6579 13.3948L13.3948 12.6579L16 15.2632L15.2632 16Z" fill="currentColor"/>
</svg>
        </ng-template>
        <input dsSearchInput data-testid="ds-search-input" placeholder='${args.placeholder}'>
    </ds-search-bar>
    </div>

        `,
    }),
};

export const withCustomIcon: Story = {
    parameters: {
        name: 'Default',
    },
    decorators: [moduleMetadata({ imports: [DemoIconComponent, DsSearchInput, DsButton] })],

    render: (args) => ({
        props: args,
        template: `
        <div style="width:200px">
        <ds-search-bar disabled="${args.disabled}" inverse="${args.inverse}" size="${args.size}">
        <input dsSearchInput data-testid="ds-search-input" placeholder='${args.placeholder}'>
        <ng-template #closeIcon>
        <ds-demo-icon iconName="placeholder"  />
        </ng-template>
    </ds-search-bar>
        </div>
        `,
    }),
};

export default meta;
