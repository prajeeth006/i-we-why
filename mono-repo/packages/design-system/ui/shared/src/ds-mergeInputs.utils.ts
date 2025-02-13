/* eslint-disable unicorn/no-typeof-undefined, @typescript-eslint/prefer-nullish-coalescing,  @typescript-eslint/no-non-null-assertion, @typescript-eslint/consistent-type-assertions  */
/**
 * This function is from https://ngxtension.netlify.app/
 *
 * see https://ngxtension.netlify.app/utilities/directives/merge-inputs/
 * https://github.com/ngxtension/ngxtension-platform/blob/main/libs/ngxtension/inject-inputs/src/lib/merge-inputs.ts
 *
 * @param defaultValue
 */
export function mergeInputs<TInputs extends object>(defaultValue: TInputs = {} as TInputs): (value: '' | Partial<TInputs>) => TInputs {
    return (value: '' | Partial<TInputs>) => {
        // NOTE: if the directive is used as `<div directive></div>` without binding syntax
        // then the bound value is `''` in which case we'll return the `defaultValue` for the input
        if (value === '') {
            return defaultValue;
        }
        return { ...defaultValue, ...value };
    };
}
