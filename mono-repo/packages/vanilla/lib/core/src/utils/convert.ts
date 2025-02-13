/**
 * Converts a string to boolean.
 *
 * 'true' => true
 * 'false' => false
 * other values => undefined
 *
 * @stable
 */
export function toBoolean(value: string | null | undefined) {
    if (value === 'true') {
        return true;
    }

    if (value === 'false') {
        return false;
    }

    return undefined;
}

export function toJson(value: string | object) {
    if (typeof value === 'string') {
        return JSON.parse(value);
    } else {
        return value;
    }
}

export function undefinedToNull<T>(value: T | null | undefined): T | null {
    if (typeof value === 'undefined') {
        return null;
    }

    return value;
}

/**
 * Rounds the specified number or returns `defaultValue` if it's null, undefined or invalid.
 *
 * @stable
 */
export function round(value: number | null | undefined, defaultValue = 0): number {
    const rounded = Math.round(value as number);

    return Number.isNaN(rounded) ? defaultValue : rounded;
}

/**
 * Replaces placeholders with format `__placeholder__` with values from provided object.
 *
 * @stable
 */
export function replacePlaceholders(value: string | undefined, placeholders: { [key: string]: string }) {
    if (!value) {
        return value;
    }

    return value.replace(/__(.*?)__/g, (placeholder: string, key: string) => {
        const replacement = placeholders[key];
        return replacement || placeholder;
    });
}

export function safeDecodeURIComponent(str: string) {
    try {
        return decodeURIComponent(str);
    } catch (e) {
        return str;
    }
}

export function safeJsonParse(str: string) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}
