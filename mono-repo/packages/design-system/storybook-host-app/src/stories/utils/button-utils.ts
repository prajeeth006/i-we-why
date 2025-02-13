import { DS_BUTTON_KIND_ARRAY, DS_BUTTON_NOT_SUPPORTED_CONFIG, DS_BUTTON_VARIANTS_ARRAY, DsButtonKind, DsButtonVariant } from '@frontend/ui/button';

const isDsButtonVariant = (value: unknown): value is DsButtonVariant => {
    return typeof value === 'string' && DS_BUTTON_VARIANTS_ARRAY.includes(value as DsButtonVariant);
};

const isDsButtonKind = (value: unknown): value is DsButtonKind => {
    return typeof value === 'string' && DS_BUTTON_KIND_ARRAY.includes(value as DsButtonKind);
};
export const isUnsupportedCombination = (variant: any, kind: any): boolean => {
    if (!isDsButtonVariant(variant) || !isDsButtonKind(kind)) {
        throw new Error('Invalid variant or kind');
    }

    const unsupportedKinds: DsButtonKind[] = DS_BUTTON_NOT_SUPPORTED_CONFIG[variant] || [];
    return unsupportedKinds.includes(kind);
};
