import { MetaData } from './metadata.type';
import { W3CToken } from './w3c-token.type';

/**
 * This represents the type of group
 * @see {@link https://tr.designtokens.org/format/#groups}
 */
export type W3CGroup = MetaData & {
    [key: string]: W3CToken | W3CGroup;
};
