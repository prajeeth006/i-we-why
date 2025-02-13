import { AliasTokenValue } from './alias.type';

/**
 * This represents the type of duration token value
 * @see {@link https://tr.designtokens.org/format/#duration}
 */
export type DurationTokenValue = `${number}ms` | AliasTokenValue;
