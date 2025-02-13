import { TokenType } from './token-variants';

/**
 * This represents the metadata of a token
 */
export type MetaData = {
    $type?: TokenType;
    $description?: string;
    $extensions?: Record<string, unknown>;
};
