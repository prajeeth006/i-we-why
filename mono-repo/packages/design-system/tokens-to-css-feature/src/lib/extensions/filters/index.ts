import { Filter, TransformedToken } from 'style-dictionary/types';

import { GLOBAL_TOKEN_NAME, SEMANTIC_TOKEN_NAME } from '../../constants.utils.js';

/**
 * Checks if the token is a semantic token
 */
const semanticFilter: Filter = {
    name: 'isSemanticToken',
    filter: (token: TransformedToken) => (token.attributes?.['category'] as string | undefined)?.startsWith(SEMANTIC_TOKEN_NAME) ?? false,
};

/**
 * Checks if the token is a global token
 */
const globalFilter: Filter = {
    name: 'isGlobalToken',
    filter: (token: TransformedToken) => (token.attributes?.['category'] as string | undefined)?.startsWith(GLOBAL_TOKEN_NAME) ?? false,
};

const componentFilter: Filter = {
    name: 'isComponent',
    filter: (token: TransformedToken) =>
        !(token.attributes?.['category'] as string | undefined)?.startsWith(SEMANTIC_TOKEN_NAME) &&
        !(token.attributes?.['category'] as string | undefined)?.startsWith(GLOBAL_TOKEN_NAME),
};

const filters: Filter[] = [semanticFilter, globalFilter, componentFilter];

export default filters;
