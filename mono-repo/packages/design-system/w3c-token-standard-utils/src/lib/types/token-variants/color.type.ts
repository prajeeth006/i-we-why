import { AliasTokenValue } from './alias.type';

/**
 * This represents the type of color token value
 * @see {@link https://tr.designtokens.org/format/#color}
 */
export type ColorTokenValue = `#${string}` | AliasTokenValue;
