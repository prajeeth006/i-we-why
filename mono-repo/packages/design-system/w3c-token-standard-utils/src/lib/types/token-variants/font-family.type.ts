import { AliasTokenValue } from './alias.type';

/**
 * This represents the type of font family token value
 * @see {@link https://tr.designtokens.org/format/#font-family}
 */
// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export type FontFamilyTokenValue = string | string[] | AliasTokenValue;
