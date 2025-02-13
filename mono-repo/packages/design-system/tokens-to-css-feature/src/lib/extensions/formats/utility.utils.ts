import { TransformedToken } from 'style-dictionary';

const nameToProperties: Record<string, string[]> = {
    'p': ['padding'],
    'px': ['padding-left', 'padding-right'],
    'py': ['padding-top', 'padding-bottom'],
    'ps': ['padding-inline-start'],
    'pe': ['padding-inline-end'],
    'pt': ['padding-top'],
    'pb': ['padding-bottom'],
    'pl': ['padding-left'],
    'pr': ['padding-right'],
    'm': ['margin'],
    'mx': ['margin-left', 'margin-right'],
    'my': ['margin-top', 'margin-bottom'],
    'ms': ['margin-inline-start'],
    'me': ['margin-inline-end'],
    'mt': ['margin-top'],
    'mb': ['margin-bottom'],
    'ml': ['margin-left'],
    'mr': ['margin-right'],
    'space-x': ['margin-left'],
    'space-y': ['margin-top'],
    'gap-x': ['column-gap'],
    'gap-y': ['row-gap'],
    'size': ['width', 'height'],
    'color-text': ['color'],
    'color-decoration': ['text-decoration-color'],
    'color-bg': ['background-color'],
    'color-border': ['border-color'],
    'color-divide': ['border-color'],
    'color-outline': ['outline-color'],
    'color-accent': ['accent-color'],
    'color-caret': ['caret-color'],
    'color-fill': ['fill'],
    'color-stroke': ['stroke'],
    'rounded': ['border-radius'],
    'rounded-t': ['border-top-left-radius', 'border-top-right-radius'],
    'rounded-r': ['border-top-right-radius', 'border-bottom-right-radius'],
    'rounded-b': ['border-bottom-right-radius', 'border-bottom-left-radius'],
    'rounded-l': ['border-top-left-radius', 'border-bottom-left-radius'],
    'rounded-tl': ['border-top-left-radius'],
    'rounded-tr': ['border-top-right-radius'],
    'rounded-br': ['border-bottom-right-radius'],
    'rounded-bl': ['border-bottom-left-radius'],
    'rounded-s': ['border-start-start-radius', 'border-end-start-radius'],
    'rounded-ss': ['border-start-start-radius'],
    'rounded-se': ['border-start-end-radius'],
    'rounded-e': ['border-start-end-radius', 'border-end-end-radius'],
    'rounded-ee': ['border-end-end-radius'],
    'rounded-es': ['border-end-start-radius'],
    'fontFamily': ['font-family'],
    'fontWeight': ['font-weight'],
    'letterSpacing': ['letter-spacing'],
    'lineHeight': ['line-height'],
    'fontSize': ['font-size'],
};

/* The original name must be the same as the remaining token selector is inserted */
const nameToSelector: Record<string, string> = {
    'space-x': 'space-x > * + *',
    'space-y': 'space-y > * + *',
    'color-divide': 'color-divide > * + *',
};

/* Prefix removal */
const prefixRemoval = ['color-'];

export function getTokensForProperty(property: string, token: TransformedToken): TransformedToken[] {
    if (typeof token.value === 'object') {
        return Object.keys(token.value).flatMap((key) => {
            if (key in nameToProperties) {
                return nameToProperties[key].map((x) => ({
                    ...token,
                    name: x,
                    value: token.value[key],
                    original: {
                        ...token.original,
                        value: token.original.value[key],
                    },
                }));
            }
            return [
                {
                    ...token,
                    name: key,
                    value: token.value[key],
                    original: {
                        ...token.original,
                        value: token.original.value[key],
                    },
                },
            ];
        });
    }
    if (property in nameToProperties) {
        return nameToProperties[property].map((x) => ({
            ...token,
            name: x,
        }));
    }
    return [
        {
            ...token,
            name: property,
        },
    ];
}

export function getSelectorName(name: string): string {
    if (name in nameToSelector) {
        return nameToSelector[name];
    }
    return name;
}

export function removePrefix(name: string): string {
    const foundPrefix = prefixRemoval.find((x) => name.startsWith(x));
    if (foundPrefix) {
        return name.slice(foundPrefix.length);
    }
    return name;
}
