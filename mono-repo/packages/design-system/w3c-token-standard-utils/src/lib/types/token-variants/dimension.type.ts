import { AliasTokenValue } from './alias.type';

/**
 * This represents the type of dimension token value
 * @see {@link https://tr.designtokens.org/format/#dimension}
 */
export type DimensionTokenValue = `${number}px` | `${number}rem` | AliasTokenValue;
