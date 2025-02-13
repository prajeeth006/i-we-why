import { AliasTokenValue } from './alias.type';

/**
 * This represents the type of font weight token value
 * @see {@link https://tr.designtokens.org/format/#font-weight}
 */
export type FontWeightTokenValue =
    | number
    | 'thin'
    | 'hairline'
    | 'extra-light'
    | 'ultra-light'
    | 'light'
    | 'normal'
    | 'regular'
    | 'book'
    | 'medium'
    | 'semi-bold'
    | 'demi-bold'
    | 'bold'
    | 'extra-bold'
    | 'ultra-bold'
    | 'black'
    | 'heavy'
    | 'extra-black'
    | 'ultra-black'
    | AliasTokenValue;
