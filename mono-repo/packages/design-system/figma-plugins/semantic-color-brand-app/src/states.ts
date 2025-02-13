export type StateOption = {
    key: string;
    header: string;
    options: string[];
    options_dark: string[];
    condition?: string;
    condition_dark?: string;
    type: 'radio' | 'color' | 'color_palette' | 'semantic_collection' | 'fixed_linking_selection';
    variablePath?: string[];
    variants?: {
        key: string;
        variablePath: string[];
        condition?: string;
        condition_dark?: string;
    }[];
    breadcrumb?: string;
};

const baseStates: StateOption[] = [
    {
        key: 'reference_file',
        header: 'Which brand are you creating variables for?',
        type: 'color_palette',
        options: [],
        options_dark: [],
        breadcrumb: 'Brand selected - {reference_file}',
    },
    {
        key: 'target_collection',
        header: 'In which semantic collection is this brand defined?',
        type: 'semantic_collection',
        options: [],
        options_dark: [],
    },
    {
        key: 'theme',
        header: 'Create variables for?',
        options: ['Light Mode', 'Dark Mode'],
        options_dark: ['Light Mode', 'Dark Mode'],
        type: 'radio',
        breadcrumb: '{theme}',
    },
    {
        key: 'variant',
        header: 'Please select the semantic token category you want to create variables for:',
        options: [
            'Primary',
            'Secondary',
            'Tertiary',
            'Utility',
            'Negative',
            'Positive',
            'Caution',
            'Disabled',
            'Supporting',
            'Social/Spacing/Radius/Size/Typography',
        ],
        options_dark: [
            'Primary',
            'Secondary',
            'Tertiary',
            'Utility',
            'Negative',
            'Positive',
            'Caution',
            'Disabled',
            'Supporting',
            'Social/Spacing/Radius/Size/Typography',
        ],
        type: 'radio',
        breadcrumb: 'Semantic token category - {variant}',
    },
];

const colorStates: StateOption[] = [
    ...baseStates,
    {
        key: 'color_mode',
        header: "Let's choose the color theme for these variables:",
        type: 'color_palette',
        options: [],
        options_dark: [],
    },
];

export const states: StateOption[] = [
    ...colorStates,
    {
        key: 'base_color',
        header: 'Pick a shade for "{variant} Base"',
        options: ['70', '80', '90', '100', '110', '120'],
        options_dark: ['10', '20', '30', '40', '50', '60'],
        type: 'color',
        variablePath: ['color', '{variant}', 'base'],
        variants: [
            {
                key: 'base_color_hover',
                variablePath: ['color', '{variant}', 'hover'],
                condition: 'up 1 base_color',
                condition_dark: 'down 1 base_color',
            },
            {
                key: 'base_color_active',
                variablePath: ['color', '{variant}', 'active'],
                condition: 'up 2 base_color',
                condition_dark: 'down 2 base_color',
            },
        ],
    },
    {
        key: 'outline_base_color',
        header: 'Pick a shade for "{variant} Outline Base"',
        options: ['70', '80', '90', '100', '110', '120'],
        options_dark: ['10', '20', '30', '40', '50', '60'],
        type: 'color',
        variablePath: ['color', '{variant}', 'outline', 'base'],
        variants: [
            {
                key: 'outline_base_color_hover',
                variablePath: ['color', '{variant}', 'outline', 'hover'],
                condition: 'up 1 outline_base_color',
                condition_dark: 'down 1 outline_base_color',
            },
            {
                key: 'outline_base_color_active',
                variablePath: ['color', '{variant}', 'outline', 'active'],
                condition: 'up 2 outline_base_color',
                condition_dark: 'down 2 outline_base_color',
            },
        ],
    },
    {
        key: 'container_base_color',
        header: 'Pick a shade for "{variant} Container Base"',
        options: ['0', '5', '10', '20', '30', '40'],
        options_dark: ['90', '100', '110', '120', '130', '140'],
        type: 'color',
        variablePath: ['color', '{variant}', 'container', 'base'],
        variants: [
            {
                key: 'container_base_color_hover',
                variablePath: ['color', '{variant}', 'container', 'hover'],
                condition: 'up 1 container_base_color',
                condition_dark: 'down 1 container_base_color',
            },
            {
                key: 'container_base_color_active',
                variablePath: ['color', '{variant}', 'container', 'active'],
                condition: 'up 2 container_base_color',
                condition_dark: 'down 2 container_base_color',
            },
            {
                key: 'container_base_color_selected',
                variablePath: ['color', '{variant}', 'container', 'selected'],
                condition: 'up 1 container_base_color',
                condition_dark: 'down 1 container_base_color',
            },
        ],
    },
    {
        key: 'on_base_color',
        header: 'Pick a shade for "On {variant} Base"',
        options: ['0', '5', '10', '20', '30', '40', '50'],
        options_dark: ['80', '90', '100', '110', '120', '130', '140'],
        condition: 'max minus base_color 70',
        condition_dark: 'min plus base_color 70',
        type: 'color',
        variablePath: ['color', 'on {variant}', 'base'],
    },
    {
        key: 'on_container_base_color',
        header: 'Pick a shade for "On {variant} Container"',
        options: ['80', '90', '100', '110', '120', '130', '140'],
        options_dark: ['0', '5', '10', '20', '30', '40', '50'],
        condition: 'min plus container_base_color_active 70',
        condition_dark: 'max minus container_base_color_active 70',
        type: 'color',
        variablePath: ['color', 'on {variant}', 'container'],
    },
    {
        key: 'on_container_base_color_selected',
        header: 'Pick a shade for "On {variant} Container Selected"',
        options: ['80', '90', '100', '110', '120', '130', '140'],
        options_dark: ['0', '5', '10', '20', '30', '40', '50', '60'],
        condition: 'min plus container_base_color_selected 70',
        condition_dark: 'max minus container_base_color_selected 70',
        type: 'color',
        variablePath: ['color', 'on {variant}', 'container selected'],
    },
    {
        key: 'on_outline_base_color',
        header: 'Pick a shade for "On {variant} Outline"',
        options: ['80', '90', '100', '110', '120', '130', '140'],
        options_dark: ['0', '5', '10', '20', '30', '40', '50'],
        condition: 'min plus container_base_color_active 70',
        condition_dark: 'max minus container_base_color_active 70',
        type: 'color',
        variablePath: ['color', 'on {variant}', 'outline'],
    },
    {
        key: 'has_inverse',
        header: 'Do you need INVERSE TOKENS for this brand?',
        options: ['yes', 'no'],
        options_dark: ['yes', 'no'],
        type: 'radio',
    },
    // Inverse
    {
        key: 'base_color_inverse',
        header: 'Pick a shade for "{variant} Base Inverse"',
        options: ['0', '5', '10', '20', '30', '40'],
        options_dark: ['90', '100', '110', '120', '130', '140'],
        type: 'color',
        variablePath: ['color', '{variant}', 'base inverse'],
        variants: [
            {
                key: 'base_color_hover_inverse',
                variablePath: ['color', '{variant}', 'hover inverse'],
                condition: 'up 1 base_color_inverse',
                condition_dark: 'down 1 base_color_inverse',
            },
            {
                key: 'base_color_active_inverse',
                variablePath: ['color', '{variant}', 'active inverse'],
                condition: 'up 2 base_color_inverse',
                condition_dark: 'down 2 base_color_inverse',
            },
        ],
    },
    {
        key: 'outline_base_color_inverse',
        header: 'Pick a shade for "{variant} Outline Base Inverse"',
        options: ['0', '5', '10', '20', '30', '40'],
        options_dark: ['90', '100', '110', '120', '130', '140'],
        type: 'color',
        variablePath: ['color', '{variant}', 'outline', 'base inverse'],
        variants: [
            {
                key: 'outline_base_color_hover_inverse',
                condition: 'up 1 outline_base_color_inverse',
                condition_dark: 'down 1 outline_base_color_inverse',
                variablePath: ['color', '{variant}', 'outline', 'hover inverse'],
            },
            {
                key: 'outline_base_color_active_inverse',
                condition: 'up 2 outline_base_color_inverse',
                condition_dark: 'down 2 outline_base_color_inverse',
                variablePath: ['color', '{variant}', 'outline', 'active inverse'],
            },
        ],
    },
    {
        key: 'on_base_color_inverse',
        header: 'Pick a shade for "On {variant} Base Inverse"',
        options: ['80', '90', '100', '110', '120', '130', '140'],
        options_dark: ['0', '5', '10', '20', '30', '40', '50'],
        condition: 'min plus base_color_active_inverse 70',
        condition_dark: 'max minus base_color_active_inverse 70',
        type: 'color',
        variablePath: ['color', 'on {variant}', 'base inverse'],
    },
    {
        key: 'container_base_color_inverse',
        header: 'Pick a shade for "{variant} Container Base Inverse"',
        options: ['70', '80', '90', '100', '110', '120'],
        options_dark: ['10', '20', '30', '40', '50', '60'],
        type: 'color',
        variablePath: ['color', '{variant}', 'container', 'base inverse'],
        variants: [
            {
                key: 'container_base_color_hover_inverse',
                condition: 'up 1 container_base_color_inverse',
                condition_dark: 'down 1 container_base_color_inverse',
                variablePath: ['color', '{variant}', 'container', 'hover inverse'],
            },
            {
                key: 'container_base_color_active_inverse',
                condition: 'up 2 container_base_color_inverse',
                condition_dark: 'down 2 container_base_color_inverse',
                variablePath: ['color', '{variant}', 'container', 'active inverse'],
            },
            {
                key: 'container_base_color_selected_inverse',
                condition: 'up 1 container_base_color_inverse',
                condition_dark: 'down 1 container_base_color_inverse',
                variablePath: ['color', '{variant}', 'container', 'selected inverse'],
            },
        ],
    },
    {
        key: 'on_container_base_color_inverse',
        header: 'Pick a shade for "On {variant} Container Inverse"',
        options: ['0', '5', '10', '20', '30', '40', '50'],
        options_dark: ['80', '90', '100', '110', '120', '130', '140'],
        condition: 'max minus container_base_color_inverse 70',
        condition_dark: 'min plus container_base_color_inverse 70',
        type: 'color',
        variablePath: ['color', 'on {variant}', 'container inverse'],
    },
    {
        key: 'on_container_base_color_selected_inverse',
        header: 'Pick a shade for "On {variant} Container Selected Inverse"',
        options: ['0', '5', '10', '20', '30', '40', '50', '60'],
        options_dark: ['80', '90', '100', '110', '120', '130', '140'],
        condition: 'max minus container_base_color_selected_inverse 70',
        condition_dark: 'min plus container_base_color_selected_inverse 70',
        type: 'color',
        variablePath: ['color', 'on {variant}', 'container selected inverse'],
    },
    {
        key: 'on_outline_base_color_inverse',
        header: 'Pick a shade for "On {variant} Outline Inverse"',
        options: ['0', '5', '10', '20', '30', '40', '50'],
        options_dark: ['80', '90', '100', '110', '120', '130', '140'],
        condition: 'max minus container_base_color_inverse 70',
        condition_dark: 'min plus container_base_color_inverse 70',
        type: 'color',
        variablePath: ['color', 'on {variant}', 'outline inverse'],
    },
];

export const states_disabled: StateOption[] = [
    ...colorStates,
    {
        key: 'base_color',
        header: 'Pick a shade for "{variant} Base"',
        options_dark: ['80', '90', '100', '110', '120', '130'],
        options: ['5', '10', '20', '30', '40', '50', '60'],
        type: 'color',
        variablePath: ['color', '{variant}', 'base'],
    },
    {
        key: 'outline_base_color',
        header: 'Pick a shade for "{variant} Outline Base"',
        options_dark: ['70', '80', '90', '100', '110', '120'],
        options: ['10', '20', '30', '40', '50', '60'],
        type: 'color',
        variablePath: ['color', '{variant}', 'outline'],
    },
    {
        key: 'on_base_color',
        header: 'Pick a shade for "On {variant} Base"',
        options_dark: ['80', '90', '100', '110', '120', '130'],
        options: ['5', '10', '20', '30', '40', '50', '60'],
        type: 'color',
        variablePath: ['color', 'on {variant}', 'base'],
    },
    {
        key: 'on_outline_base_color',
        header: 'Pick a shade for "On {variant} Outline"',
        options_dark: ['70', '80', '90', '100', '110', '120'],
        options: ['10', '20', '30', '40', '50', '60'],
        type: 'color',
        variablePath: ['color', 'on {variant}', 'outline'],
    },
    {
        key: 'has_inverse',
        header: 'Do you need INVERSE TOKENS for this brand?',
        options: ['yes', 'no'],
        options_dark: ['yes', 'no'],
        type: 'radio',
    },
    // Inverse
    {
        key: 'base_color_inverse',
        header: 'Pick a shade for "{variant} Base Inverse"',
        options_dark: ['5', '10', '20', '30', '40', '50'],
        options: ['80', '90', '100', '110', '120', '130'],
        type: 'color',
        variablePath: ['color', '{variant}', 'base inverse'],
    },
    {
        key: 'outline_base_color_inverse',
        header: 'Pick a shade for "{variant} Outline Base Inverse"',
        options_dark: ['10', '20', '30', '40', '50', '60'],
        options: ['70', '80', '90', '100', '110', '120'],
        type: 'color',
        variablePath: ['color', '{variant}', 'outline inverse'],
    },
    {
        key: 'on_base_color_inverse',
        header: 'Pick a shade for "On {variant} Base"',
        options_dark: ['5', '10', '20', '30', '40', '50'],
        options: ['80', '90', '100', '110', '120', '130'],
        type: 'color',
        variablePath: ['color', 'on {variant}', 'base inverse'],
    },
    {
        key: 'on_outline_base_color_inverse',
        header: 'Pick a shade for "On {variant} Outline"',
        options_dark: ['10', '20', '30', '40', '50', '60'],
        options: ['70', '80', '90', '100', '110', '120'],
        type: 'color',
        variablePath: ['color', 'on {variant}', 'outline inverse'],
    },
];

export const states_supporting: StateOption[] = [
    ...colorStates,
    // Tint
    {
        key: 'supporting_tint_color',
        header: 'Please select "Tint"',
        options_dark: ['5', '10'],
        options: ['5', '10'],
        type: 'color',
        variablePath: ['color', 'supporting', '{color_mode_referenced}', 'tint'],
    },
    {
        key: 'on_supporting_tint_color',
        header: 'Please select "On Tint"',
        options_dark: ['80', '90', '100', '110', '120', '130', '140'],
        options: ['80', '90', '100', '110', '120', '130', '140'],
        type: 'color',
        variablePath: ['color', 'on supporting', '{color_mode_referenced}', 'tint'],
    },
    // Subtle
    {
        key: 'supporting_subtle_color',
        header: 'Please select "Subtle"',
        options_dark: ['10', '20', '30'],
        options: ['10', '20', '30'],
        type: 'color',
        variablePath: ['color', 'supporting', '{color_mode_referenced}', 'subtle'],
    },
    {
        key: 'on_supporting_subtle_color',
        header: 'Please select "On Subtle"',
        options_dark: ['80', '90', '100', '110', '120', '130', '140'],
        options: ['80', '90', '100', '110', '120', '130', '140'],
        type: 'color',
        variablePath: ['color', 'on supporting', '{color_mode_referenced}', 'subtle'],
    },
    // Base
    {
        key: 'supporting_base_color',
        header: 'Please select "Base"',
        options_dark: ['40', '50', '60'],
        options: ['40', '50', '60'],
        type: 'color',
        variablePath: ['color', 'supporting', '{color_mode_referenced}', 'base'],
    },
    {
        key: 'on_supporting_base_color',
        header: 'Please select "On Base"',
        options_dark: ['110', '120', '130', '140'],
        options: ['110', '120', '130', '140'],
        type: 'color',
        variablePath: ['color', 'on supporting', '{color_mode_referenced}', 'base'],
    },
    // Strong
    {
        key: 'supporting_strong_color',
        header: 'Please select "Strong"',
        options_dark: ['70', '80', '90', '100', '110'],
        options: ['70', '80', '90', '100', '110'],
        type: 'color',
        variablePath: ['color', 'supporting', '{color_mode_referenced}', 'strong'],
    },
    {
        key: 'on_supporting_strong_color',
        header: 'Please select "On Strong"',
        options_dark: ['0', '5', '10', '20', '30', '40'],
        options: ['0', '5', '10', '20', '30', '40'],
        type: 'color',
        variablePath: ['color', 'on supporting', '{color_mode_referenced}', 'strong'],
    },
    // Shade
    {
        key: 'supporting_shade_color',
        header: 'Please select "Shade"',
        options_dark: ['120', '130', '140'],
        options: ['120', '130', '140'],
        type: 'color',
        variablePath: ['color', 'supporting', '{color_mode_referenced}', 'shade'],
    },
    {
        key: 'on_supporting_shade_color',
        header: 'Please select "On Shade"',
        options_dark: ['0', '5', '10', '20', '30', '40', '50', '60'],
        options: ['0', '5', '10', '20', '30', '40', '50', '60'],
        type: 'color',
        variablePath: ['color', 'on supporting', '{color_mode_referenced}', 'shade'],
    },
];

export const states_fixedlinking: StateOption[] = [
    ...baseStates,
    {
        key: 'on_',
        header: 'Please select ""',
        options: [],
        options_dark: [],
        type: 'fixed_linking_selection',
    },
];
