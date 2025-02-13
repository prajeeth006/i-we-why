import { AliasTokenValue } from './alias.type';
import { DimensionTokenValue } from './dimension.type';

/**
 * This represents the type of stroke style token value
 * @see {@link https://tr.designtokens.org/format/#stroke-style}
 */
export type StrokeStyleTokenValue =
    | 'solid'
    | 'dashed'
    | 'dotted'
    | 'double'
    | 'groove'
    | 'ridge'
    | 'inset'
    | 'outset'
    | {
          dashArray: DimensionTokenValue[];
          lineCap: 'butt' | 'round' | 'square';
      }
    | AliasTokenValue;
