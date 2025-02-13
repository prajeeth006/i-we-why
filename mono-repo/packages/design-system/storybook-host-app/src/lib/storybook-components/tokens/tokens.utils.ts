export const SEMANTIC_TOKEN_TYPE_ARRAY = [
    'color',
    'size',
    'spacing',
    'fontSize',
    'borderRadius',
    'lineHeight',
    'fontWeight',
    'fontFamily',
    'elevation',
] as const;
export type SemanticTokenType = (typeof SEMANTIC_TOKEN_TYPE_ARRAY)[number];

export type SemanticToken = {
    name: string;
    type: SemanticTokenType;
    subtype?: 'container-padding' | 'inline' | 'stack';
};

function tokensSortFunction(a: SemanticToken, b: SemanticToken): number {
    if (a.type !== b.type) {
        return a.type.localeCompare(b.type);
    }
    if (a.type === 'color' && b.type === 'color') {
        return a.name.localeCompare(b.name);
    }
    if (a.type === 'fontFamily' && b.type === 'fontFamily') {
        return a.name.localeCompare(b.name);
    }
    if (a.type === 'elevation' && b.type === 'elevation') {
        return a.name.localeCompare(b.name);
    }
    if (a.type === 'size' && b.type === 'size') {
        return getSizeIndex(a.name) - getSizeIndex(b.name);
    }
    if (a.type === 'spacing' && b.type === 'spacing') {
        return getSpacingIndex(a.name, a.subtype ?? '') - getSpacingIndex(b.name, b.subtype ?? '');
    }
    if (a.type === 'fontSize' && b.type === 'fontSize') {
        return getFontIndex(a.name, 'font-size') - getFontIndex(b.name, 'font-size');
    }
    if (a.type === 'borderRadius' && b.type === 'borderRadius') {
        return getRadiusIndex(a.name) - getRadiusIndex(b.name);
    }
    if (a.type === 'lineHeight' && b.type === 'lineHeight') {
        return getFontIndex(a.name, 'line-height') - getFontIndex(b.name, 'line-height');
    }
    if (a.type === 'fontWeight' && b.type === 'fontWeight') {
        return getFontIndex(a.name, 'font-weight') - getFontIndex(b.name, 'font-weight');
    }
    console.warn('type unknown for sorting', a.type);
    return 0;
}

function getSizeIndex(name: string): number {
    const sizeMatch = name.match(/size-x(quarter|half|\d+(-no-unit)?)/);
    const iconMatch = name.match(/icon-(xsmall|small|medium|large|xlarge)/);
    const iconOrder = ['xsmall', 'small', 'medium', 'large', 'xlarge'];

    if (sizeMatch) {
        const size = sizeMatch[1];
        const noUnit = sizeMatch[2];
        let index;

        if (size === 'quarter') {
            index = 0;
        } else if (size === 'half') {
            index = 1;
        } else {
            index = parseInt(size, 10) * 2;

            if (noUnit) {
                index += 1;
            }
        }
        return index;
    } else if (iconMatch) {
        const icon = iconMatch[1];
        return 200 + iconOrder.indexOf(icon);
    }

    return Number.MAX_VALUE;
}

function getSpacingIndex(name: string, subtype: string): number {
    const match = name.match(/spacing-(container-padding|inline|stack|inline-inline|stack-stack)-(none|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl)/);
    if (match) {
        const [type, size] = [match[1], match[2]];
        const typeOrder = ['container-padding', 'inline-inline', 'inline', 'stack-stack', 'stack'];
        const sizeOrder = ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
        return typeOrder.indexOf(type) * 1000 + sizeOrder.indexOf(size) * 100 + typeOrder.indexOf(subtype);
    }
    return Number.MAX_VALUE;
}

function getRadiusIndex(name: string): number {
    const match = name.match(/radius-+(semi-rounded-)?(squared|xs|sm|md|lg|xl|max|\d+|)/);
    if (match) {
        const [type, size] = [match[1], match[2]];
        const typeOrder = ['semi-rounded'];
        const sizeOrder = ['squared', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', 'max'];
        return typeOrder.indexOf(type) * 1000 + sizeOrder.indexOf(size) * 100;
    }
    return Number.MAX_VALUE;
}
function getFontIndex(name: string, property: 'font-size' | 'line-height' | 'font-weight'): number {
    const match = name.match(new RegExp(`(label|body|headline|title|display)-(|xs|sm|md|lg|xl|2xl|3xl|4xl|5xl)+(-strong)?-${property}`));
    if (match) {
        const [type, size] = [match[1], match[2]];
        const typeOrder = ['label', 'body', 'headline', 'title', 'display'];
        const sizeOrder = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];
        return typeOrder.indexOf(type) * 1000 + sizeOrder.indexOf(size) * 100;
    }
    return Number.MAX_VALUE;
}

export function extractSemanticTokens(cssText: string, themeClassName: string): SemanticToken[] {
    const semanticTokens: SemanticToken[] = [];
    /**
     * Explanation of regex:
     * \\.: Matches a literal dot . which is a part of the class name.
     * ${themeClassName}: Inserts the class name.
     * (\\s*,\\s*\\.[\\w-]+)*: Matches any additional class names in the selector, allowing for optional spaces around the comma and capturing class names with alphanumeric characters and hyphens.
     * \\s*{: Matches the opening curly brace { with optional whitespace before it.
     * ([^}]*): Captures everything inside the curly braces, ensuring it doesn't include the closing curly brace }.
     *
     * Note: this regex does not allow for dots, underscores, colons, and brackets in the selector itself as at time of writing this is not necessary to be considered.
     */
    const classRegex = new RegExp(`\\.${themeClassName}(\\s*,\\s*\\.[\\w-]+)*\\s*{([^}]*)}`, 'g');
    const tokenPatterns = {
        color: /--(.*?color.*?):\s*(.*?);/g,
        size: /--(.*?size-(x|icon).*?):\s*(.*?);/g,
        spacing: /--(.*?spacing-(container-padding|inline|stack)-.*?):\s*(.*?);/g,
        fontSize: /--(.*?font-size.*?):\s*(.*?);/g,
        borderRadius: /--(.*?radius.*?):\s*(.*?);/g,
        lineHeight: /--(.*?line-height.*?):\s*(.*?);/g,
        fontWeight: /--(.*?font-weight.*?):\s*(.*?);/g,
        fontFamily: /--(.*?font-family.*?):\s*(.*?);/g,
        elevation: /--(.*?elevation.*?):\s*(.*?);/g,
    };
    /* eslint-disable-next-line functional/no-let */
    const deprecatedRegex = /\/\*\*\s*@deprecated\b[^*]*\*\//g;

    let match: RegExpExecArray | null;
    while ((match = classRegex.exec(cssText)) != null) {
        const tokens = match[2];
        const lines = tokens.split('\n');
        let isDeprecated = false;

        lines.forEach((line) => {
            if (deprecatedRegex.test(line)) {
                isDeprecated = true;
            } else if (line.trim().startsWith('--')) {
                if (!isDeprecated) {
                    Object.entries(tokenPatterns).forEach(([type, regex]) => {
                        let tokenMatch: RegExpExecArray | null;
                        while ((tokenMatch = regex.exec(line)) != null) {
                            semanticTokens.push(createSemanticTokens(type as SemanticTokenType, tokenMatch));
                        }
                    });
                }
                isDeprecated = false;
            }
        });
    }

    semanticTokens.sort(tokensSortFunction);
    return semanticTokens;
}

function createSemanticTokens(type: SemanticTokenType, match: RegExpExecArray): SemanticToken {
    const name = match[1].trim();
    const baseProperties = { name, type };
    const subtypeProperty = type === 'spacing' ? { subtype: match[2] as 'container-padding' | 'inline' | 'stack' } : {};
    return { ...baseProperties, ...subtypeProperty };
}

export function filterTokens(semanticTokens: SemanticToken[], tokenType: SemanticToken['type']): SemanticToken[] {
    return semanticTokens.filter((token) => token.type === tokenType);
}
