import { AliasTokenValue } from './alias.type';
import { CubicBezierTokenValue } from './cubic-bezier.type';
import { DurationTokenValue } from './duration.type';

/**
 * This represents the type of transition token value
 * @see {@link https://tr.designtokens.org/format/#transition}
 */
export type TransitionTokenValue =
    | {
          duration: DurationTokenValue;
          delay: DurationTokenValue;
          timingFunction: CubicBezierTokenValue;
      }
    | AliasTokenValue;
