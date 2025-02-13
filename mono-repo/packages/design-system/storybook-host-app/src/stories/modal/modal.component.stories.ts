import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DemoChevronComponent, DemoCloseIconComponent, DemoIconComponent } from '@design-system/storybook-demo-cmp-lib';
import { DsBadge } from '@frontend/ui/badge';
import { DsButton } from '@frontend/ui/button';
import { DsIconButton } from '@frontend/ui/icon-button';
import { DsModal, DsModalContent, DsModalHeader, DsModalHeaderDrag, DsModalHeaderVariant } from '@frontend/ui/modal';
import { type Meta, type StoryObj, moduleMetadata } from '@storybook/angular';

import { DemoCdkModalContainer } from './demo-cdk-dialog-cmp.component';
import { DemoModalContainer } from './demo-modal-cmp.component';

type DsModalHeaderStoryType = DsModalHeader & { variant: DsModalHeaderVariant };

const meta: Meta<DsModalHeaderStoryType> = {
    title: 'Components/Modal',
    component: DsModal,
    parameters: {
        status: generateStatusBadges('UX-2414', ['draft']),
    },
    excludeStories: /.*Data$/,
    argTypes: {
        variant: {
            options: ['surface-lowest', 'surface-low', 'surface'],
            table: { defaultValue: { summary: 'surface' }, category: 'Styling' },
            control: { type: 'select' },
            description: 'Surface type',
        },
    },
    args: {
        variant: 'surface',
    },
    decorators: [
        moduleMetadata({
            imports: [
                DsModal,
                DemoIconComponent,
                DemoCloseIconComponent,
                DsButton,
                DsIconButton,
                DemoChevronComponent,
                DsBadge,
                DsModalHeader,
                DsModalContent,
                DsModalHeaderDrag,
                DemoModalContainer,
                DemoCdkModalContainer,
            ],
        }),
    ],
};

export default meta;
type Story = StoryObj<DsModalHeaderStoryType>;

export const Default: Story = {
    render: () => ({
        template: `<ds-modal style="width: 250px; min-height: 120px"></ds-modal>`,
    }),
};

export const WithMatDialog: Story = {
    render: (modal) => ({
        template: `
            <div style="width: 100%; height: 100%">
                <ds-demo-dialog-container variant="${modal.variant}" />
            </div>
        `,
    }),
};

export const WithCdkDialog: Story = {
    render: (modal) => ({
        template: `
            <div style="width: 100%; height: 100%">
                <ds-demo-cdk-dialog-container variant="${modal.variant}" />
            </div>
        `,
    }),
};

export const ModalWithContentOnly: Story = {
    render: () => ({
        template: `
            <ds-modal style="width: 250px; min-height: 120px">
                <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
            </ds-modal>
        `,
    }),
};

export const WithTitleAndClose: Story = {
    render: () => ({
        template: `
            <ds-modal style="width: 250px; min-height: 120px">
                <ds-modal-header variant="surface">
                    <div slot="start">
                        <div slot="title">Hello world</div>
                    </div>
                    <button slot="end" ds-icon-button size="small" variant="flat" kind="utility">
                        <ds-demo-close-icon />
                    </button>
                </ds-modal-header>
                <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
            </ds-modal>
        `,
    }),
};

export const WithDragger: Story = {
    render: () => ({
        template: `
            <ds-modal style="width: 250px; min-height: 120px">
                <ds-modal-header variant="surface">
                   <ds-modal-header-drag />
                </ds-modal-header>
                <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
            </ds-modal>
        `,
    }),
};

export const BolderSubtitleThanTitle: Story = {
    render: () => ({
        template: `
            <ds-modal style="width: 250px; min-height: 120px">
                <ds-modal-header variant="surface">
                    <button slot="start" ds-button variant="outline" size="medium">Cancel</button>
                    <div slot="center">
                        <div slot="subtitle">Title</div>
                        <div slot="title">Subtitle</div>
                    </div>
                    <button slot="end" ds-button variant="filled" size="medium">
                        <ds-demo-icon slot="start" />
                        Agree
                    </button>
                </ds-modal-header>
                <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
            </ds-modal>
        `,
    }),
};

export const ActionsAndCenteredTitle: Story = {
    render: () => ({
        template: `
            <ds-modal style="width: 250px; min-height: 120px">
                <ds-modal-header variant="surface">
                    <button slot="start" ds-button variant="outline" size="medium">Cancel</button>
                    <div slot="center">
                        <div slot="title">Hello world</div>
                        <div slot="subtitle">From DS team</div>
                    </div>
                    <button slot="end" ds-button variant="filled" size="medium">
                        <ds-demo-icon slot="start" />
                        Agree
                    </button>
                </ds-modal-header>
                <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
            </ds-modal>
        `,
    }),
};

export const CloseTitleLabelAction: Story = {
    render: () => ({
        template: `
            <ds-modal style="width: 250px; min-height: 120px">
                <ds-modal-header variant="surface">
                    <ng-container slot="start" >
                      <button ds-icon-button variant="outline" size="medium" kind="secondary">
                        <ds-demo-close-icon />                        
                      </button>
                      <div slot="title">
                        Hello world
                        <ds-badge variant="blue">Label</ds-badge>
                      </div>
                    </ng-container>
                    <ng-container slot="end">
                        <ds-demo-icon slot="start" />
                        <button slot="end" ds-button variant="outline" size="medium">
                          Action
                        </button>
                    </ng-container>
                </ds-modal-header>
                <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
            </ds-modal>
        `,
    }),
};

export const BackBtnTitleLabelAction: Story = {
    render: () => ({
        template: `
            <ds-modal style="width: 250px; min-height: 120px">
                <ds-modal-header variant="surface">
                    <ng-container slot="start">
                      <button ds-icon-button variant="outline" size="medium" kind="secondary">
                        <ds-demo-chevron rotation="90" />                        
                      </button>
                      <div style="display: flex; flex-direction: column;">
                        <div slot="title">
                          Hello world
                          <ds-badge variant="blue">Label</ds-badge>
                        </div>
                        <div slot="subtitle">From DS team</div>
                      </div>
                    </ng-container>
                    <ng-container slot="end">
                        <ds-demo-icon slot="start" />
                        <button slot="end" ds-button variant="outline" size="medium">
                          Action
                        </button>
                    </ng-container>
                </ds-modal-header>
                <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
            </ds-modal>
        `,
    }),
};

export const ModalHeaderTypes: Story = {
    render: () => ({
        template: `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px">
                 <div style="display: grid; gap: 10px">
                    <ds-modal style="width: 250px; min-height: 120px">
                        <ds-modal-header variant="surface">
                            <div slot="start">
                                <div slot="title">Surface</div>
                            </div>
                            <button slot="end" ds-icon-button size="small" variant="flat" kind="utility">
                                <ds-demo-close-icon />
                            </button>
                        </ds-modal-header>
                        <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
                    </ds-modal>
                    <ds-modal style="width: 250px; min-height: 120px">
                        <ds-modal-header variant="surface-lowest">
                            <div slot="start">
                                <div slot="title">Surface lowest</div>
                            </div>
                            <button slot="end" ds-icon-button size="small" variant="outline" kind="utility">
                                <ds-demo-close-icon />
                            </button>
                        </ds-modal-header>
                        <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
                    </ds-modal>
                    <ds-modal style="width: 250px; min-height: 120px">
                        <ds-modal-header variant="surface-low">
                            <div slot="start">
                                <div slot="title">Surface low</div>
                            </div>
                            <button slot="end" ds-icon-button size="small" variant="filled" kind="utility">
                                <ds-demo-close-icon />
                            </button>
                        </ds-modal-header>
                        <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
                    </ds-modal>
                    <ds-modal style="width: 250px; min-height: 120px">
                        <ds-modal-header variant="surface-high">
                            <div slot="start">
                                <div slot="title">Surface High</div>
                            </div>
                            <button slot="end" ds-icon-button size="small" kind="secondary">
                                <ds-demo-close-icon />
                            </button>
                        </ds-modal-header>
                        <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
                    </ds-modal>
                </div>
                 <div style="display: grid; gap: 10px">
                    <ds-modal style="width: 250px; min-height: 120px">
                        <ds-modal-header variant="surface">
                            <div slot="start">
                                <div slot="title">Surface</div>
                                <div slot="subtitle">Header subtitle</div>
                            </div>
                            <div slot="end">
                              <button ds-icon-button size="small" variant="flat" kind="utility">
                                <ds-demo-close-icon />
                              </button>
                            </div>
                        </ds-modal-header>
                        <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
                    </ds-modal>
                    <ds-modal style="width: 250px; min-height: 120px">
                        <ds-modal-header variant="surface-lowest">
                            <div slot="start">
                                <div slot="title">Surface lowest</div>
                                <div slot="subtitle">Header subtitle</div>
                            </div>
                            <button slot="end" ds-icon-button size="small" variant="outline" kind="utility">
                                <ds-demo-close-icon />
                            </button>
                        </ds-modal-header>
                        <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
                    </ds-modal>
                    <ds-modal style="width: 250px; min-height: 120px">
                        <ds-modal-header variant="surface-low">
                            <div slot="start">
                                <div slot="title">Surface low</div>
                                <div slot="subtitle">Header subtitle</div>
                            </div>
                            <button slot="end" ds-icon-button size="small" kind="utility">
                                <ds-demo-close-icon />
                            </button>
                        </ds-modal-header>
                        <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
                    </ds-modal>
                    <ds-modal style="width: 250px; min-height: 120px">
                        <ds-modal-header variant="surface-high">
                            <div slot="start">
                                <div slot="title">Surface High</div>
                                <div slot="subtitle">Header subtitle</div>
                            </div>
                            <button slot="end" ds-icon-button size="small" kind="secondary">
                                <ds-demo-close-icon />
                            </button>
                        </ds-modal-header>
                        <ds-modal-content> Lorem ipsum dolor sit amet. </ds-modal-content>
                    </ds-modal>
                </div>
            </div>
        `,
    }),
};
