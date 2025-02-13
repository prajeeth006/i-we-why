/**
 * Map to extend figma extraction for unique class names
 * use ! for blocking recursive loops
 */
const utilityMap: Record<string, string[]> = {
    'padding': ['p', 'px', 'py', 'pl', 'pr', 'pt', 'pb', 'pe', 'ps'],
    'margin': ['m', 'mx', 'my', 'ml', 'mr', 'mt', 'mb', 'me', 'ms'],
    'spacing/container': ['margin', 'padding'],
    'spacing/stack': ['space-y', 'gap-y'],
    'spacing/inline': ['space-x', 'gap-x'],
    'size': ['width', 'height', 'min-width', 'min-height', 'max-width', 'max-height', 'size!'],
    'color/': [
        'color-text/',
        'color-bg/',
        'color-border/',
        'color-outline/',
        'color-caret/',
        'color-fill/',
        'color-stroke/',
        'color-divide/',
        'color-decoration/',
        'color-accent/',
    ],
    'radius': [
        'rounded',
        'rounded-t',
        'rounded-r',
        'rounded-b',
        'rounded-l',
        'rounded-tl',
        'rounded-tr',
        'rounded-br',
        'rounded-bl',
        'rounded-s',
        'rounded-ss',
        'rounded-se',
        'rounded-e',
        'rounded-ee',
        'rounded-es',
    ],
};

const cleaning: Record<string, string> = {
    'padding-': '',
    'large': 'lg',
    'medium': 'md',
    'small': 'sm',
    'xlarge': 'xl',
    'xsmall': 'xs',
    'none': '0',
    'half': '0.5',
    'quarter': '0.25',
};

const utilityKeys = Object.keys(utilityMap);

function getUtilityHelper(names: string[]): string[] {
    return names.flatMap((name) => {
        const match = utilityKeys.find((key) => name.startsWith(key));
        if (!match) {
            return [name];
        }
        const replacements = utilityMap[match];
        // This is used to keep name if needed, suffix marked with !
        const fixed = replacements.filter((x) => x.endsWith('!')).map((x) => x.slice(0, -1));
        const dynamic = replacements.filter((x) => !x.endsWith('!'));
        return [...fixed.map((newName) => name.replace(match, newName)), ...getUtilityHelper(dynamic.map((newName) => name.replace(match, newName)))];
    });
}

export function getUtilityNames(name: string) {
    return getUtilityHelper([name]).map((x) => Object.keys(cleaning).reduce((acc, key) => acc.replace(new RegExp(key, 'g'), cleaning[key]), x));
}
