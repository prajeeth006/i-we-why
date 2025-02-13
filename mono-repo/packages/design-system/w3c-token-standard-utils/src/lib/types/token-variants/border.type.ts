import { AliasTokenValue } from './alias.type';
import { ColorTokenValue } from './color.type';
import { DimensionTokenValue } from './dimension.type';
import { StrokeStyleTokenValue } from './stroke-style.type';

/**
 * This represents the type of border token value
 * @see {@link https://tr.designtokens.org/format/#border}
 */
export type BorderTokenValue =
    | {
          color: ColorTokenValue;
          width: DimensionTokenValue;
          style: StrokeStyleTokenValue;
      }
    | AliasTokenValue;
