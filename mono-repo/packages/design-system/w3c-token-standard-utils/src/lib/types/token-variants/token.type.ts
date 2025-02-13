/**
 * This represents the current token types supported by W3C.
 * We do not use all of them at the moment as Figma has limited support for them.
 */
export type TokenType =
    | 'color'
    | 'dimension'
    | 'fontFamily'
    | 'fontWeight'
    | 'duration'
    | 'cubicBezier'
    | 'number'
    | 'strokeStyle'
    | 'border'
    | 'transition'
    | 'shadow'
    | 'gradient'
    | 'typography';
