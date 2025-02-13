import { Meta } from '@storybook/angular';

export interface VariantInfo {
    variantOptions: string[];
    kindOptions: string[];
    sizeOptions: string[];
    totalCombinations: number;
}

function getOptions<T>(meta: Meta<T>, key: string): string[] {
    const argTypes = meta.argTypes as Record<string, { options?: string[] } | undefined>;
    const options = argTypes[key]?.options || [];
    return Array.isArray(options) ? options : [];
}

export function getVariantInfo<T>(meta: Meta<T>): VariantInfo {
    const variantOptions = getOptions(meta, 'variant');
    const kindOptions = getOptions(meta, 'kind');
    const sizeOptions = getOptions(meta, 'size');

    const totalCombinations =
        kindOptions.length > 0 ? variantOptions.length * kindOptions.length * sizeOptions.length : variantOptions.length * sizeOptions.length;

    return {
        variantOptions,
        kindOptions,
        sizeOptions,
        totalCombinations,
    };
}
