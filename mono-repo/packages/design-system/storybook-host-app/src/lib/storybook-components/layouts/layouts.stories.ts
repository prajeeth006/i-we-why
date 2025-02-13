import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { DemoIconComponent, DsEntityLogoDemo } from '@design-system/storybook-demo-cmp-lib';
import { DsAccordionModule } from '@frontend/ui/accordion';
import { DsAlert } from '@frontend/ui/alert';
import { DsArrow } from '@frontend/ui/arrow';
import { DsBadge } from '@frontend/ui/badge';
import { DsButton } from '@frontend/ui/button';
import { DsCard } from '@frontend/ui/card';
import { DsCheckbox } from '@frontend/ui/checkbox';
import { DsDivider } from '@frontend/ui/divider';
import { DsHelpGroup, DsHelpItem } from '@frontend/ui/help-group';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DsInputDirective, DsInputField } from '@frontend/ui/input-field';
import { DsListItem } from '@frontend/ui/list-item';
import { DsLoadingSpinner } from '@frontend/ui/loading-spinner';
import { DsModal, DsModalContent, DsModalHeader } from '@frontend/ui/modal';
import { DsNotificationBubble } from '@frontend/ui/notification-bubble';
import { DsPill } from '@frontend/ui/pill';
import { DsRadioButton, DsRadioGroup, FormsModule } from '@frontend/ui/radio-button';
import { DsScrollbar } from '@frontend/ui/scrollbar';
import { DsSearchBar } from '@frontend/ui/searchbar';
import { DsSegmentedControl, DsSegmentedOption } from '@frontend/ui/segmented-control';
import { DsSocialButton } from '@frontend/ui/social-button';
import { DsSwitch } from '@frontend/ui/switch';
import { DsTabsModule } from '@frontend/ui/tabsgroup';
import { DsToast } from '@frontend/ui/toast';
import { DsTooltipModule } from '@frontend/ui/tooltip';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

@Component({
    selector: 'ds-layout-cmps',
    styleUrl: 'layouts.scss',
    template: ` <ng-content /> `,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutsComp {}
type DsLayoutsStoryType = LayoutsComp;

const meta: Meta<DsLayoutsStoryType> = {
    title: 'Layouts/Misc',
    decorators: [
        moduleMetadata({
            imports: [
                DemoIconComponent,
                DsAccordionModule,
                DsAlert,
                DsArrow,
                DsBadge,
                DsButton,
                DsCard,
                DsCheckbox,
                DsDivider,
                DsEntityLogoDemo,
                DsHelpGroup,
                DsHelpItem,
                DsIconButton,
                DsInputDirective,
                DsInputField,
                DsListItem,
                DsLoadingSpinner,
                DsModal,
                DsModalContent,
                DsModalHeader,
                DsNotificationBubble,
                DsPill,
                DsRadioButton,
                DsRadioGroup,
                DsScrollbar,
                DsSearchBar,
                DsSegmentedControl,
                DsSegmentedOption,
                DsSocialButton,
                DsSwitch,
                DsTabsModule,
                DsToast,
                DsTooltipModule,
                FormsModule,
                LayoutsComp,
                ReactiveFormsModule,
            ],
        }),
    ],
    excludeStories: /.*Data$/,
};

export default meta;
type Story = StoryObj<DsLayoutsStoryType>;

export const Default: Story = {
    tags: ['docs-template'],
    render: () => ({
        template: `
          <ds-layout-cmps>
            <ds-modal class="ds-modal-demo-layout">
              <ds-modal-header variant="surface">
                <div slot="center">
                  <div slot="title">Sports</div>
                </div>
                <button slot="end" ds-button variant="outline" type="secondary" size="medium">
                  Close
                </button>
              </ds-modal-header>
              <ds-scrollbar>
                <ds-modal-content class="ds-modal-content-demo-layout">
                  <ds-card noOverflow class="mb-lg" elevated="false">
                    <ds-accordion variant="surface-high" open="open">
                      <ds-accordion-header>
                        <div slot="start">
                          <div slot="title">Popular</div>
                        </div>
                        <div slot="end">
                          <button ds-button size="small" variant="flat" kind="utility">See All
                          </button>
                        </div>
                      </ds-accordion-header>
                      <ds-accordion-content>
                        <div>
                          <ds-list-item title="NFL">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <ds-badge variant="red-strong" size="medium">Live</ds-badge>
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="MLB">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="College Baseball">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="World Baseball Classic">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                        </div>
                      </ds-accordion-content>
                    </ds-accordion>
                  </ds-card>
                  <ds-card noOverflow class="mb-lg" elevated="false">
                    <ds-accordion variant="surface-high" open="open">
                      <ds-accordion-header>
                        <div slot="start">
                          <div slot="title">Aussie Rules</div>
                        </div>
                      </ds-accordion-header>
                      <ds-accordion-content>
                        <div>
                          <ds-list-item title="AFL">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                        </div>
                      </ds-accordion-content>
                    </ds-accordion>
                  </ds-card>
                  <ds-card noOverflow class="mb-lg" elevated="false">
                    <ds-accordion variant="surface-high" open="open">
                      <ds-accordion-header>
                        <div slot="start">
                          <div slot="title">Baseball</div>
                        </div>
                      </ds-accordion-header>
                      <ds-accordion-content>
                        <div>
                          <ds-list-item title="MMA">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <ds-badge variant="red-strong" size="medium">Live</ds-badge>
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="MLB">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="Soccer">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="Tennis">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                        </div>
                      </ds-accordion-content>
                    </ds-accordion>
                  </ds-card>
                </ds-modal-content>
              </ds-scrollbar>
            </ds-modal>
          </ds-layout-cmps>
        `,
    }),
};

export const Search: Story = {
    tags: ['docs-template'],
    render: () => ({
        template: `
          <ds-layout-cmps>
            <ds-modal class="ds-modal-demo-layout">
              <ds-scrollbar>
                <ds-modal-content class="ds-modal-content-demo-layout">
                  <div class="ds-search-container mb-lg">
                    <ds-search-bar size="small" class="w-100">
                      <ng-template #searchIcon>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M7.81578 14.5895C11.5568 14.5895 14.5895 11.5568 14.5895 7.81578C14.5895 4.07478 11.5568 1.0421 7.81578 1.0421C4.07478 1.0421 1.0421 4.07478 1.0421 7.81578C1.0421 11.5568 4.07478 14.5895 7.81578 14.5895ZM7.81578 15.6316C12.1323 15.6316 15.6316 12.1323 15.6316 7.81578C15.6316 3.49924 12.1323 0 7.81578 0C3.49924 0 0 3.49924 0 7.81578C0 12.1323 3.49924 15.6316 7.81578 15.6316Z"
                            fill="currentColor" />
                          <path fill-rule="evenodd" clip-rule="evenodd"
                            d="M15.2632 16L12.6579 13.3948L13.3948 12.6579L16 15.2632L15.2632 16Z" fill="currentColor" />
                        </svg>
                      </ng-template>
                      <input dsSearchInput data-testid="ds-search-input" placeholder="Search" />
                    </ds-search-bar>
                    <button ds-button variant="flat" kind="utility" size="medium">
                      Cancel
                    </button>
                  </div>
                  <ds-card noOverflow noBorder class="mb-lg">
                    <ds-accordion variant="surface-high" open="open">
                      <ds-accordion-header>
                        <div slot="start">
                          <div slot="title">Recent Searches</div>
                        </div>
                        <div slot="end">
                          <button ds-button size="small" variant="flat" kind="utility">Clear All
                          </button>
                        </div>
                      </ds-accordion-header>
                      <ds-accordion-content>
                        <div>
                          <ds-list-item title="List Item" subtitle="Subtext">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="List Item" subtitle="Subtext">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="List Item" subtitle="Subtext">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="List Item" subtitle="Subtext">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="List Item" subtitle="Subtext">
                            <span slot="start">
                              <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                            </span>
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                        </div>
                      </ds-accordion-content>
                    </ds-accordion>
                  </ds-card>
                  <ds-card noBorder noOverflow class="mb-lg">
                    <ds-accordion variant="surface-high" open="open">
                      <ds-accordion-header>
                        <div slot="start">
                          <div slot="title">Popular Searches</div>
                        </div>
                        <div slot="end">
                          <button ds-button size="small" variant="flat" kind="utility">Clear All
                          </button>
                        </div>
                      </ds-accordion-header>
                      <ds-accordion-content>
                        <div>
                          <ds-list-item title="NASCAR Cup Series">
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="US Open - Men">
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="US Open Cup">
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="US Open">
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                          <ds-divider />
                          <ds-list-item title="Emma Navarro (USA)">
                            <ng-container slot="end">
                              <button ds-icon-button size="medium" variant="flat" kind="utility">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                                    fill="#1A56DB" />
                                </svg>
                              </button>
                            </ng-container>
                          </ds-list-item>
                        </div>
                      </ds-accordion-content>
                    </ds-accordion>
                  </ds-card>
                </ds-modal-content>
              </ds-scrollbar>
            </ds-modal>
          </ds-layout-cmps>
`,
    }),
};

export const BetSlip: Story = {
    tags: ['docs-template'],
    render: () => ({
        template: `
          <ds-layout-cmps>
            <ds-modal class="ds-modal-demo-layout">
              <ds-modal-header variant="surface">
                <div slot="center">
                  <div slot="title">Betslip</div>
                </div>
                <button slot="end" ds-button variant="outline" type="secondary" size="medium">
                  Close
                </button>
              </ds-modal-header>
              <ds-scrollbar>
                <ds-modal-content class="ds-modal-content-demo-layout bg-surface-base">
                  <ds-alert type="info">
                    <span slot="header">Your betslip is empty</span>
                    No bets selected! Please browse our sportsbook and select by tapping on the odds.
                    <button ds-icon-button variant="flat" kind="tertiary" size="small" slot="closeIcon">
                      <svg xmlns="http://www.w3.org/2000/svg" height="16" viewBox="0 0 24 24" width="16">
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" fill="currentColor" stroke-width="2" />
                      </svg>
                    </button>
                  </ds-alert>
                  <div>
                    <ds-list-item title="Live">
                      <span slot="start">
                        <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                      </span>
                      <ng-container slot="end">
                        <ds-notification-bubble type="neutral" size="medium">40</ds-notification-bubble>
                        <button ds-icon-button size="medium" variant="flat" kind="utility">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                              fill="#1A56DB" />
                          </svg>
                        </button>
                      </ng-container>
                    </ds-list-item>
                    <ds-divider />
                    <ds-list-item title="Today">
                      <span slot="start">
                        <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                      </span>
                      <ng-container slot="end">
                        <ds-notification-bubble type="neutral" size="medium">235</ds-notification-bubble>
                        <button ds-icon-button size="medium" variant="flat" kind="utility">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                              fill="#1A56DB" />
                          </svg>
                        </button>
                      </ng-container>
                    </ds-list-item>
                    <ds-divider />
                    <ds-list-item title="A-Z Menu">
                      <span slot="start">
                        <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                      </span>
                      <ng-container slot="end">
                        <ds-notification-bubble type="neutral" size="medium">789</ds-notification-bubble>
                        <button ds-icon-button size="medium" variant="flat" kind="utility">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                              fill="#1A56DB" />
                          </svg>
                        </button>
                      </ng-container>
                    </ds-list-item>
                    <ds-divider />
                    <ds-list-item title="Home">
                      <span slot="start">
                        <ds-entity-logo-demo width="24" height="24">${svgDataArray[0]}</ds-entity-logo-demo>
                      </span>
                      <ng-container slot="end">
                        <ds-notification-bubble type="neutral" size="medium">789</ds-notification-bubble>
                        <button ds-icon-button size="medium" variant="flat" kind="utility">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                              d="M11.1459 8.25648L5.14591 14.4634L4.18726 13.5367L9.72363 7.8094L4.20352 2.47963L5.12964 1.52043L11.1296 7.31353C11.2569 7.43639 11.3301 7.60478 11.3331 7.78164C11.3362 7.95849 11.2688 8.12931 11.1459 8.25648Z"
                              fill="#1A56DB" />
                          </svg>
                        </button>
                      </ng-container>
                    </ds-list-item>
                  </div>
                </ds-modal-content>
              </ds-scrollbar>
            </ds-modal>
          </ds-layout-cmps>
      `,
    }),
};

export const Login: Story = {
    tags: ['docs-template'],
    render: () => ({
        props: {
            form: new FormBuilder().group({
                username1: ['', [Validators.nullValidator, Validators.minLength(6)]],
                username2: ['', [Validators.nullValidator, Validators.minLength(6)]],
            }),
        },
        template: `
        <ds-layout-cmps>
            <ds-modal class="ds-modal-demo-layout">
                <ds-modal-header variant="surface">
                    <button slot="end" ds-button variant="outline" type="secondary" size="medium">
                        Close
                    </button>
                </ds-modal-header>
                <ds-modal-content  class="ds-modal-content-demo-layout bg-surface-base">
                    <div class="login-wrapper">
                        <div style="display:flex; justify-content:center;flex-wrap: wrap;">
                            <form style="align-content:center;" class="mb-lg w-100" [formGroup]="form">
                                <ds-input-field labelText="Email or User ID" class="mb-lg">
                                    <input dsInput placeholder="user@example.com" type="text" name="username-id1"
                                        autocomplete="username" formControlName="username1" />
                                    <ds-demo-icon slot="start"></ds-demo-icon>
                                    <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                                        <ds-demo-icon iconName='close'></ds-demo-icon>
                                    </button>
                                    <div slot="bottom">
                                        @if (form.get('username1').invalid && form.get('username1').touched) {
                                        <ds-help-item type="error" slot="item">
                                            <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                                            <div slot="text">Your username must be at least 10 characters long.</div>
                                        </ds-help-item>
                                        } @else if (form.get('username1').valid && form.get('username1').dirty) {
                                        <ds-help-item type="success" slot="item">
                                            <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                                            <div slot="text">WOW!</div>
                                        </ds-help-item>
                                        }
                                    </div>
                                </ds-input-field>
                                <ds-input-field labelText="Password">
                                    <input dsInput placeholder="Placeholder" type="text" name="username-id1"
                                        autocomplete="username" formControlName="username2" />
                                    <ds-demo-icon slot="start"></ds-demo-icon>
                                    <button slot="end" ds-icon-button variant="flat-reduced" kind="tertiary" size="medium">
                                        <ds-demo-icon iconName='close'></ds-demo-icon>
                                    </button>
                                    <div slot="bottom">
                                        @if (form.get('username2').invalid && form.get('username2').touched) {
                                        <ds-help-item type="error" slot="item">
                                            <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                                            <div slot="text">Your password must be at least 10 characters long.</div>
                                        </ds-help-item>
                                        } @else if (form.get('username2').valid && form.get('username1').dirty) {
                                        <ds-help-item type="success" slot="item">
                                            <ds-demo-icon slot="icon" iconName="success"></ds-demo-icon>
                                            <div slot="text">Success!</div>
                                        </ds-help-item>
                                        }
                                    </div>
                                </ds-input-field>
                            </form>
                            <div class="ds-remember-me mb-3xl">
                                <span class="mr-sm">Remember Email</span><ds-demo-icon iconName="placeholder"
                                    dsTooltipTriggerFor="tooltipTemplate" [dsTooltipTriggerFor]="tooltipTemplate" position="top"
                                    arrowPosition="start" [dsTooltipOnFocus] [tooltipToggle]="tooltipToggle"></ds-demo-icon>
                                <ng-template #tooltipTemplate>
                                    <ds-tooltip-content>
                                        <button slot="close" ds-icon-button variant="flat" kind="utility" size="small">
                                            <ds-demo-icon iconName="close"></ds-demo-icon>
                                        </button>
                                        <div slot="description">
                                            Select Keep me logged in to reduce the number of times you're asked to log in to
                                            your account. You will remain logged in until you select log out in your menu.
                                        </div>
                                        <div slot="action">
                                            <button ds-button variant="flat" kind="utility" size="small"
                                                style="margin-left: auto">
                                                GOT IT
                                            </button>
                                        </div>
                                    </ds-tooltip-content>
                                </ng-template>
                                <ds-switch style="margin-left:auto">
                                    <span slot="labelOff" class="sr-only">Label 1</span>
                                    <span slot="labelOn" class="sr-only">Label 2</span>
                                </ds-switch>
                            </div>
                            <button ds-button variant="filled" type="primary" size="medium" class="w-100 mb-md">
                                Log in
                            </button>
                            <button ds-button variant="flat" kind="utility" size="medium" class="w-100 mb-3xl">
                                Forgot your password?
                            </button>
                            <div class="login-divider w-100 mb-3xl">
                                <ds-divider variant="on-surface-highest"></ds-divider>
                                <span>Or</span>
                                <ds-divider variant="on-surface-highest"></ds-divider>
                            </div>
                            <button ds-social-button variant="filled" socialApp="yahoo" size="medium" class="w-100 mb-3xl">Sign
                                In With Yahoo
                                <ds-demo-icon slot="start" iconName="yahoo" />
                            </button>
                        </div>
                        <div class="login-new-user">
                            <span>New user?</span>
                            <button ds-button variant="flat" kind="utility" size="medium">
                                Create an account
                            </button>
                        </div>
                    </div>
                </ds-modal-content>
            </ds-modal>
        </ds-layout-cmps>
      `,
    }),
};

const svgDataArray = [
    `
  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <rect width="24" height="24" fill="#333" rx="12" />
      <path
          fill="url(#a)"
          d="M12 4.36371c.4753.66999 2.3407 2.00316 6 2.00316v4.74823c0 1.6593-.9629 5.7572-5.9999 8.5915-.0001.0046.0002-.0046 0 0C6.96291 16.8722 6 12.7744 6 11.1287V6.38052c3.65928 0 5.5247-1.34682 6-2.01681Z" />
      <path
          stroke="url(#b)"
          stroke-width="1.31465"
          d="M12.0008 5.30687c.9073.75932 2.6573 1.58565 5.3419 1.70314v4.10509c0 1.4335-.8193 5.1397-5.3426 7.8321-4.52384-2.6926-5.34277-6.3988-5.34277-7.8185V7.02353c2.68754-.11873 4.43727-.95447 5.34347-1.71666Z" />
      <path
          fill="#DCDFE4"
          fill-rule="evenodd"
          d="M12.0012 5.49066c.936.74677 2.6479 1.5259 5.2139 1.65985V11.082l.0013.023c.0784 1.3327-.7678 4.9621-5.216 7.6371-4.44944-2.6748-5.29463-6.2918-5.21631-7.6234l.00136-.023V7.16397c2.56909-.13537 4.28095-.92338 5.21575-1.67331Z"
          clip-rule="evenodd" />
      <path
          fill="#C3C4C7"
          d="M12 18.7421V5.49143c.0003-.00025.0006-.00051.001-.00077.9359.74677 2.6479 1.5259 5.2138 1.65985V11.082l.0013.023c.0784 1.3327-.7677 4.9621-5.216 7.6371H12Z" />
      <path
          fill="#C3C4C7"
          d="m12 19.7065.0001.0001c.0936-.0527.1857-.1057.2765-.1592l.0137-.0081C17.0743 16.714 18 12.759 18 11.1151V6.36688c-3.0395 0-4.8413-.91975-5.6369-1.61529-.1622-.14183-.2826-.27434-.3631-.38782v.76669c.0002-.00016.0003-.00031.0005-.00046.8626.7644 2.6464 1.65273 5.476 1.75132v4.23378c0 1.4826-.8481 5.2655-5.4764 7.9876H12v.6038Z" />
      <path
          fill="#DCDFE4"
          d="m12 19.7065-.0001.0001c-.0936-.0527-.1857-.1057-.2765-.1592l-.0137-.0081c-4.784-2.8253-5.70966-6.7803-5.70966-8.4242V6.36688c3.03942 0 4.84126-.91975 5.63686-1.61529.1622-.14183.2826-.27434.3631-.38782v.76669c-.0002-.00016-.0003-.00031-.0005-.00046-.8626.7644-2.6464 1.65273-5.476 1.75132v4.23378c0 1.4826.84809 5.2655 5.4764 7.9876H12v.6038Z" />
      <defs>
          <linearGradient id="a" x1="12" x2="12" y1="6.02311" y2="20.4557" gradientUnits="userSpaceOnUse">
              <stop stop-color="#858585" />
              <stop offset=".250185" stop-color="#fff" />
              <stop offset=".550534" stop-color="#FCFCFC" />
              <stop offset="1" stop-color="#757576" />
          </linearGradient>
          <linearGradient id="b" x1="12" x2="12" y1="4.36371" y2="19.7079" gradientUnits="userSpaceOnUse">
              <stop stop-color="#fff" />
              <stop offset=".355148" stop-color="#fff" />
              <stop offset="1" stop-color="#fff" />
          </linearGradient>
      </defs>
  </svg>
`,
];
