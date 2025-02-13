import { Config, Dictionary, Format, LocalOptions, OutputReferences, TransformedToken } from 'style-dictionary/types';
import { getReferences, usesReferences } from 'style-dictionary/utils';

import { deprecatedMixins, deprecatedVariables } from '../../side-channel.js';
import { SIZES_INFO, SIZES_INFO_COPY, SIZES_INFO_UNIT } from '../../sizes-info.js';
import { getSelectorName, getTokensForProperty, removePrefix } from './utility.utils.js';

/** We have to write a custom formatter to have fallback values support
 * as well as to support deprecated comments.
 *
 * This example follows the changelog where an example is provided for json
 * one should be able to handle this with the customPropertyFormatter,
 * but the provided typescript types do not support this option
 * @see https://amzn.github.io/style-dictionary/#/version_3?id=output-references
 **/

function isDeprecated(token: TransformedToken) {
    if ('$extensions' in token) {
        const extensions = token['$extensions'];
        if ('com.entaingroup.ext-figma' in extensions) {
            const ourExt = extensions['com.entaingroup.ext-figma'];
            if ('status' in ourExt && ourExt.status === 'deprecated') {
                return true;
            }
        }
    }
    return false;
}

function getDeprecatedDate(token: TransformedToken) {
    if ('$extensions' in token) {
        const extensions = token['$extensions'];
        if ('com.entaingroup.ext-figma' in extensions) {
            const ourExt = extensions['com.entaingroup.ext-figma'];
            if ('status_changed_at' in ourExt) {
                return ourExt.status_changed_at as string;
            }
        }
    }
    return '';
}

function variableMapper(
    dictionary: Dictionary,
    options: { outputReferences?: OutputReferences; outputReferenceFallbacks?: boolean; componentTokenPrefix: string },
    tokens: TransformedToken[],
    intention: string = '',
    isSemantic: boolean = false,
    renderAsVariable: boolean = true,
) {
    const { outputReferenceFallbacks, outputReferences } = options;

    const tokensInternal = tokens.sort((a, b) => a.name.localeCompare(b.name));

    return tokensInternal
        .map((token) => {
            let comment = '';
            let comment2 = '';
            const varPrefix = isSemantic ? '' : `${options.componentTokenPrefix}-`;
            const varName = `${varPrefix}${token.name}`;

            if (isDeprecated(token) && renderAsVariable) {
                comment = `${intention}/** @deprecated This token is no longer available in Figma (${getDeprecatedDate(token)}) */
`;
                deprecatedVariables.push(`--${varName}`);
            }

            const shouldOutputRefs =
                usesReferences(token.original.$value) &&
                ((typeof outputReferences === 'function' ? outputReferences(token, { dictionary, usesDtcg: true }) : outputReferences) ?? false);

            // This is kind of a special logic, as this is generated until no further changes are applied recursively
            // It is needed as certain kind of variables are required to be generated without a unit for some extensions
            // such as ngx-scrollbar. As this variable depends on the semantic layer, it is important to already
            // define variables with different unit there.
            if (varName in SIZES_INFO) {
                const postFix = `-${SIZES_INFO[varName]}`;
                SIZES_INFO_UNIT[varName + postFix] = SIZES_INFO[varName];
                const entry = {
                    from: [...token.path],
                    to: [...token.path],
                    toName: varName + postFix,
                    hasReference: shouldOutputRefs,
                };
                entry.to[entry.to.length - 1] += postFix;
                SIZES_INFO_COPY[varName] = entry;
            }

            if (shouldOutputRefs) {
                let value = token.$value;
                const refs = getReferences(token.original.$value, dictionary.unfilteredTokens ?? dictionary.tokens);

                // Same logic as above command to handle references correctly so that they exist
                if (varName in SIZES_INFO) {
                    refs.forEach((ref) => {
                        // We skip over already added tokens
                        if (ref.name in SIZES_INFO_COPY) {
                            return;
                        }
                        const postFix = `-${SIZES_INFO[varName]}`;
                        const refEntry = {
                            from: [...ref.path],
                            to: [...ref.path],
                            toName: ref.name + postFix,
                            hasReference: false, // We always set to false here, and update in case in next round
                        };
                        refEntry.to[refEntry.to.length - 1] += postFix;
                        SIZES_INFO_COPY[ref.name] = refEntry;
                        SIZES_INFO_UNIT[ref.name + postFix] = SIZES_INFO[varName];
                        SIZES_INFO[ref.name] = SIZES_INFO[varName];
                    });
                }

                // Logic to handle composite tokens
                if (typeof token.$value === 'object' && typeof token.original.$value === 'object') {
                    // Reset back to original one
                    Object.entries(token.original.$value).forEach(([valueKey, valueValue]) => {
                        value[valueKey] = valueValue;
                    });
                    refs.forEach((ref) => {
                        const refVarName = `{${ref.path.join('.')}}`;
                        Object.keys(value).forEach((valueKey) => {
                            value[valueKey] = `${value[valueKey]}`.replace(refVarName, ref.name);
                        });
                    });
                } else {
                    refs.forEach((ref) => {
                        value = `${value}`.replace(ref.$value, ref.name);
                    });
                }

                // Logic to handle composite tokens
                if (typeof token.$value === 'object') {
                    let output = '';
                    Object.keys(value).forEach((valueKey) => {
                        output += outputReferenceFallbacks
                            ? `${comment}${intention}${renderAsVariable ? '--' : ''}${varName}-${valueKey}: var(--${value[valueKey]}, ${token.$value[valueKey]});`
                            : `${comment}${intention}${renderAsVariable ? '--' : ''}${varName}-${valueKey}: var(--${value[valueKey]});`;
                    });
                    return output;
                }
                return outputReferenceFallbacks
                    ? `${comment}${intention}${renderAsVariable ? '--' : ''}${varName}: var(--${value}, ${token.$value});`
                    : `${comment}${intention}${renderAsVariable ? '--' : ''}${varName}: var(--${value});`;
            }

            /* For knowing the original variable for not cleaning up deprecated variables that are used indirectly in semantic file */
            if (usesReferences(token.original.$value)) {
                let value = `${token.$value}`; // in case of numbers convert to string
                const refs = getReferences(token.original.$value, dictionary.unfilteredTokens ?? dictionary.tokens);
                refs.forEach((ref) => {
                    value = value.replace(ref.$value, function () {
                        return ref.name;
                    });
                });
                comment2 = `/*var(--${value})*/`;
            }

            // We could handle this in transform, but then we have to trace back until reference which is a performance overhead
            // Therefore we decided to add the unit change in custom formatter.
            if (varName in SIZES_INFO_UNIT) {
                return `${comment}${intention}${renderAsVariable ? '--' : ''}${varName}: ${token.$value.replace(/[^\d.-]/g, '')};${comment2}`;
            }
            return `${comment}${intention}${renderAsVariable ? '--' : ''}${varName}: ${token.$value};${comment2}`;
        })
        .join('\n');
}

const utilityFormat: Format = {
    name: 'customUtilityScss',
    format: ({ dictionary, options }) => {
        const optionsCasted = options as Config & LocalOptions & { componentTokenPrefix: string };

        const all = dictionary.allTokens.flatMap((token) => {
            if (!token.attributes?.['type']) {
                return [];
            }
            const tokenType = token.attributes['type'] as string;
            let comment = '';
            const selectorName = removePrefix(getSelectorName(tokenType).replace(tokenType, token.name.slice('utility-'.length)));

            if (isDeprecated(token)) {
                // Put it as var name, this ensures deprecation app will always pick it up
                // As it is a class we do not know when we can delete it,
                //deprecatedVariables.push(`--${token.name}`);
                comment = `/** @deprecated This utility class is no longer available in Figma (${getDeprecatedDate(token)}). Token for not getting deleted: --${token.name} */\n`;
            }
            const tokens = getTokensForProperty(tokenType, token);
            return [`${comment}.${selectorName} {\n${variableMapper(dictionary, optionsCasted, tokens, '    ', true, false)}\n}`];
        });

        return all.join('\n\n');
    },
};

/**
 * This formatter is used for a specific component (like btn)
 * It will group the tokens by type (i.e. second group level in figma) and create a css class for each group
 */
const componentScssFormat: Format = {
    name: 'customComponentScss',
    format: ({ dictionary, options }) => {
        const optionsCasted = options as Config & LocalOptions & { componentTokenPrefix: string };

        const componentGroups: Record<string, TransformedToken[]> = {};

        // We group the tokens by type (i.e. first group level in figma)
        dictionary.allTokens.forEach((token) => {
            const componentGroupKey = ((token.attributes?.['type'] ?? '') as string).replace(/-{2,}/g, '-');
            if (!(componentGroupKey in componentGroups)) {
                componentGroups[componentGroupKey] = [];
            }
            componentGroups[componentGroupKey].push(token);
        });

        // We create a scss mixin for each group
        const groupStrings = Object.entries(componentGroups).map(([componentGroupKey, componentGroup]) => {
            // We rename the name to remove the component group prefix
            const transformedComponentGroup: TransformedToken[] = componentGroup.map((token) => {
                let tokenName = token.name;
                if (token.attributes?.['category'] && token.attributes['type']) {
                    const categoryShortened = (token.attributes['category'] as string).replace(/-{2,}/g, '-');
                    const typeShortened = (token.attributes['type'] as string).replace(/-{2,}/g, '-');
                    tokenName =
                        token.name.slice(0, Math.max(0, categoryShortened.length)) +
                        token.name.slice(Math.max(0, categoryShortened.length + typeShortened.length + 1));
                }

                return {
                    ...token,
                    name: tokenName,
                };
            });

            // We want to use the existing formattedValue for not taking care about outputReference logic etc.
            // We have to create a new dictionary overriding allTokens (compare with source code of style-dictionary)

            const formattedNew = variableMapper(dictionary, optionsCasted, transformedComponentGroup, '    ', false);

            const componentName = (componentGroup[0].attributes?.['category'] ?? '') as string;

            const isDeprecatedMixin = transformedComponentGroup.every((token) => isDeprecated(token));
            if (isDeprecatedMixin) {
                deprecatedMixins.push(`${componentName}.${componentGroupKey}`);
            }
            return `${isDeprecatedMixin ? '/** @deprecated This mixin is no longer available in Figma */\n' : ''}@mixin ${componentGroupKey} {\n${formattedNew}\n}`;
        });

        return `${groupStrings.join('\n\n')}\n`;
    },
};

/**
 * It generates a css file from the token (in comparison to StyleDictionary's css/variables formatter one can provide a css selector and default values)
 */
const customThemeCss: Format = {
    name: 'customThemeCss',
    format: ({ dictionary, options }) => {
        const optionsCasted = options as Config & LocalOptions & { componentTokenPrefix: string };
        const customFormatted = variableMapper(dictionary, optionsCasted, dictionary.allTokens, '    ', true);

        return `${options['cssSelector'] ?? ':root'} {\n${customFormatted}\n}`;
    },
};

const formatters = [customThemeCss, componentScssFormat, utilityFormat];

export default formatters;
