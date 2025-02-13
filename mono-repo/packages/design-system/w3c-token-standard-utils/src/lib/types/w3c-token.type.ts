import { MetaData } from './metadata.type';
import {
    AliasTokenValue,
    BorderTokenValue,
    ColorTokenValue,
    CubicBezierTokenValue,
    DimensionTokenValue,
    DurationTokenValue,
    FontFamilyTokenValue,
    FontWeightTokenValue,
    GradientTokenValue,
    NumberTokenValue,
    ShadowTokenValue,
    StrokeStyleTokenValue,
    TransitionTokenValue,
    TypographyTokenValue,
} from './token-variants';

/**
 * This represents the type of token
 * @see {@link https://tr.designtokens.org/format/#design-token-0}
 */
export type W3CToken = MetaData & {
    $value: // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    | AliasTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | ColorTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | DimensionTokenValue
        | FontFamilyTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | FontWeightTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | DurationTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | CubicBezierTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | NumberTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | StrokeStyleTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | BorderTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | TransitionTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | ShadowTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | GradientTokenValue
        // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
        | TypographyTokenValue;
};
