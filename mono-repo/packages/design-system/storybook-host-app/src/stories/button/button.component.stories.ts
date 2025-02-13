import { ChangeDetectionStrategy, Component } from '@angular/core';

import { DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsBonusButton } from '@frontend/ui/bonus-button';
import { DS_BUTTON_KIND_ARRAY, DS_BUTTON_NOT_SUPPORTED_CONFIG, DS_BUTTON_SIZES_ARRAY, DS_BUTTON_VARIANTS_ARRAY, DsButton } from '@frontend/ui/button';
import { DS_ICON_BUTTON_KIND_ARRAY, DS_ICON_BUTTON_SIZES_ARRAY, DsIconButton, DsIconButtonSizes } from '@frontend/ui/icon-button';
import {
    DS_SOCIAL_BUTTON_APP_ARRAY,
    DS_SOCIAL_BUTTON_SIZES_ARRAY,
    DS_SOCIAL_BUTTON_VARIANT_ARRAY,
    DsSocialButton,
    DsSocialButtonAppArray,
    DsSocialButtonSize,
    DsSocialButtonVariant,
} from '@frontend/ui/social-button';
import { withActions } from '@storybook/addon-actions/decorator';
import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';

import { allThemes } from '../../modes';

@Component({
    selector: 'ds-storybook-button-variants',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DsButton, DemoIconComponent],
    template: ` ${renderDefaultButtons()} `,
})
class DsStorybookButtonWrapperComponent {}

const meta: Meta<unknown> = {
    title: 'Components/Button/All Buttons',
    excludeStories: /.*Data$/,
    parameters: {},
    args: {},
    decorators: [
        moduleMetadata({
            imports: [DsIconButton, DsSocialButton, DsBonusButton, DemoIconComponent, DsStorybookButtonWrapperComponent],
            declarations: [],
        }),
        withActions,
    ],
};

export default meta;
type Story = StoryObj<unknown>;

function renderButtonBlockRow(
    label: string,
    buttonType: string,
    kind: string,
    size: string,
    { showLeftIcon = false, showRightIcon = false, showSubText = false, iconOnly = false } = {},
    variant?: string,
) {
    return `
    <span style="justify-self: start;  white-space: nowrap">${label}</span>
    <div>
        <button ${buttonType} kind="${kind}" size="${size}" ${variant ? `variant=${variant}` : ''}>
            ${iconOnly ? '' : 'Label'}
            ${showLeftIcon ? '<ds-demo-icon slot="start"/>' : ''}
            ${showRightIcon ? '<ds-demo-icon slot="end"/>' : ''}
            ${iconOnly ? '<ds-demo-icon/>' : ''}
            ${showSubText ? '<span slot="subtext">subtext</span>' : ''}
        </button>
    </div>
    <div class="pseudo-hover-all">
        <button ${buttonType} kind="${kind}" ${variant ? `variant=${variant}` : ''} size="${size}">
            ${iconOnly ? '' : 'Label'}
            ${showLeftIcon ? '<ds-demo-icon slot="start"/>' : ''}
            ${showRightIcon ? '<ds-demo-icon slot="end"/>' : ''}
            ${iconOnly ? '<ds-demo-icon/>' : ''}
            ${showSubText ? '<span slot="subtext">subtext</span>' : ''}
        </button>
    </div>
    <div class="pseudo-active-all">
        <button ${buttonType} kind="${kind}" ${variant ? `variant=${variant}` : ''} size="${size}">
        
            ${iconOnly ? '' : 'Label'}
            ${showLeftIcon ? '<ds-demo-icon slot="start"/>' : ''}
            ${showRightIcon ? '<ds-demo-icon slot="end"/>' : ''}
            ${iconOnly ? '<ds-demo-icon/>' : ''}
            ${showSubText ? '<span slot="subtext">subtext</span>' : ''}
        </button>
    </div>
    <div>
        <button ${buttonType} [disabled]="true" kind="${kind}" ${variant ? `variant=${variant}` : ''} size="${size}">
            ${iconOnly ? '' : 'Label'}
            ${showLeftIcon ? '<ds-demo-icon slot="start"/>' : ''}
            ${showRightIcon ? '<ds-demo-icon slot="end"/>' : ''}
            ${iconOnly ? '<ds-demo-icon/>' : ''}
            ${showSubText ? '<span slot="subtext">subtext</span>' : ''}
        </button>
    </div>
    `;
}

function renderButtonBlock(kind: string, size: string, variant: string) {
    const large = `
    ${renderButtonBlockRow('Sub Text', 'ds-button', kind, size, { showSubText: true, showLeftIcon: false, showRightIcon: false }, variant)}
    ${renderButtonBlockRow('Sub Text, Left Icon', 'ds-button', kind, size, { showSubText: true, showLeftIcon: true, showRightIcon: false }, variant)}
    ${renderButtonBlockRow('Sub Text, Right Icon', 'ds-button', kind, size, { showSubText: true, showLeftIcon: false, showRightIcon: true }, variant)}
    `;

    return `
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); grid-row-gap: 1em; grid-column-gap: 1em; align-items: center; justify-items: center; margin-bottom: 20px;">
        <div style="grid-column: span 5;"><strong>${size}</strong></div>
        <span style="justify-self: start;">Type</span>
        <span>Default</span>
        <span>Hover</span>
        <span>Pressed</span>
        <span>Disabled</span>
        ${renderButtonBlockRow('No Icons', 'ds-button', kind, size, { showSubText: false, showLeftIcon: false, showRightIcon: false }, variant)}
        ${renderButtonBlockRow('Left Icon', 'ds-button', kind, size, { showSubText: false, showLeftIcon: true, showRightIcon: false }, variant)}
        ${renderButtonBlockRow('Right Icon', 'ds-button', kind, size, { showSubText: false, showLeftIcon: false, showRightIcon: true }, variant)}
        ${size === 'large' ? large : ''}
    </div>
    <hr style="width: 100%; border: 1px solid #ddd; margin: 20px 0;">
    `;
}

function renderIconButtonBlock(kind: string, size: DsIconButtonSizes, variant: string) {
    return `
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); grid-row-gap: 1em; grid-column-gap: 1em; align-items: center; justify-items: center; margin-bottom: 20px;">
        <div style="grid-column: span 5;"><strong>${variant} - ${size}</strong></div>
        <span style="justify-self: start;">Type</span>
        <span>Default</span>
        <span>Hover</span>
        <span>Pressed</span>
        <span>Disabled</span>
        ${renderButtonBlockRow('Icon Only', 'ds-icon-button', kind, size, { iconOnly: true }, variant)}
    </div>
    <hr style="width: 100%; border: 1px solid #ddd; margin: 20px 0;">
    `;
}

function renderSocialButtonBlock(socialApp: DsSocialButtonAppArray, variant: DsSocialButtonVariant, size: DsSocialButtonSize) {
    return `
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); grid-row-gap: 1em; grid-column-gap: 1em; align-items: center; justify-items: center; margin-bottom: 20px;">
        <div style="grid-column: span 5;"><strong>${variant} - ${size}</strong></div>
        <span style="justify-self: start;">Type</span>
        <span>Default</span>
        <span>Hover</span>
        <span>Pressed</span>
        <span>Disabled</span>
        ${renderButtonBlockRow('Left Icon', 'ds-social-button', variant, size, { showLeftIcon: true })}
    </div>
    <hr style="width: 100%; border: 1px solid #ddd; margin: 20px 0;">
    `;
}
function renderBonusButtonRow(label: string, size: string) {
    return `
    <span style="justify-self: start; white-space: nowrap">${label}</span>
    <div>
        <button ds-bonus-button size="${size}">
            Bonus <span slot="value">$00.00</span>
        </button>
    </div>
    <div class="pseudo-hover-all">
        <button ds-bonus-button size="${size}">
            Bonus <span slot="value">$00.00</span>
        </button>
    </div>
    <div class="pseudo-active-all">
        <button ds-bonus-button size="${size}">
            Bonus <span slot="value">$00.00</span>
        </button>
    </div>
    <div>
        <button ds-bonus-button [disabled]="true" size="${size}">
            Bonus <span slot="value">$00.00</span>
        </button>
    </div>
    `;
}

function renderBonusButton() {
    return `
    <div style="display: grid; grid-template-columns: auto auto auto auto auto; grid-template-rows: auto 1fr; grid-row-gap: 0.5em; grid-column-gap: 0.5em; align-items: center; justify-items: start; margin-bottom: 20px;">
        <div style="grid-column: span 5; justify-self: start;"><strong style="font-size: 2em;">Bonus Button</strong></div>
        <span style="justify-self: start; font-size: 1.5em;">Type</span>
        <span style="justify-self: start;">Default</span>
        <span style="justify-self: start;">Hover</span>
        <span style="justify-self: start;">Pressed</span>
        <span style="justify-self: start;">Disabled</span>
        ${renderBonusButtonRow('Bonus Button', 'default')}
    </div>
    <hr style="width: 100%; border: 1px solid #ddd; margin: 20px 0;">
    `;
}

function renderDefaultButtons() {
    let template = `<div style="height: 2em;"></div>`;
    DS_BUTTON_VARIANTS_ARRAY.forEach((variant: any) => {
        template += `<div style="justify-self: start; margin-top: 20px;"><strong style="font-size: 3em;">${variant}</strong></div>`;
        DS_BUTTON_KIND_ARRAY.forEach((kind: any) => {
            template += `<div style="justify-self: start;"><strong style="font-size: 1.5em;">${kind}</strong></div>`;
            if (variant in DS_BUTTON_NOT_SUPPORTED_CONFIG && DS_BUTTON_NOT_SUPPORTED_CONFIG[variant].includes(kind)) {
                template += `<div style="font-weight: bold; color: orange; margin-bottom: 20px;">This configuration is not support: variant: ${variant} - kind: ${kind}</div>`;
            } else {
                DS_BUTTON_SIZES_ARRAY.forEach((size) => {
                    template += renderButtonBlock(kind, size, variant);
                });
            }
        });
        template += `<hr style="width: 100%; border: 1px solid #ddd; margin: 20px 0;">`;
    });
    return template;
}

function renderIconButtons() {
    let template = `<div style="height: 2em;"></div>`;
    DS_ICON_BUTTON_KIND_ARRAY.forEach((kind: any) => {
        template += `<div style="justify-self: start; margin-top: 20px;"><strong style="font-size: 2em;">${kind}</strong></div>`;
        DS_BUTTON_VARIANTS_ARRAY.forEach((variant: any) => {
            DS_ICON_BUTTON_SIZES_ARRAY.forEach((size: any) => {
                template += renderIconButtonBlock(kind, size, variant);
            });
        });
        template += `<hr style="width: 100%; border: 1px solid #ddd; margin: 20px 0;">`;
    });
    return template;
}

function renderSocialButtons() {
    let template = `<div style="height: 2em;"></div>`;
    DS_SOCIAL_BUTTON_APP_ARRAY.forEach((app: any) => {
        template += `<div style="justify-self: start; margin-top: 20px;"><strong style="font-size: 3em;">${app}</strong></div>`;
        DS_SOCIAL_BUTTON_VARIANT_ARRAY.forEach((variant: any) => {
            template += `<div style="justify-self: start;"><strong style="font-size: 1.5em;">${variant}</strong></div>`;
            DS_SOCIAL_BUTTON_SIZES_ARRAY.forEach((size: DsSocialButtonSize) => {
                template += renderSocialButtonBlock(app, variant, size);
            });
        });
        template += `<hr style="width: 100%; border: 1px solid #ddd; margin: 20px 0;">`;
    });
    return template;
}

export const Default: Story = {
    tags: ['docs-template'],
    parameters: {
        chromatic: {
            modes: allThemes,
            disableSnapshot: false,
        },
    },
    argTypes: {},
    render: () => ({
        template: `
          <style>
                html {
                    scroll-behavior: smooth;
                }
                .navigation-button {
                    background: rgba(117, 108, 140, 0.1);
                    color: #432688;
                    border: none;
                    border-radius: 8px;
                    padding: 5px 10px;
                    font-size: 15px;
                    cursor: pointer;
                    transition: background-color 0.3s, color 0.3s, border 0.3s;
                }
                .navigation-button:hover {
                    background-color: rgba(117, 108, 140, 0.2);
                }
            </style>
            <div style="display: flex; flex-direction: column; gap:20px;">
                <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                    <button class="navigation-button" onclick="document.getElementById('default-buttons').scrollIntoView()">Default Buttons</button>
                    <button class="navigation-button" onclick="document.getElementById('icon-buttons').scrollIntoView()">Icon Buttons</button>
                    <button class="navigation-button" onclick="document.getElementById('social-buttons').scrollIntoView()">Social Buttons</button>
                    <button class="navigation-button" onclick="document.getElementById('bonus-buttons').scrollIntoView()">Bonus Button</button>
                </div>

                <div id="default-buttons">
                    <ds-storybook-button-variants/>
                </div>
                
                <div id="icon-buttons">
                    <div style="height: 2em;"></div>
                    <div style="justify-self: start;"><strong style="font-size: 3em;">Icon Button</strong></div>
                    ${renderIconButtons()}
                </div>
                
                <div id="social-buttons">
                    <div style="height: 2em;"></div>
                    <div style="justify-self: start;"><strong style="font-size: 3em;">Social Button</strong></div>
                    ${renderSocialButtons()}
                </div>

                <div id="bonus-buttons">
                    <div style="height: 2em;"></div>
                    ${renderBonusButton()}
                </div>
            </div>
        `,
    }),
};
