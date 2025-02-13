import { W3CGroup } from './w3c-group.type';
import { W3CToken } from './w3c-token.type';

/**
 * This represents the type of the W3C standard (draft)
 * @see {@link https://tr.designtokens.org/format}
 */
export type W3CTokenDocument = Record<string, W3CToken | W3CGroup>;
