import { AliasTokenValue } from './alias.type';
import { DimensionTokenValue } from './dimension.type';
import { FontFamilyTokenValue } from './font-family.type';
import { FontWeightTokenValue } from './font-weight.type';
import { NumberTokenValue } from './number.type';

/**
 * This represents the type of typography token value
 * @see {@link https://tr.designtokens.org/format/#typography}
 */
export type TypographyTokenValue =
    | {
          fontFamily: FontFamilyTokenValue;
          fontSize: DimensionTokenValue;
          fontWeight: FontWeightTokenValue;
          letterSpacing: DimensionTokenValue;
          lineHeight: NumberTokenValue;
      }
    | AliasTokenValue;
