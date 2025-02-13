import { AliasTokenValue } from './alias.type';

/**
 * This represents the type of cubic bezier token value
 * @see {@link https://tr.designtokens.org/format/#cubic-bezier}
 */
export type CubicBezierTokenValue = [number, number, number, number] | AliasTokenValue;
