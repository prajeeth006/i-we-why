import { storybookPreviewHelper } from '@design-system/shared-storybook-utils';
import { Preview } from '@storybook/angular';

const preview: Preview = {
    parameters: {
        ...storybookPreviewHelper.getDefaultParameters(),
        options: {
            storySort: {
                order: [
                    'Introduction',
                    ['Intro', '*', 'All components'],

                    'Tokens',
                    'Components',
                    [
                        'Accordion',
                        'Alert',
                        'Arrow',
                        'Button',
                        [
                            'Button',
                            'Icon Button',
                            ['Default', 'Disabled', 'Overview', 'All variants'], // we want all variants file in icon button to be in the last place
                            'Social',
                            'Bonus Button',
                            'Button Toggle',
                        ],
                    ],
                    '*',
                    'Card',
                    'Badge',
                ],
            },
        },
    },

    decorators: [...storybookPreviewHelper.getDefaultDecorators()],
    tags: ['autodocs'],
};

export default preview;
