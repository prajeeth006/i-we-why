import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DemoIconComponent, DemoImage, DemoSuccessComponent, DsEntityLogoDemo } from '@design-system/storybook-demo-cmp-lib';
import { DsAlert } from '@frontend/ui/alert';
import { DsArrow } from '@frontend/ui/arrow';
import { DsBadge } from '@frontend/ui/badge';
import { DsButton } from '@frontend/ui/button';
import { DsCard } from '@frontend/ui/card';
import { DsCardExpandable } from '@frontend/ui/card-expandable';
import { DsCardHeader } from '@frontend/ui/card-header';
import { DsCheckbox } from '@frontend/ui/checkbox';
import { DsDivider } from '@frontend/ui/divider';
import { DsHelpGroup, DsHelpItem } from '@frontend/ui/help-group';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DsInputDirective, DsInputField } from '@frontend/ui/input-field';
import { DsListItem } from '@frontend/ui/list-item';
import { DsLoadingSpinner } from '@frontend/ui/loading-spinner';
import { DsNotificationBubble } from '@frontend/ui/notification-bubble';
import { DsPill } from '@frontend/ui/pill';
import { DsProgressBar } from '@frontend/ui/progress-bar';
import { DsRadioButton, DsRadioGroup } from '@frontend/ui/radio-button';
import { DsSearchBar } from '@frontend/ui/searchbar';
import { DsSegmentedControl, DsSegmentedOption } from '@frontend/ui/segmented-control';
import { DsSwitch } from '@frontend/ui/switch';
import { DsTabsModule } from '@frontend/ui/tabsgroup';
import { DsToast } from '@frontend/ui/toast';
import { DsTooltipModule } from '@frontend/ui/tooltip';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

@Component({
    selector: 'ds-demo-entity-logo',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    template: `
        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="56" height="56" rx="28" fill="#F3F4F5" />
            <path
                d="M28.0001 8.90909C29.1883 10.5841 33.8519 13.917 43.0001 13.917V25.7875C43.0001 29.9359 40.5929 40.1804 28.0005 47.2662C28.0002 47.2778 28.0007 47.2547 28.0005 47.2662C15.4074 40.1804 13.0001 29.9359 13.0001 25.8217V13.9511C22.1483 13.9511 26.8119 10.5841 28.0001 8.90909Z"
                fill="url(#paint0_linear_19318_23026)" />
            <path
                d="M28.0004 43.6984C17.814 37.2983 16.0676 28.8545 16.0676 25.8217V16.8954C21.5363 16.4452 25.5015 14.8238 28.0045 13.0607C30.5106 14.8148 34.4749 16.417 39.9326 16.8623V25.7875C39.9326 28.8552 38.1847 37.2993 28.0004 43.6984ZM28.7201 45.9874L28.7412 45.9498C29.0487 46.0072 29.3646 46.1077 29.6851 46.2627C29.6617 46.2775 29.6384 46.2922 29.6149 46.3069C29.3448 46.1785 29.0444 46.0651 28.7201 45.9874Z"
                stroke="url(#paint1_linear_19318_23026)"
                stroke-width="6.13505" />
            <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M28.0023 11.7265C30.3423 13.5934 34.6221 15.5412 41.0369 15.8761V25.7048L41.0403 25.7624C41.2363 29.0941 39.1209 38.1676 28.0002 44.8552C16.8767 38.168 14.7637 29.1256 14.9595 25.7965L14.9629 25.739V15.9098C21.3856 15.5713 25.6653 13.6013 28.0023 11.7265Z"
                fill="#DCDFE4" />
            <path
                d="M27.9996 44.855V11.7284C28.0004 11.7278 28.0012 11.7271 28.002 11.7265C30.342 13.5934 34.6218 15.5412 41.0366 15.8761V25.7048L41.04 25.7624C41.236 29.0941 39.1205 38.1676 27.9999 44.8552L27.9996 44.855Z"
                fill="#C3C4C7" />
            <path
                d="M27.9996 47.2662L27.9999 47.2663C28.2338 47.1347 28.4642 47.002 28.6912 46.8683L28.7253 46.8482C40.6854 39.7848 42.9995 29.8974 42.9995 25.7876V13.9171C35.401 13.9171 30.8964 11.6177 28.9075 9.87885C28.5019 9.52427 28.2009 9.19301 27.9996 8.9093V10.826C28.0001 10.8256 28.0005 10.8253 28.0009 10.8249C30.1574 12.7359 34.6169 14.9567 41.6909 15.2032V25.7876C41.6909 29.4942 39.5707 38.9513 27.9999 45.7567L27.9996 45.7565V47.2662Z"
                fill="#C3C4C7" />
            <path
                d="M27.9996 47.2662L27.9993 47.2663C27.7654 47.1347 27.535 47.002 27.3081 46.8683L27.2739 46.8482C15.3139 39.7848 12.9997 29.8974 12.9997 25.7876V13.9171C20.5983 13.9171 25.1028 11.6177 27.0918 9.87885C27.4974 9.52427 27.7984 9.19301 27.9996 8.9093V10.826C27.9992 10.8256 27.9988 10.8253 27.9983 10.8249C25.8418 12.7359 21.3824 14.9567 14.3084 15.2032V25.7876C14.3084 29.4942 16.4286 38.9513 27.9993 45.7567L27.9996 45.7565V47.2662Z"
                fill="#DCDFE4" />
            <defs>
                <linearGradient id="paint0_linear_19318_23026" x1="28.0001" y1="13.0576" x2="28.0001" y2="49.1391" gradientUnits="userSpaceOnUse">
                    <stop stop-color="#858585" />
                    <stop offset="0.250185" stop-color="white" />
                    <stop offset="0.550534" stop-color="#FCFCFC" />
                    <stop offset="1" stop-color="#757576" />
                </linearGradient>
                <linearGradient id="paint1_linear_19318_23026" x1="28.0001" y1="8.90909" x2="28.0001" y2="47.2696" gradientUnits="userSpaceOnUse">
                    <stop stop-color="white" />
                    <stop offset="0.355148" stop-color="white" />
                    <stop offset="1" stop-color="white" />
                </linearGradient>
            </defs>
        </svg>
    `,
})
export class EntityLogoDemo {}

@Component({
    selector: 'ds-demo-all-cmps',
    styleUrl: 'all-component.scss',
    template: `
        <div class="cmp-container">
            <ds-card>
                <div class="cmp-card">
                    <div class="flex-column gap-15">
                        <div class="space-between">
                            <button ds-button size="small" variant="filled">Small Filled</button>
                            <button ds-button size="small" kind="tertiary" variant="flat">Small Flat</button>
                            <button ds-button size="small" variant="outline">
                                <ds-demo-icon slot="start" />
                                Small Outline
                            </button>
                        </div>
                        <div class="space-between">
                            <button ds-button size="medium" variant="filled">Medium Filled</button>
                            <button ds-button size="medium" kind="tertiary" variant="flat">Medium Flat</button>
                            <button ds-button size="medium" variant="outline">Medium Outline</button>
                        </div>
                        <div class="space-between">
                            <button ds-button size="medium" variant="filled" kind="primary">Primary</button>
                            <button ds-button size="medium" variant="filled" kind="secondary">Secondary</button>
                            <button ds-button size="medium" variant="filled" kind="success">Success</button>
                            <button ds-button size="medium" variant="filled" kind="tertiary">Tertiary</button>
                            <button ds-button size="medium" variant="filled" kind="utility">Utility</button>
                        </div>
                        <div class="space-between">
                            <button ds-button size="large" variant="filled">
                                <ds-demo-icon slot="end" />
                                Large Filled
                            </button>
                            <button ds-button size="large" kind="tertiary" variant="flat">Large Flat</button>
                            <button ds-button size="large" variant="outline">
                                <ds-demo-icon slot="end" />
                                Large Outline
                            </button>
                        </div>
                        <div class="space-between">
                            <button ds-button size="large" variant="filled" kind="tertiary">
                                Button
                                <span slot="subtext">with subtext</span>
                            </button>

                            <button ds-button size="large" variant="filled" disabled>
                                <ds-demo-icon slot="start" />
                                Disabled
                            </button>

                            <button ds-button size="large" variant="filled" kind="success">
                                <ds-demo-icon slot="start" />
                                Icon + Subtext
                                <span slot="subtext">with subtext</span>
                            </button>
                        </div>
                        <div class="center">
                            <button ds-button size="large" variant="filled" loading>
                                <ds-demo-icon slot="start" />
                                Large Filled + Loading
                            </button>
                        </div>
                    </div>
                    <div class="title" (click)="navigateToComponent('button-button')">Buttons</div>
                </div>
            </ds-card>

            <ds-card>
                <div class="cmp-card">
                    <div class="center flex-column">
                        <ds-tabs-group size="large" scrollable class="w-300">
                            <ds-tab name="1" title="Tab1">
                                <div class="b-1 p-10">
                                    <ds-tabs-group size="large" scrollable inverse>
                                        <ds-tab name="1" title="Tab1">
                                            <div>Tab content 1</div>
                                        </ds-tab>
                                        <ds-tab name="2" title="Tab2" disabled="true">
                                            <div>Tab content 2</div>
                                        </ds-tab>
                                        <ds-tab name="3" title="Tab3">
                                            <div>Tab content 3</div>
                                        </ds-tab>
                                        <ds-tab name="4" title="Tab 4 long title text">
                                            <div>Tab content 4</div>
                                        </ds-tab>
                                        <ds-tab name="5" title="Tab5">
                                            <div>Tab content 5</div>
                                        </ds-tab>
                                        <ds-tab name="6" title="Tab6">
                                            <div>Tab content 6</div>
                                        </ds-tab>
                                    </ds-tabs-group>
                                </div>
                            </ds-tab>
                            <ds-tab name="2" title="Tab2" disabled="true">
                                <div>Tab content 2</div>
                            </ds-tab>
                            <ds-tab name="3" title="Tab3">
                                <div>Tab content 3</div>
                            </ds-tab>
                            <ds-tab name="4" title="Tab 4 long title text">
                                <div>Tab content 4</div>
                            </ds-tab>
                            <ds-tab name="5" title="Tab5">
                                <div>Tab content 5</div>
                            </ds-tab>
                            <ds-tab name="6" title="Tab6">
                                <div>Tab content 6</div>
                            </ds-tab>
                        </ds-tabs-group>

                        <br />

                        <br />
                        <ds-tabs-group size="large" variant="horizontal">
                            <ds-tab name="1">
                                <ng-container *dsTabHeader>
                                    Tab1
                                    <ds-notification-bubble variant="primary" size="large"> 0 </ds-notification-bubble>
                                </ng-container>
                                <div *dsTabContent>Tab content 1</div>
                            </ds-tab>
                            <ds-tab name="2" disabled="true">
                                <ng-container *dsTabHeader>
                                    Tab2
                                    <ds-notification-bubble variant="primary" size="large"> 0 </ds-notification-bubble>
                                </ng-container>
                                <div *dsTabContent>Tab content 2</div>
                            </ds-tab>
                            <ds-tab name="3">
                                <ng-container *dsTabHeader>
                                    Tab3
                                    <ds-notification-bubble variant="primary" size="large"> 0 </ds-notification-bubble>
                                </ng-container>
                                <div *dsTabContent>Tab content 3</div>
                            </ds-tab>
                            <ds-tab name="4">
                                <ng-container *dsTabHeader>
                                    Tab4
                                    <ds-notification-bubble variant="primary" size="large"> 0 </ds-notification-bubble>
                                </ng-container>
                                <div *dsTabContent>Tab content 4</div>
                            </ds-tab>
                        </ds-tabs-group>

                        <ds-tabs-group [scrollable]="true" class="w-400">
                            <ds-tab name="1">
                                <ng-container *dsTabHeader>
                                    <ds-demo-icon />
                                    <div class="example-title">
                                        Tab1
                                        <ds-notification-bubble variant="primary">0</ds-notification-bubble>
                                    </div>
                                </ng-container>
                                <div *dsTabContent>Tab content 1</div>
                            </ds-tab>
                            <ds-tab name="2" disabled="true">
                                <ng-container *dsTabHeader>
                                    <ds-demo-icon />
                                    <div class="example-title">
                                        Tab
                                        <ds-notification-bubble disabled="true">0</ds-notification-bubble>
                                    </div>
                                </ng-container>
                                <div *dsTabContent>Tab content 2</div>
                            </ds-tab>
                            <ds-tab name="3">
                                <ng-container *dsTabHeader>
                                    <ds-demo-icon />
                                    <div class="example-title">
                                        Tab3
                                        <ds-notification-bubble variant="primary">0</ds-notification-bubble>
                                    </div>
                                </ng-container>
                                <div *dsTabContent>Tab content 3</div>
                            </ds-tab>
                            <ds-tab name="4">
                                <ng-container *dsTabHeader>
                                    <ds-demo-icon />
                                    <div class="example-title">
                                        Tab 4 long title text
                                        <ds-notification-bubble variant="primary">0</ds-notification-bubble>
                                    </div>
                                </ng-container>
                                <div *dsTabContent>Tab content 4</div>
                            </ds-tab>
                            <ds-tab name="5">
                                <ng-container *dsTabHeader>
                                    <ds-demo-icon />
                                    <div class="example-title">
                                        Tab
                                        <ds-notification-bubble variant="primary">0</ds-notification-bubble>
                                    </div>
                                </ng-container>
                                <div *dsTabContent>Tab content 5</div>
                            </ds-tab>
                            <ds-tab name="6">
                                <ng-container *dsTabHeader>
                                    <ds-demo-icon />
                                    <div class="example-title">
                                        Tab 6
                                        <ds-notification-bubble variant="primary">3</ds-notification-bubble>
                                    </div>
                                </ng-container>
                                <div *dsTabContent>Tab content 6</div>
                            </ds-tab>
                        </ds-tabs-group>
                    </div>
                    <div class="title" (click)="navigateToComponent('tabsgroup')">Tabs</div>
                </div>
            </ds-card>

            <div>
                <ds-card>
                    <div class="cmp-card">
                        <div class="center">
                            <ds-card-expandable
                                class="w-450"
                                expanded="true"
                                title="Expandable card"
                                subtitle="With content"
                                elevated="true"
                                variant="surface-lowest"
                                headerVariant="surface-low">
                                <ds-badge slot="title" variant="primary" size="xsmall">COOL</ds-badge>
                                <ds-demo-icon iconName="chevron" class="transform-270 w-16" slot="title" />
                                <ds-demo-icon iconName="imageNfl" class="w-25 h-25 pr-10" slot="start" />
                                <button slot="end" ds-button variant="flat" kind="tertiary" size="small">
                                    Helper Button
                                    <ds-demo-icon slot="end" />
                                </button>
                                <ds-divider variant="on-surface-low" vertical slot="end" />
                                <div class="text-center p-10">
                                    <p>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                                        magna aliqua.
                                    </p>
                                    <button slot="button" ds-button variant="filled" kind="primary" size="large">
                                        Action Large Button
                                        <ds-demo-icon slot="start" />
                                    </button>
                                </div>
                            </ds-card-expandable>
                        </div>
                        <div class="title" (click)="navigateToComponent('expansion-panel')">Expandable Card</div>
                    </div>
                </ds-card>

                <ds-card class="mt-10">
                    <div class="cmp-card">
                        <div class="space-between">
                            <ds-checkbox [checked]="false" [indeterminate]="false" [disabled]="false" size="medium" label="Agree" />
                            <ds-checkbox [checked]="true" [disabled]="false" size="small" label="Small" />
                            <ds-checkbox [checked]="true" [disabled]="false" size="medium" label="Medium" />
                            <ds-checkbox [checked]="true" [disabled]="true" size="medium" label="Disabled" />
                            <ds-checkbox [disabled]="false" [indeterminate]="true" size="medium" />
                        </div>
                        <div class="title" (click)="navigateToComponent('checkbox')">Checkbox</div>
                    </div>
                </ds-card>
            </div>

            <div>
                <ds-card>
                    <div class="cmp-card">
                        <div class="center display-grid grid-4 flex-wrap g-20">
                            <ds-badge variant="primary" size="medium">Large</ds-badge>
                            <ds-badge variant="primary" size="xsmall">Small</ds-badge>
                            <ds-badge variant="primary-strong" size="medium">Strong</ds-badge>
                            <ds-badge variant="primary-subtle" size="medium">Subtle</ds-badge>
                            <ds-badge variant="green" size="medium"
                                >Green
                                <ds-demo-icon slot="start" />
                            </ds-badge>
                            <ds-badge variant="secondary" size="medium"
                                >Secondary
                                <ds-demo-icon iconName="success" slot="end" />
                            </ds-badge>
                            <ds-badge variant="blue" size="medium">Blue</ds-badge>
                            <ds-badge variant="red" size="medium">Red</ds-badge>
                            <ds-badge variant="neutral" size="medium">Neutral</ds-badge>
                            <ds-badge variant="purple" size="medium">Purple</ds-badge>
                            <ds-badge variant="yellow" size="medium">Yellow</ds-badge>
                            <ds-badge variant="orange" size="medium">Orange</ds-badge>
                        </div>
                        <div class="title" (click)="navigateToComponent('badge')">Badges</div>
                    </div>
                </ds-card>

                <ds-card class="mt-10">
                    <div class="cmp-card">
                        <div class="space-between">
                            <div class="w-250 h-50 display-flex align-center justify-center">
                                <ds-divider vertical="false" [inverse]="false" variant="on-surface-low" />
                            </div>

                            <div class="w-60 h-50 display-flex; justify-center">
                                <ds-divider vertical variant="on-surface-low" />
                            </div>
                        </div>
                        <div class="title" (click)="navigateToComponent('divider')">Divider</div>
                    </div>
                </ds-card>
                <ds-card class="mt-10">
                    <div class="cmp-card">
                        <div class="space-between flex-wrap g-10">
                            <ds-notification-bubble size="large" variant="primary"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="large" variant="primary"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="large" variant="utility"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="large" variant="utility"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="large" variant="live"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="large" variant="live"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="large" variant="neutral"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="large" variant="neutral"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="large" variant="live-dot" />
                            <ds-notification-bubble size="large" variant="live-dot" />

                            <ds-notification-bubble size="large" variant="utility-dot" />
                            <ds-notification-bubble size="large" variant="utility-dot" />

                            <ds-notification-bubble size="large" disabled="true"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="large" disabled="true"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="medium" variant="primary"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="medium" variant="primary"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="medium" variant="utility"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="medium" variant="utility"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="medium" variant="live"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="medium" variant="live"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="medium" variant="neutral"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="medium" variant="neutral"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="medium" variant="live-dot" />
                            <ds-notification-bubble size="medium" variant="live-dot" />

                            <ds-notification-bubble size="medium" variant="utility-dot" />
                            <ds-notification-bubble size="medium" variant="utility-dot" />

                            <ds-notification-bubble size="medium" disabled="true"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="medium" disabled="true"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="small" variant="primary"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="small" variant="primary"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="small" variant="utility"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="small" variant="utility"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="small" variant="live"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="small" variant="live"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="small" variant="neutral"> 0</ds-notification-bubble>
                            <ds-notification-bubble size="small" variant="neutral"> 888</ds-notification-bubble>

                            <ds-notification-bubble size="small" variant="live-dot" />
                        </div>
                        <div class="title" (click)="navigateToComponent('notification-bubble')">Notification Bubble</div>
                    </div>
                </ds-card>

                <ds-card class="mt-10">
                    <div class="cmp-card">
                        <div class="center">
                            <ds-loading-spinner />
                        </div>
                        <div class="title" (click)="navigateToComponent('loading-spinner')">Loading spinner</div>
                    </div>
                </ds-card>
            </div>

            <ds-card>
                <div class="cmp-card">
                    <div class="center flex-wrap g-10">
                        @if (alert1IsOpen) {
                            <ds-alert type="success" (closed)="alert1IsOpen = false">
                                <h3 slot="header" class="m-0">Some successful alert!</h3>
                                <ng-container slot="content"> And some great description too!</ng-container>
                                <ng-container slot="buttons">
                                    <button ds-button variant="filled" kind="utility" size="medium">Do nothing!</button>
                                </ng-container>
                            </ds-alert>
                        } @else {
                            <button ds-button (click)="alert1IsOpen = true">Show again</button>
                        }
                        @if (alert2IsOpen) {
                            <ds-alert type="caution" class="mt-10" (closed)="alert2IsOpen = false">
                                <h3 slot="header" class="m-0">Delete user?</h3>
                                <ng-container slot="content">
                                    Are you sure you want to delete the user? This action cannot be rolled back!
                                </ng-container>
                                <ng-container slot="buttons">
                                    <button ds-button variant="filled" kind="secondary" size="medium">Delete user!</button>
                                </ng-container>
                            </ds-alert>
                        } @else {
                            <button ds-button (click)="alert2IsOpen = true">Show again</button>
                        }
                        <ds-alert type="info" class="mt-10">
                            <h3 slot="header" class="m-0">Info type</h3>
                            <ng-container slot="content"> This is some very informative description! Can't be found anywhere else! </ng-container>
                        </ds-alert>
                        <ds-alert type="error" class="mt-10">
                            <h3 slot="header" class="m-0">Something is wrong</h3>
                            <ng-container slot="content"> You can't do anything! An error occured on the server! </ng-container>
                        </ds-alert>
                    </div>
                    <div class="title" (click)="navigateToComponent('alert')">Alert</div>
                </div>
            </ds-card>
            <ds-card>
                <div class="cmp-card">
                    <div class="center flex-wrap g-10">
                        <div class="display-flex g-5 flex-col">
                            <ds-list-item title="Football" [selected]="selectedItem === 0" (click)="selectedItem = 0" class="w-320 b-1 py-5 px-10">
                                <ds-demo-icon slot="start" />
                                <ds-notification-bubble variant="primary" size="large" [inverse]="false" slot="center"> 0 </ds-notification-bubble>
                            </ds-list-item>
                            <ds-list-item title="Tenis" [selected]="selectedItem === 1" (click)="selectedItem = 1" class="w-320 b-1 py-5 px-10">
                                <ds-demo-icon slot="start" />

                                <button slot="end" size="medium" variant="outline" ds-icon-button data-testId="disabledButton">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                            fill="#1A56DB" />
                                    </svg>
                                </button>
                            </ds-list-item>

                            <ds-list-item
                                title="Handball"
                                subtitle="Some cool description here"
                                [selected]="selectedItem === 3"
                                (click)="selectedItem = 3"
                                class="w-320 b-1 px-10 py-5">
                                <ds-demo-icon slot="start" />
                            </ds-list-item>
                            <ds-list-item
                                title="Voleyball"
                                subtext="Subtext is very small"
                                [selected]="selectedItem === 2"
                                (click)="selectedItem = 2"
                                class="w-320 b-1 px-10 py-5">
                                <ds-demo-icon slot="start" />
                                <ds-badge variant="primary" size="medium" slot="center">LABEL</ds-badge>
                            </ds-list-item>
                        </div>

                        <ds-list-item
                            title="Title"
                            subtitle="Optional subtitle goes here"
                            subtext="Optional subtext goes here"
                            [selected]="false"
                            class="w-340">
                            <span slot="start"><ds-demo-entity-logo /></span>
                            <ds-badge variant="primary" size="medium" slot="center">LABEL</ds-badge>
                            <ds-arrow slot="end" size="medium" direction="right" />
                        </ds-list-item>
                        <ds-list-item
                            title="Title"
                            subtitle="Optional subtitle goes here"
                            subtext="Optional subtext goes here"
                            [selected]="false"
                            class="w-340">
                            <span slot="start"><ds-demo-entity-logo /></span>
                            <ds-demo-icon slot="center" />
                            <ds-badge variant="primary" size="medium" slot="center">LABEL</ds-badge>
                            <ds-arrow slot="end" size="medium" direction="right" />
                        </ds-list-item>

                        <ds-list-item
                            title="Some other item"
                            subtitle="Optional subtitle goes here"
                            subtext="Optional subtext goes here"
                            [selected]="false"
                            class="w-340">
                            <span slot="start"><ds-demo-entity-logo /></span>
                            <ds-demo-icon slot="center" />
                            <ds-badge variant="primary" size="medium" slot="center">LABEL</ds-badge>
                            <ds-notification-bubble variant="primary" size="large" slot="center"> 0 </ds-notification-bubble>
                            <button slot="end" size="medium" variant="outline" ds-icon-button data-testId="disabledButton">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        fill-rule="evenodd"
                                        clip-rule="evenodd"
                                        d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                        fill="#1A56DB" />
                                </svg>
                            </button>
                        </ds-list-item>
                    </div>
                    <div class="title" (click)="navigateToComponent('list-item')">List item</div>
                </div>
            </ds-card>

            <div>
                <ds-card>
                    <div class="cmp-card">
                        <div class="display-flex flex-column">
                            <ds-segmented-control class="m-0-auto">
                                <ds-segmented-option name="A" title="Label1" />
                                <ds-segmented-option name="1" title="Label2" />
                                <ds-segmented-option name="2" title="CustomLabel">
                                    <ng-template #dsTemplate>
                                        <span class="center g-5 color1">
                                            CustomLabel
                                            <ds-notification-bubble variant="primary"> 0 </ds-notification-bubble>
                                        </span>
                                    </ng-template>
                                </ds-segmented-option>
                            </ds-segmented-control>

                            <br />

                            <ds-segmented-control class="m-0-auto">
                                <ds-segmented-option name="A">
                                    <ng-template #dsTemplate>
                                        <ds-demo-icon />
                                    </ng-template>
                                </ds-segmented-option>
                                <ds-segmented-option name="B">
                                    <ng-template #dsTemplate>
                                        <ds-demo-icon />
                                    </ng-template>
                                </ds-segmented-option>
                            </ds-segmented-control>

                            <br />

                            <ds-segmented-control [fullWidth]="true">
                                <ds-segmented-option name="A">
                                    <ng-template #dsTemplate>
                                        <ds-demo-icon />
                                    </ng-template>
                                </ds-segmented-option>
                                <ds-segmented-option name="B">
                                    <ng-template #dsTemplate>
                                        <ds-demo-icon />
                                    </ng-template>
                                </ds-segmented-option>
                                <ds-segmented-option name="C">
                                    <ng-template #dsTemplate>
                                        <ds-demo-icon />
                                    </ng-template>
                                </ds-segmented-option>
                            </ds-segmented-control>
                        </div>
                        <div class="title" (click)="navigateToComponent('segmented-control')">Segmented Controls</div>
                    </div>
                </ds-card>

                <ds-card class="mt-10">
                    <div class="cmp-card">
                        <div class="space-between">
                            <ds-arrow size="small" direction="left" />
                            <ds-arrow size="small" direction="right" />
                            <ds-arrow size="medium" direction="left" />
                            <ds-arrow size="medium" direction="right" />
                            <ds-arrow size="large" direction="left" />
                            <ds-arrow size="large" direction="right" />
                        </div>
                        <div class="title" (click)="navigateToComponent('arrow')">Arrows</div>
                    </div>
                </ds-card>
            </div>

            <ds-card>
                <div class="cmp-card">
                    <div class="center flex-wrap g-10">
                        <button ds-pill size="medium">Medium</button>
                        <button ds-pill size="small">Small</button>
                        <button ds-pill size="medium" selected>Selected</button>
                        <button ds-pill size="medium" inverse>Inverse</button>
                        <button ds-pill size="medium">Disabled</button>
                        <button ds-pill size="medium">
                            <ds-demo-icon slot="start" />
                            Icon start
                        </button>

                        <button ds-pill size="medium">
                            Icon end
                            <ds-demo-icon slot="end" />
                        </button>
                        <button ds-pill size="medium">
                            <ds-demo-icon slot="start" />
                            Icons on both sides
                            <ds-demo-icon slot="end" />
                        </button>
                        <button ds-pill size="medium">
                            <ds-demo-icon slot="start" />
                            With badge
                            <ds-badge variant="primary" slot="end">LABEL</ds-badge>
                        </button>
                        <button ds-pill size="medium">
                            <ds-notification-bubble variant="primary" slot="start">0</ds-notification-bubble>
                            With notification bubble + badge
                            <ds-badge variant="primary" slot="end">LABEL</ds-badge>
                        </button>
                    </div>
                    <div class="title" (click)="navigateToComponent('pill')">Pills</div>
                </div>
            </ds-card>

            <div>
                <ds-card>
                    <div class="cmp-card">
                        <div class="center flex-column">
                            <ds-radio-group [(value)]="selectedRadioValue">
                                <ds-radio-button value="1" name="options">Option 1 {{ selectedRadioValue === '1' ? '✔' : '' }}</ds-radio-button>
                                <ds-radio-button value="2" name="options">Option 2 {{ selectedRadioValue === '2' ? '✔' : '' }}</ds-radio-button>
                                <ds-radio-button value="3" name="options" [disabled]="true">Disabled</ds-radio-button>
                            </ds-radio-group>
                        </div>
                        <div class="title" (click)="navigateToComponent('radio-button')">Radio Buttons</div>
                    </div>
                </ds-card>
                <ds-card class="mt-10">
                    <div class="cmp-card">
                        <div class="space-between">
                            <ds-switch [checked]="true">
                                <span slot="labelOff">Off</span>
                                <span slot="labelOn">On</span>
                            </ds-switch>

                            <ds-switch [checked]="true" disabled>
                                <span slot="labelOn">Disabled</span>
                            </ds-switch>
                        </div>
                        <div class="title" (click)="navigateToComponent('switch')">Switch</div>
                    </div>
                </ds-card>
            </div>

            <div>
                <ds-card>
                    <div class="cmp-card">
                        <div class="flex-column gap-15">
                            <ds-card>
                                <div class="display-flex">
                                    @for (numb of [1, 2, 3, 4, 5]; track numb) {
                                        <div class="w-50 h-50 m-10 background1 b-radius-5"></div>
                                    }
                                </div>
                                <span class="p-10 text-center">Card</span>
                            </ds-card>
                        </div>
                        <div class="title" (click)="navigateToComponent('card-card')">Cards</div>
                    </div>
                </ds-card>
            </div>

            <ds-card>
                <div class="cmp-card">
                    <div class="center flex-col g-10">
                        <ds-toast>
                            <ds-demo-icon slot="statusIcon" />
                            Feedback description
                            <button ds-button slot="action" variant="outline" size="small">Online Button</button>
                            <ds-demo-icon slot="close" />
                        </ds-toast>
                        <ds-toast>
                            <ds-demo-icon slot="statusIcon" />
                            Feedback description
                            <ds-demo-icon slot="close" />
                        </ds-toast>
                        <ds-toast>
                            <ds-demo-icon slot="statusIcon" />
                            Feedback description
                            <button ds-button slot="action" variant="outline" size="small">Online Button</button>
                        </ds-toast>
                        <ds-toast>
                            <ds-demo-icon slot="statusIcon" />
                            Feedback description
                        </ds-toast>
                    </div>
                    <div class="title" (click)="navigateToComponent('toast')">Toasts</div>
                </div>
            </ds-card>

            <ds-card>
                <div class="cmp-card">
                    <div class="center flex-column">
                        <button
                            ds-button
                            class="ds-trigger-button"
                            #tooltipBtn
                            [dsTooltipTriggerFor]="tooltipTemplate"
                            position="bottom"
                            arrowPosition="middle">
                            Open Tooltip
                        </button>

                        <ng-template #tooltipTemplate>
                            <ds-tooltip-content>
                                <ds-entity-logo-demo slot="close">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M8.001 8.94399L13.0591 14.0023L14.0019 13.0594L8.94379 8.00117L14.0019 2.9429L13.0591 2.00008L8.001 7.05835L2.9428 2L2 2.94282L7.0582 8.00117L2 13.0595L2.9428 14.0023L8.001 8.94399Z"
                                            fill="#0068B3" />
                                    </svg>
                                </ds-entity-logo-demo>
                                <div slot="title">Tooltip title</div>
                                <div>
                                    You will not be able to use this restricted amount as the bonus is still restricted due to unsettled Sports bets
                                    or unfinished Casino game where the bonus money was used.
                                </div>
                                <button ds-button variant="flat" kind="utility" size="small" class="ml-auto">Action</button>
                            </ds-tooltip-content>
                        </ng-template>
                    </div>
                    <div class="title" (click)="navigateToComponent('tooltip')">Tooltip</div>
                </div>
            </ds-card>
            <div>
                <ds-card>
                    <div class="cmp-card">
                        <div class="center flex-column">
                            <ds-search-bar size="small">
                                <ng-template #searchIcon>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M7.81578 14.5895C11.5568 14.5895 14.5895 11.5568 14.5895 7.81578C14.5895 4.07478 11.5568 1.0421 7.81578 1.0421C4.07478 1.0421 1.0421 4.07478 1.0421 7.81578C1.0421 11.5568 4.07478 14.5895 7.81578 14.5895ZM7.81578 15.6316C12.1323 15.6316 15.6316 12.1323 15.6316 7.81578C15.6316 3.49924 12.1323 0 7.81578 0C3.49924 0 0 3.49924 0 7.81578C0 12.1323 3.49924 15.6316 7.81578 15.6316Z"
                                            fill="currentColor" />
                                        <path
                                            fill-rule="evenodd"
                                            clip-rule="evenodd"
                                            d="M15.2632 16L12.6579 13.3948L13.3948 12.6579L16 15.2632L15.2632 16Z"
                                            fill="currentColor" />
                                    </svg>
                                </ng-template>
                                <input dsSearchInput data-testid="ds-search-input" placeholder="Search" />
                            </ds-search-bar>
                        </div>
                        <div class="title" (click)="navigateToComponent('searchbar')">Search</div>
                    </div>
                </ds-card>
                <ds-card class="mt-10">
                    <div class="cmp-card">
                        <div class="center flex-column">
                            <ds-progress-bar [value]="50" fill="solid" showCounter="false" inverse="false" variant="primary" />
                            <ds-progress-bar [value]="50" fill="solid" showCounter="true" inverse="false" variant="primary" class="mt-10" />
                            <ds-progress-bar [value]="50" fill="pattern" showCounter="true" inverse="false" variant="primary" class="mt-10" />
                        </div>
                        <div class="title" (click)="navigateToComponent('progress-bar')">Progress Bar</div>
                    </div>
                </ds-card>
            </div>
            <ds-card>
                <div class="cmp-card">
                    <div class="center flex-column">
                        <form [formGroup]="form">
                            <ds-input-field labelText="user name">
                                <input dsInput type="text" formControlName="userName" placeholder="enter user name" />
                                <ds-demo-icon slot="start" />
                                <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                                    <ds-demo-icon iconName="close" />
                                </button>
                                <ds-help-group slot="bottom">
                                    <span slot="header">Header</span>
                                    <ds-help-item slot="item" type="success">
                                        <div slot="text">Success supporting text</div>
                                    </ds-help-item>

                                    <ds-help-item slot="item" type="error">
                                        <div slot="text">Error supporting text</div>
                                    </ds-help-item>
                                    <ds-help-item slot="item" type="caution">
                                        <div slot="text">Caution supporting text</div>
                                    </ds-help-item>
                                    <ds-help-item slot="item" type="info">
                                        <div slot="text">Info supporting text</div>
                                    </ds-help-item>
                                </ds-help-group>
                            </ds-input-field>
                            <ds-input-field labelText="Amount" isRightAligned="true" class="stake-field-input">
                                <input dsInput type="text" formControlName="userName" placeholder="$" />
                                <ds-help-item slot="bottom" type="success" isRightAligned="true">
                                    <div slot="text">Stake Field text</div>
                                </ds-help-item>
                            </ds-input-field>
                        </form>
                    </div>
                    <div class="title" (click)="navigateToComponent('help-group')">Help group</div>
                </div>
            </ds-card>
            <ds-card>
                <div class="cmp-card">
                    <div class="center flex-column">
                        <form [formGroup]="form">
                            <ds-input-field size="small" [floatingLabel]="true" labelText="Label">
                                <input
                                    dsInput
                                    placeholder="Placeholder"
                                    type="text"
                                    name="username-id1"
                                    autocomplete="username"
                                    formControlName="userName" />
                                <ds-demo-icon slot="start" />
                                <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                                    <ds-demo-icon iconName="close" />
                                </button>
                            </ds-input-field>
                        </form>
                    </div>
                    <div class="title" (click)="navigateToComponent('input-fields')">Input Field</div>
                </div>
            </ds-card>
            <ds-card>
                <div class="cmp-card">
                    <div class="center flex-column">
                        <form [formGroup]="form">
                            <ds-input-field size="small" [floatingLabel]="true" labelText="Label">
                                <textarea
                                    dsInput
                                    placeholder="Placeholder"
                                    type="text"
                                    name="username-id1"
                                    autocomplete="username"
                                    formControlName="userName"></textarea>
                                <ds-demo-icon slot="start" />
                                <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                                    <ds-demo-icon iconName="close" />
                                </button>
                            </ds-input-field>
                        </form>
                    </div>
                    <div class="title" (click)="navigateToComponent('input-fields')">Text Area</div>
                </div>
            </ds-card>
        </div>
    `,
    styles: `
        .cmp-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            grid-template-rows: minmax(180px, auto);
            gap: 10px;
        }

        .cmp-card {
            display: grid;
            grid-template-columns: 1fr;
            grid-template-rows: minmax(40px, auto) auto;
            padding: 15px;

            .ds-loading-spinner {
                position: relative;
            }
        }

        .space-between {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .center {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .flex-column {
            display: flex;
            flex-direction: column;
        }

        .gap-15 {
            gap: 15px;
        }

        .title {
            /*display: flex;*/
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            font-weight: 600;
            margin-top: 15px;
            margin-bottom: 15px;
            color: black;
            cursor: pointer;
        }

        .title:hover {
            text-decoration: underline;
        }

        .example-title {
            display: flex;
            gap: 5px;
            justify-content: center;
            align-items: center;
        }
        stake-field-input {
            width: 100px;
            margin-top: 10px;
        }
    `,
    standalone: true,
    imports: [
        DsCard,
        DsCardExpandable,
        DsCardHeader,
        DsButton,
        DsDivider,
        DsIconButton,
        DemoIconComponent,
        DsBadge,
        DemoImage,
        DsSegmentedControl,
        DsSegmentedOption,
        DsDivider,
        DemoSuccessComponent,
        DsAlert,
        DsArrow,
        DsCheckbox,
        DsListItem,
        EntityLogoDemo,
        DsNotificationBubble,
        DsLoadingSpinner,
        DsPill,
        DsRadioGroup,
        DsRadioButton,
        DsSwitch,
        DsTabsModule,
        DsToast,
        DsTooltipModule,
        DsEntityLogoDemo,
        DsSearchBar,
        DsHelpGroup,
        DsInputField,
        DsHelpItem,
        FormsModule,
        ReactiveFormsModule,
        DsInputDirective,
        DsProgressBar,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AllComponents {
    alert1IsOpen = true;
    alert2IsOpen = true;

    selectedItem = 1;
    selectedRadioValue = '1';
    form = new FormGroup({
        userName: new FormControl(''),
    });

    navigateToComponent(component?: string) {
        const baseUrl = window.location.origin;
        window.open(`${baseUrl}/?path=/story/components-${component}--overview`);
    }
}

const meta: Meta<any> = {
    title: 'All Components',
    decorators: [moduleMetadata({ imports: [AllComponents] })],
    excludeStories: /.*Data$/,
};

export default meta;
type Story = StoryObj<any>;

export const Default: Story = {
    tags: ['docs-template'],
    render: () => ({
        template: ` <ds-demo-all-cmps /> `,
    }),
};
