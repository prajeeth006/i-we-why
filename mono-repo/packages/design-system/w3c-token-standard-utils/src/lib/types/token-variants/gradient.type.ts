import { AliasTokenValue } from './alias.type';
import { ColorTokenValue } from './color.type';
import { NumberTokenValue } from './number.type';

/**
 * This represents the type of gradient token value
 * @see {@link https://tr.designtokens.org/format/#gradient}
 */
export type GradientTokenValue =
    | {
          color: ColorTokenValue;
          position: NumberTokenValue;
      }
    | AliasTokenValue;
