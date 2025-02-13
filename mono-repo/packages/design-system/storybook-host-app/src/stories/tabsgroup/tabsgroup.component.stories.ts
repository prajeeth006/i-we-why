import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DsDivider } from '@frontend/ui/divider';
import { DsNotificationBubble } from '@frontend/ui/notification-bubble';
import { DsTab, DsTabContent, DsTabHeader, DsTabsGroup } from '@frontend/ui/tabsgroup';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { expect, fireEvent, within } from '@storybook/test';

import { DsDemoStoryDynamicTabsComponent } from './dynamic-tabs.component';

type StoryType = DsTabsGroup & {
    ngContent?: string;
    size?: string;
    variant?: string;
    title?: string;
    indicator?: string;
    activeTab: string;
    scrollSpeed?: string;
    showBorderBottom?: boolean;
};

export default {
    title: 'Components/TabsGroup',
    component: DsTabsGroup,
    parameters: {
        status: generateStatusBadges('UX-2297', ['a11y', 'integration ready']),
    },
    args: {
        fullWidthTabs: false,
        activeTab: '1',
        size: 'large',
        variant: 'vertical',
        indicator: 'underline',
        scrollable: true,
        scrollSpeed: 'faster',
        scrollDistance: 200,
        inverse: false,
        showBorderBottom: false,
    },
    argTypes: {
        fullWidthTabs: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'false' },
            },
            control: { type: 'boolean' },
            description: 'Whether the tabs should take up the full width of the container',
        },
        scrollable: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'true' },
            },
            control: { type: 'boolean' },
            description: 'Whether we should show arrow navigation tabs',
        },
        scrollSpeed: {
            options: ['faster', 'fast', 'medium', 'moderate', 'slow', 'slower'],
            table: { defaultValue: { summary: 'faster' } },
            control: { type: 'select' },
            description: 'The speed of the scroll animation',
            if: { arg: 'scrollable' },
        },
        scrollDistance: {
            type: 'number',
            table: { defaultValue: { summary: '200' } },
            control: 'text',
            description: 'The distance in pixels the tab items will scroll with each navigation action',
            if: { arg: 'scrollable' },
        },
        activeTab: {
            type: 'string',
            table: { defaultValue: { summary: '' } },
            control: 'text',
            description: 'The text/value of name to be active',
        },
        size: {
            options: ['small', 'large'],
            table: { defaultValue: { summary: 'large' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'The size of the Tab icon',
        },
        indicator: {
            options: ['underline', 'fill'],
            table: { defaultValue: { summary: 'underline' }, category: 'Styling' },
            control: { type: 'select' },
        },
        variant: {
            options: ['horizontal', 'vertical'],
            table: { defaultValue: { summary: 'vertical' }, category: 'Styling' },
            control: { type: 'select' },
        },
        showBorderBottom: {
            type: 'boolean',
            table: {
                defaultValue: { summary: 'true' },
            },
            control: { type: 'boolean' },
            description: 'Whether we should show border bottom on non-active tab items',
        },
        inverse: {
            type: 'boolean',
            table: { defaultValue: { summary: 'false' }, category: 'Styling' },
            control: { type: 'boolean' },
            description: 'The inverse state of the tabsGroup',
        },
    },
    decorators: [
        moduleMetadata({
            imports: [DsTab, DsTabsGroup, DsTabContent, DsTabHeader, DsNotificationBubble, DsDivider],
        }),
    ],
    play: async ({ canvasElement, step }) => {
        await step('check selected state', async () => {
            const canvas = within(canvasElement);
            const tabs = canvas.getAllByRole('tab').filter((v) => v.ariaDisabled == null);
            for (const tab of tabs) {
                await fireEvent.click(tab);
                await fireEvent.focus(tab);

                await expect(tab).toHaveClass('ds-tab-selected');
            }
        });
        await step('check disabled state', async () => {
            const canvas = within(canvasElement);
            const tab = canvas.getAllByRole('tab').find((v) => v.ariaDisabled === 'true');
            await expect(tab).toBeDefined();
            if (tab === undefined) {
                return;
            }
            await fireEvent.click(tab);
            await fireEvent.focus(tab);

            await expect(tab).not.toHaveClass('ds-tab-selected');
            await expect(tab).toHaveClass('ds-tab-disabled');
        });
    },
} as Meta<StoryType>;

export const Default: StoryObj<StoryType> = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=8989-259365&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    argTypes: {
        variant: {
            table: { disable: true },
        },
    },
    render: (args) => ({
        props: args,
        template: `
    <div class="tabgroup-wrapper" style='width: 350px;'>
        <ds-tabs-group [activeTab]="${args.activeTab}" size="${args.size}" [scrollable]="${args.scrollable}" scrollDistance="${args.scrollDistance}"
        scrollSpeed="${args.scrollSpeed}" [fullWidthTabs]="${args.fullWidthTabs}" [inverse]="${args.inverse}" indicator="${args.indicator}">
            <ds-tab name="1" title="Tab1">
                <div *dsTabContent>Tab content 1</div>
            </ds-tab>
            <ds-tab name="2" title="Tab2" disabled="true">
                <div *dsTabContent>Tab content 2</div>
            </ds-tab>
            <ds-tab name="3" title="Tab3">
                <div *dsTabContent>Tab content 3</div>
            </ds-tab>
            <ds-tab name="4" title="Tab4" >
                <div *dsTabContent>Tab content 4</div>
            </ds-tab>

            ${args.showBorderBottom ? '<ds-divider />' : ''}
        </ds-tabs-group>
    </div>
    `,
    }),
};

export const TwoLineText: StoryObj<StoryType> = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=8989-259365&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    argTypes: {
        variant: {
            table: { disable: true },
        },
        indicator: {
            table: { disable: true },
        },
    },
    render: (args) => ({
        props: args,
        template: `

    <style>
       .example-two-line {
         display: flex;
         justify-content: center;
         align-items: center;
         flex-direction: column;
      }
    </style>

    <div class="tabgroup-wrapper" style='width: 350px;'>
        <ds-tabs-group [activeTab]="${args.activeTab}"
        [scrollable]=${args.scrollable} [scrollable]="${args.scrollable}" scrollSpeed="${args.scrollSpeed}" scrollDistance="${args.scrollDistance}" size="${args.size}" [fullWidthTabs]="${args.fullWidthTabs}" [inverse]="${args.inverse}">
            <ds-tab name="1">
                <div *dsTabHeader class="example-two-line">
                    <div>Tab</div>
                    <div>Tab</div>
                </div>
                <div *dsTabContent>Tab content 1</div>
            </ds-tab>
            <ds-tab name="2" disabled="true">
                <div *dsTabHeader class="example-two-line">
                    <div>Tab</div>
                    <div>Tab</div>
                </div>
                <div *dsTabContent>Tab content 2</div>
            </ds-tab>
            <ds-tab name="3">
                <div *dsTabHeader class="example-two-line">
                    <div>Tab</div>
                    <div>Tab</div>
                </div>
                <div *dsTabContent>Tab content 3</div>
            </ds-tab>
            <ds-tab name="4">
                <div *dsTabHeader class="example-two-line">
                    <div>Tab 4 long first title text</div>
                    <div>Tab 4 long second title text</div>
                </div>
                <div *dsTabContent>Tab content 4</div>
            </ds-tab>

            ${args.showBorderBottom ? '<ds-divider />' : ''}
        </ds-tabs-group>
    </div>
    `,
    }),
};

export const WithImage: StoryObj<StoryType> = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=7764-126908&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    render: (args) => ({
        props: args,
        template: `
    <div class="tabgroup-wrapper" style='width: 650px;'>
        <ds-tabs-group [activeTab]="${args.activeTab}"
            size="${args.size}"
            [fullWidthTabs]=${args.fullWidthTabs} [scrollable]=${args.scrollable}
            scrollDistance="${args.scrollDistance}" scrollSpeed="${args.scrollSpeed}"
            variant="${args.variant}"
            indicator="${args.indicator}"
            [inverse]="${args.inverse}">
            <ds-tab name="1">
                <ng-container *dsTabHeader>
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div>Tab1</div>
                </ng-container>
                <div *dsTabContent>Tab content 1</div>
            </ds-tab>

            <ds-tab name="2" title="Tab2">
                <ng-container *dsTabHeader>
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div>Tab2</div>
                </ng-container>
                <div *dsTabContent>Tab content 2</div>
            </ds-tab>

            <ds-tab name="3">
                <ng-container *dsTabHeader>
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div>Tab3</div>
                </ng-container>
                <div *dsTabContent>Tab content 3</div>
            </ds-tab>

            <ds-tab name="4" disabled="true">
                <ng-container *dsTabHeader>
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div>Tab 4 long title text</div>
                </ng-container>
                <div *dsTabContent>Tab content 4</div>
            </ds-tab>
            <ds-tab name="5" disabled="true">
                <ng-container *dsTabHeader>
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div>Tab5</div>
                </ng-container>
                <div *dsTabContent>Tab content 5</div>
            </ds-tab>

            <ds-tab name="6">
                <ng-container *dsTabHeader="let selected; let selectedName = name">
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div>
                        Tab6

                        @if (selected) {
                          ✔
                        }
                    </div>
                </ng-container>
                <div *dsTabContent>Tab content 6</div>
            </ds-tab>

            <ds-tab name="7">
                <ng-container *dsTabHeader>
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div>Tab7</div>
                </ng-container>
                <div *dsTabContent>Tab content 7</div>
            </ds-tab>

            ${args.showBorderBottom ? '<ds-divider />' : ''}
        </ds-tabs-group>
    </div>
    `,
    }),
};

export const WithImageAndNotificationBubble: StoryObj<StoryType> = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9238-10998&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    render: (args) => ({
        props: args,
        template: `
    <style>
      .example-title {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
      }
    </style>

    <div class="tabgroup-wrapper" style='display:flex; justify-content: center;' [style.width.px]="${args.scrollable ? '450' : '850'}">
        <ds-tabs-group [activeTab]="${args.activeTab}" [scrollable]=${args.scrollable} [inverse]="${args.inverse}"
        scrollDistance="${args.scrollDistance}" scrollSpeed="${args.scrollSpeed}" size="${args.size}" 
        [fullWidthTabs]=${args.fullWidthTabs} variant="${args.variant}" indicator="${args.indicator}">
            <ds-tab name="1">
                <ng-container *dsTabHeader="let selected">
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div class="example-title">
                        Tab1
                        <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                    </div>
                </ng-container>
                <div *dsTabContent>Tab content 1</div>
            </ds-tab>
            <ds-tab name="2" disabled="true">
                <ng-container *dsTabHeader="let selected">
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div class="example-title">
                        Tab
                        <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" disabled="true" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                    </div>
                </ng-container>
                <div *dsTabContent>Tab content 2</div>
            </ds-tab>
            <ds-tab name="3">
                <ng-container *dsTabHeader="let selected">
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div class="example-title">
                        Tab3
                        <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                    </div>
                </ng-container>
                <div *dsTabContent>Tab content 3</div>
            </ds-tab>
            <ds-tab name="4">
                <ng-container *dsTabHeader="let selected">
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div class="example-title">
                        Tab 4 long title text
                        <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                    </div>
                </ng-container>
                <div *dsTabContent>Tab content 4</div>
            </ds-tab>
            <ds-tab name="5">
                <ng-container *dsTabHeader="let selected">
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div class="example-title">
                        Tab
                        <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                    </div>
                </ng-container>
                <div *dsTabContent>Tab content 5</div>
            </ds-tab>
            <ds-tab name="6">
                <ng-container *dsTabHeader="let selected">
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div class="example-title">
                        Tab6
                        <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                    </div>
                </ng-container>
                <div *dsTabContent>Tab content 6</div>
            </ds-tab>
            <ds-tab name="7">
                <ng-container *dsTabHeader="let selected; let selectedName = name">
                    <svg style="display: block;" width="${args.size === 'small' ? '16px' : '24px'}" height="${args.size === 'small' ? '16px' : '24px'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
                    </svg>
                    <div class="example-title">
                        Tab7
                        <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                    </div>
                </ng-container>
                <div *dsTabContent>Tab content 7</div>
            </ds-tab>

            ${args.showBorderBottom ? '<ds-divider />' : ''}
        </ds-tabs-group>
    </div>
    `,
    }),
};

export const WithNotificationBubble: StoryObj<StoryType> = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9238-11262&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    argTypes: {
        variant: {
            table: { disable: true },
        },
    },
    render: (args) => ({
        props: args,
        template: `
    <div class="tabgroup-wrapper" style='width: 750px;'>
        <ds-tabs-group [activeTab]="${args.activeTab}" size="${args.size}" variant="horizontal" [scrollable]=${args.scrollable}
        scrollDistance="${args.scrollDistance}" [scrollDistance]="${args.scrollDistance}" [fullWidthTabs]="${args.fullWidthTabs}" [inverse]="${args.inverse}">
            <ds-tab name="1">
                <ng-container *dsTabHeader="let selected">
                    Tab1
                    <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                </ng-container>
                <div *dsTabContent>Tab content 1</div>
            </ds-tab>
            <ds-tab name="2" disabled="true">
                <ng-container *dsTabHeader="let selected">
                    Tab2
                    <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" disabled="true" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                </ng-container>
                <div *dsTabContent>Tab content 2</div>
            </ds-tab>
            <ds-tab name="3">
                 <ng-container *dsTabHeader="let selected">
                    Tab3
                    <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'"  size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                </ng-container>
                <div *dsTabContent>Tab content 3</div>
            </ds-tab>
            <ds-tab name="4">
                 <ng-container *dsTabHeader="let selected">
                    Tab4
                    <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                </ng-container>
                <div *dsTabContent>Tab content 4</div>
            </ds-tab>
            <ds-tab name="5">
                <ng-container *dsTabHeader="let selected">
                    Tab5
                    <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                </ng-container>
                <div *dsTabContent>Tab content 5</div>
            </ds-tab>
            <ds-tab name="6">
                 <ng-container *dsTabHeader="let selected">
                    Tab6
                    <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                </ng-container>
                <div *dsTabContent>Tab content 6</div>
            </ds-tab>
            <ds-tab name="7">
                 <ng-container *dsTabHeader="let selected">
                    Tab7
                    <ds-notification-bubble [variant]="selected ? 'primary' : 'neutral'" size="${args.size}" [inverse]="${args.inverse}">0</ds-notification-bubble>
                </ng-container>
                <div *dsTabContent>Tab content 7</div>
            </ds-tab>

            ${args.showBorderBottom ? '<ds-divider />' : ''}
        </ds-tabs-group>
    </div>
    `,
    }),
};

export const WithNormalTitleAndContent: StoryObj<StoryType> = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9639-106855&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    argTypes: {
        variant: {
            table: { disable: true },
        },
    },
    render: (args) => ({
        props: args,
        template: `
    <div class="tabgroup-wrapper" style='width: 350px;'>
        <ds-tabs-group [activeTab]="${args.activeTab}" size="${args.size}" scrollable="${args.scrollable}"
        scrollDistance="${args.scrollDistance}" scrollDistance="${args.scrollDistance}" 
        [fullWidthTabs]="${args.fullWidthTabs}" [inverse]="${args.inverse}" indicator="${args.indicator}">
            <ds-tab name="1" title="Tab1">
                <div>Tab content 1</div>
            </ds-tab>
            <ds-tab name="2" title="Tab2" disabled="true">
                <div>Tab content 2</div>
            </ds-tab>
            <ds-tab name="3" title="Tab3">
                <div>Tab content 3</div>
            </ds-tab>
            <ds-tab name="4" title="Tab4">
                <div>Tab content 4</div>
            </ds-tab>

            ${args.showBorderBottom ? '<ds-divider />' : ''}
        </ds-tabs-group>
    </div>
    `,
    }),
};

export const WithScrollArrows: StoryObj<StoryType> = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9742-36267&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    argTypes: {
        variant: {
            table: { disable: true },
        },
    },
    render: (args) => ({
        props: args,
        template: `
         <div class="tabgroup-wrapper" style='width: 550px;'>
                 <ds-tabs-group activeTab="${args.activeTab}" size="${args.size}"  [scrollable]="${args.scrollable}"
                 scrollDistance="${args.scrollDistance}" scrollSpeed="${args.scrollSpeed}" [fullWidthTabs]="${args.fullWidthTabs}"
                [inverse]="${args.inverse}" indicator="${args.indicator}">
                    <ds-tab name="1" title="Tab1">
                        <div>Tab content 1</div>
                    </ds-tab>
                    <ds-tab name="2" title="Tab2 Item" disabled="true">
                        <div>Tab content 2</div>
                    </ds-tab>
                    <ds-tab name="3" title="Tab3">
                        <div>Tab content 3</div>
                    </ds-tab>
                    <ds-tab name="4" title="Tab 4 long title text" >
                        <div>Tab content 4</div>
                    </ds-tab>
                    <ds-tab name="5" title="Tab5 Item">
                        <div>Tab content 5</div>
                    </ds-tab>
                    <ds-tab name="6" title="Tab6">
                        <div>Tab content 6</div>
                    </ds-tab>
                    <ds-tab name="7" title="Tab7 long title text">
                        <div>Tab content 7</div>
                    </ds-tab>
                    <ds-tab name="8" title="Tab 8">
                        <div>Tab content 8</div>
                    </ds-tab>
                    <ds-tab name="9" title="Tab9 long title text">
                        <div>Tab content 9</div>
                    </ds-tab>

                    ${args.showBorderBottom ? '<ds-divider />' : ''}
                </ds-tabs-group>
        </div>
    `,
    }),
};

export const WithCustomScrollArrows: StoryObj<StoryType> = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9742-36267&mode=design&t=fS1qO73SS8lGciLj-4',
        },
    },
    argTypes: {
        variant: {
            table: { disable: true },
        },
    },
    render: (args) => ({
        props: args,
        template: `
         <div class="tabgroup-wrapper" style='width: 450px;'>
                 <ds-tabs-group [activeTab]="${args.activeTab}" size="${args.size}" [scrollable]="${args.scrollable}"
                 scrollDistance="${args.scrollDistance}" scrollSpeed="${args.scrollSpeed}" [fullWidthTabs]="${args.fullWidthTabs}"
                 [inverse]="${args.inverse}" indicator="${args.indicator}">
                    <ds-tab name="1" title="Tab1">
                        <div>Tab content 1</div>
                    </ds-tab>
                    <ds-tab name="2" title="Tab2" disabled="true">
                        <div>Tab content 2</div>
                    </ds-tab>
                    <ds-tab name="3" title="Tab3">
                        <div>Tab content 3</div>
                    </ds-tab>
                    <ds-tab name="4" title="Tab 4 long title text" >
                        <div>Tab content 4</div>
                    </ds-tab>
                    <ds-tab name="5" title="Tab5">
                        <div>Tab content 5</div>
                    </ds-tab>
                    <ds-tab name="6" title="Tab6">
                        <div>Tab content 6</div>
                    </ds-tab>
                    <ds-tab name="7" title="Tab7">
                        <div>Tab content 7</div>
                    </ds-tab>
                    <ds-tab name="8" title="Tab8">
                        <div>Tab content 8</div>
                    </ds-tab>
                    <ds-tab name="9" title="Tab9">
                        <div>Tab content 9</div>
                    </ds-tab>
                    <ds-tab name="10" title="Tab10 long title text">
                        <div>Tab content 10</div>
                    </ds-tab>
                    <ds-tab name="11" title="Tab11">
                        <div>Tab content 11</div>
                    </ds-tab>
                    <ds-tab name="12" title="Tab12 long title text">
                        <div>Tab content 12</div>
                    </ds-tab>
                    <ng-template #dsTabsLeftArrow> < </ng-template>
                    <ng-template #dsTabsRightArrow> > </ng-template>

                    ${args.showBorderBottom ? '<ds-divider />' : ''}
                </ds-tabs-group>
        </div>
    `,
    }),
};

type TabOptions = {
    disabled?: boolean;
    withNotificationBubble?: boolean;
    withImage?: boolean;
    twoLines?: boolean;
};

const generateTab = (name: string, title: string, content: string, options: TabOptions = {}): string => {
    const { disabled = false, withNotificationBubble = false, withImage = false, twoLines = false } = options;

    const tabIcon = withImage
        ? `
        <svg style="display: block;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M2 3.81818H4.72727V2H19.2727V3.81818H22V6.90405C22 7.81592 21.5443 8.66745 20.7855 9.17327L19.9598 9.72377C19.7336 9.87456 19.4875 9.98985 19.2298 10.067C18.8764 13.3209 16.3765 15.9307 13.1755 16.4509L13.0386 18.3683C12.9686 19.3483 13.7448 20.1818 14.7273 20.1818H16.5455C17.0475 20.1818 17.4545 20.5889 17.4545 21.0909V22H6.54545V21.0909C6.54545 20.5889 6.95247 20.1818 7.45455 20.1818H9.13849C10.1937 20.1818 11.027 19.2865 10.9518 18.2341L10.8244 16.4509C7.62344 15.9307 5.12361 13.3209 4.77015 10.067C4.51255 9.98985 4.26639 9.87456 4.04021 9.72377L3.21445 9.17327C2.45573 8.66745 2 7.81592 2 6.90405V3.81818ZM12 4.72727L13.0474 6.9221L15.4584 7.23993L13.6946 8.91428L14.1374 11.3055L12 10.1454L9.8626 11.3055L10.3054 8.91428L8.54161 7.23993L10.9527 6.9221L12 4.72727Z" fill="#252D41"/>
        </svg>`
        : '';

    const notificationBubble = withNotificationBubble ? `<ds-notification-bubble variant="primary" size="large">0</ds-notification-bubble>` : '';

    const tabTitle = twoLines
        ? `
      <div>Tab</div>
      <div>Tab</div>`
        : `
      <div>${title} ${notificationBubble}</div>`;

    return `
      <ds-tab name="${name}" title="${title}" ${disabled ? 'disabled="true"' : ''}>
        <ng-container *dsTabHeader>
          ${tabIcon}
          ${tabTitle}
        </ng-container>
        <div *dsTabContent>${content}</div>
      </ds-tab>`;
};

const generateTabGroup = (
    tabs: string[],
    options: {
        activeTab: string;
        size: string;
        variant?: string;
        indicator?: string;
        scrollable?: boolean;
        fullWidthTabs?: boolean;
        inverse?: boolean;
        showBorderBottom?: boolean;
    },
): string => {
    const {
        activeTab,
        size,
        variant = 'vertical',
        indicator = 'underline',
        scrollable = true,
        fullWidthTabs = false,
        inverse = false,
        showBorderBottom = false,
    } = options;

    return `
    <div style="padding: 15px; border-radius: 4px;">
      <ds-tabs-group
        [activeTab]="${activeTab}"
        size="${size}"
        variant="${variant}"
        indicator="${indicator}"
        [scrollable]="${scrollable}"
        [fullWidthTabs]="${fullWidthTabs}"
        [inverse]="${inverse}"
      >
        ${tabs.join('\n')}

        ${showBorderBottom ? '<ds-divider />' : ''}
      </ds-tabs-group>
    </div>`;
};

export const WithDynamicTabs: StoryObj<StoryType> = {
    argTypes: {
        showBorderBottom: {
            table: { disable: true },
        },
    },
    render: () => ({
        tags: ['docs-template'],
        moduleMetadata: { imports: [DsDemoStoryDynamicTabsComponent] },
        template: `
            <div class="tabgroup-wrapper" style='width: 350px;'>
                <ds-demo-story-dynamic-tabs />
            </div>
        `,
    }),
};

export const AllVariants: StoryObj<StoryType> = {
    tags: ['docs-template'],
    parameters: {
        docs: {
            source: {
                code: null,
            },
        },
    },
    render: (args) => ({
        props: args,
        template: `
        <div style="display: flex; flex-direction: column; gap: 15px;">
       <h1 style="display: flex; justify-content: center; gap: 15px;">Underlined</h1>

          <!-- With Image -->
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <h2>With Image </h2>
            <div class="tabgroup-wrapper" style="width: 750px;">
              ${generateTabGroup(
                  [
                      generateTab('1', 'Tab1', 'Tab content 1', { withImage: true }),
                      generateTab('2', 'Tab2', 'Tab content 2', { withImage: true }),
                      generateTab('3', 'Tab3', 'Tab content 3', { withImage: true }),
                      generateTab('4', 'Tab4', 'Tab content 4', { withImage: true, disabled: true }),
                      generateTab('5', 'Tab5', 'Tab content 5', { withImage: true, disabled: true }),
                      generateTab('6', 'Tab6', 'Tab content 6', { withImage: true }),
                      generateTab('7', 'Tab7', 'Tab content 7', { withImage: true }),
                  ],
                  { activeTab: '1', size: 'large', indicator: 'underline' },
              )}
            </div>
          </div>

          <!-- With Image and Notification Bubble -->
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <h2>With Image and Notification Bubble</h2>
            <div class="tabgroup-wrapper" style="width: 750px;">
              ${generateTabGroup(
                  [
                      generateTab('1', 'Tab1', 'Tab content 1', { withImage: true, withNotificationBubble: true }),
                      generateTab('2', 'Tab2', 'Tab content 2', { withImage: true, withNotificationBubble: true, disabled: true }),
                      generateTab('3', 'Tab 3 long title text', 'Tab content 3', { withImage: true, withNotificationBubble: true }),
                      generateTab('4', 'Tab4', 'Tab content 4', { withImage: true, withNotificationBubble: true }),
                      generateTab('5', 'Tab5', 'Tab content 5', { withImage: true, withNotificationBubble: true }),
                      generateTab('6', 'Tab6', 'Tab content 6', { withImage: true, withNotificationBubble: true }),
                      generateTab('7', 'Tab7', 'Tab content 7', { withImage: true, withNotificationBubble: true }),
                  ],
                  { activeTab: '1', size: 'large', indicator: 'underline', scrollable: true },
              )}
            </div>
          </div>

        <!-- Two Line Text  -->
        <div style="display: flex; flex-direction: column; gap: 15px;">
            <h2>Two Line Text</h2>
            <div class="tabgroup-wrapper" style="width: 750px;">
              ${generateTabGroup(
                  [
                      generateTab('1', 'Tab1', 'Tab content 1', { twoLines: true }),
                      generateTab('2', 'Tab2', 'Tab content 2', { twoLines: true, disabled: true }),
                      generateTab('3', 'Tab3', 'Tab content 3', { twoLines: true }),
                      generateTab('4', 'Tab4', 'Tab content 4', { twoLines: true }),
                  ],
                  { activeTab: '1', size: 'large', indicator: 'underline', showBorderBottom: !!args.showBorderBottom },
              )}
             </div>
        </div>

        <!-- Default  -->
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <h2>Default </h2>
          <div class="tabgroup-wrapper" style="width: 750px;">
            ${generateTabGroup(
                [
                    generateTab('1', 'Tab', 'Tab content 1'),
                    generateTab('2', 'Tab', 'Tab content 2', { disabled: true }),
                    generateTab('3', 'Tab', 'Tab content 3'),
                    generateTab('4', 'Tab', 'Tab content 4'),
                ],
                { activeTab: '1', size: 'large', indicator: 'underline' },
            )}
          </div>
        </div>

          <!-- With NotificationBubble -->
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <h2>With Notification Bubble </h2>
            <div class="tabgroup-wrapper" style="width: 750px;">
              ${generateTabGroup(
                  [
                      generateTab('1', 'Tab 1 long title text', 'Tab content 1', { withNotificationBubble: true }),
                      generateTab('2', 'Tab2', 'Tab content 2', { withNotificationBubble: true, disabled: true }),
                      generateTab('3', 'Tab3', 'Tab content 3', { withNotificationBubble: true }),
                      generateTab('4', 'Tab4', 'Tab content 4', { withNotificationBubble: true }),
                      generateTab('5', 'Tab5', 'Tab content 5', { withNotificationBubble: true }),
                      generateTab('6', 'Tab6', 'Tab content 6', { withNotificationBubble: true }),
                      generateTab('7', 'Tab7', 'Tab content 7', { withNotificationBubble: true }),
                  ],
                  { activeTab: '1', size: 'large', indicator: 'underline' },
              )}
            </div>
          </div>

          <!-- With Normal Title and Content -->
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <h2>With Normal Title and Content </h2>
            <div class="tabgroup-wrapper" style="width: 750px;">
              ${generateTabGroup(
                  [
                      generateTab('1', 'Tab1', 'Tab content 1'),
                      generateTab('2', 'Tab2', 'Tab content 2', { disabled: true }),
                      generateTab('3', 'Tab3', 'Tab content 3'),
                      generateTab('4', 'Tab 4 long title text', 'Tab content 4'),
                  ],
                  { activeTab: '1', size: 'large', indicator: 'underline' },
              )}
            </div>
          </div>

          <!-- With Scroll Arrows -->
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <h2>With Scroll Arrows </h2>
            <div class="tabgroup-wrapper" style="width: 450px;">
              ${generateTabGroup(
                  [
                      generateTab('1', 'Tab1', 'Tab content 1'),
                      generateTab('2', 'Tab2', 'Tab content 2', { disabled: true }),
                      generateTab('3', 'Tab3', 'Tab content 3'),
                      generateTab('4', 'Tab 4 long title text', 'Tab content 4'),
                      generateTab('5', 'Tab5', 'Tab content 5'),
                      generateTab('6', 'Tab6', 'Tab content 6'),
                      generateTab('7', 'Tab7', 'Tab content 7'),
                      generateTab('8', 'Tab8', 'Tab content 8'),
                      generateTab('9', 'Tab9', 'Tab content 9'),
                  ],
                  { activeTab: '1', size: 'large', indicator: 'underline', scrollable: true },
              )}
            </div>
          </div>

           <!-- With Image-->
           <h1 style="display: flex; justify-content: center; gap: 15px;">Filled</h1>

                   <!-- Default  -->
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <h2>Default </h2>
          <div class="tabgroup-wrapper" style="width: 750px;">
            ${generateTabGroup(
                [
                    generateTab('1', 'Tab', 'Tab content 1'),
                    generateTab('2', 'Tab', 'Tab content 2', { disabled: true }),
                    generateTab('3', 'Tab', 'Tab content 3'),
                    generateTab('4', 'Tab', 'Tab content 4'),
                ],
                { activeTab: '1', size: 'large', indicator: 'fill' },
            )}
          </div>
        </div>

           <div style="display: flex; flex-direction: column; gap: 15px;">
             <h2>With Image</h2>
             <div class="tabgroup-wrapper" style="width: 750px;">
               ${generateTabGroup(
                   [
                       generateTab('1', 'Tab', 'Tab content 1', { withImage: true }),
                       generateTab('2', 'Tab', 'Tab content 2', { withImage: true }),
                       generateTab('3', 'Tab', 'Tab content 3', { withImage: true }),
                       generateTab('4', 'Tab', 'Tab content 4', { withImage: true, disabled: true }),
                       generateTab('5', 'Tab', 'Tab content 5', { withImage: true, disabled: true }),
                       generateTab('6', 'Tab', 'Tab content 6', { withImage: true }),
                       generateTab('7', 'Tab', 'Tab content 7', { withImage: true }),
                   ],
                   { activeTab: '1', size: 'large', indicator: 'fill' },
               )}
            </div>
          </div>

          <!-- With Image and Notification Bubble-->
          <div style="display: flex; flex-direction: column; gap: 15px;">
            <h2>With Image and Notification Bubble</h2>
            <div class="tabgroup-wrapper" style="width: 750px;">
              ${generateTabGroup(
                  [
                      generateTab('1', 'Tab', 'Tab content 1', { withImage: true, withNotificationBubble: true }),
                      generateTab('2', 'Tab', 'Tab content 2', { withImage: true, withNotificationBubble: true, disabled: true }),
                      generateTab('3', 'Tab', 'Tab content 3', { withImage: true, withNotificationBubble: true }),
                      generateTab('4', 'Tab', 'Tab content 4', { withImage: true, withNotificationBubble: true }),
                      generateTab('5', 'Tab', 'Tab content 5', { withImage: true, withNotificationBubble: true }),
                      generateTab('6', 'Tab', 'Tab content 6', { withImage: true, withNotificationBubble: true }),
                      generateTab('7', 'Tab', 'Tab content 7', { withImage: true, withNotificationBubble: true }),
                  ],
                  { activeTab: '1', size: 'large', indicator: 'fill' },
              )}
            </div>
          </div>
       `,
    }),
};
