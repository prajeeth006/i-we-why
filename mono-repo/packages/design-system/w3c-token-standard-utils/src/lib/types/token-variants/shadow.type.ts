import { AliasTokenValue } from './alias.type';
import { ColorTokenValue } from './color.type';
import { DimensionTokenValue } from './dimension.type';

/**
 * This represents the type of shadow token value
 * @see {@link https://tr.designtokens.org/format/#shadow}
 */
export type ShadowTokenValue =
    | {
          color: ColorTokenValue;
          offsetX: DimensionTokenValue;
          offsetY: DimensionTokenValue;
          blur: DimensionTokenValue;
          spread: DimensionTokenValue;
      }
    | AliasTokenValue;
