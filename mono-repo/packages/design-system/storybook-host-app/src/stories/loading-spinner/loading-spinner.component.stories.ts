import { generateStatusBadges } from '@design-system/shared-storybook-utils';
import { DsLoadingSpinner } from '@frontend/ui/loading-spinner';
import { Meta, StoryObj } from '@storybook/angular';

import { allThemes } from '../../modes';

const meta: Meta<DsLoadingSpinner> = {
    title: 'Components/Loading spinner',
    component: DsLoadingSpinner,
    parameters: {
        status: generateStatusBadges('UX-2388', ['integration ready']),
    },
};

export default meta;
type Story = StoryObj<DsLoadingSpinner>;

export const Default: Story = {
    parameters: {
        name: 'Default',
        design: {
            name: 'Whitelabel',
            type: 'figma',
            url: 'https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=2268-21155&mode=design&t=fS1qO73SS8lGciLj-4',
        },
        chromatic: {
            modes: allThemes,
            disableSnapshot: false,
        },
    },
    args: {
        ...meta.args,
    },
};
