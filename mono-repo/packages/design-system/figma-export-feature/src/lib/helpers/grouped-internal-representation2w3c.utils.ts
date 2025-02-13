import { W3CGroup, W3CToken, W3CTokenDocument } from '@design-system/w3c-token-standard-utils';

import { InternalVariableRepresentation } from './convert-figma-json-to-internal-representation.utils';

function getUsedFontWeightFromText(simplifiedWeight: string) {
    let usedValue = simplifiedWeight;
    switch (simplifiedWeight) {
        case 'extralight':
            usedValue = 'extra-light';
            break;
        case 'ultralight':
            usedValue = 'ultra-light';
            break;
        case 'semibold':
            usedValue = 'semi-bold';
            break;
        case 'demibold':
            usedValue = 'demi-bold';
            break;
        case 'extrabold':
            usedValue = 'extra-bold';
            break;
        case 'ultrabold':
            usedValue = 'ultra-bold';
            break;
        case 'extrablack':
            usedValue = 'extra-black';
            break;
        case 'ultrablack':
            usedValue = 'ultra-black';
            break;
    }
    return usedValue;
}

/**
 This function converts the Figma export of variables to the W3C standard (draft).
 Date of the draft: 2023-07-24 (https://tr.designtokens.org/format)
 Figma API documentation version: 2023-09-20 (https://www.figma.com/developers/api#changelog)
 */
export function convertGroupedInternalRepresentationToW3CStandard(
    groupedInternalRepresentation: Record<string, InternalVariableRepresentation[]>,
): Record<string, W3CTokenDocument> {
    const drafts: Record<string, W3CTokenDocument> = {};

    // Iterate over all internal representations of variables and convert them to the W3C standard
    // We do this by iterating over all themes and then over all variables
    // eslint-disable-next-line sonarjs/cognitive-complexity
    Object.entries(groupedInternalRepresentation).forEach(([themeName, tokens]) => {
        const result: W3CTokenDocument = {};

        // Iterate over all variables and convert them to the W3C standard
        for (const token of tokens) {
            const path = token.name.slice(0, -1);
            const tokenName = token.name.at(-1);
            // Not valid token
            if (tokenName == null) {
                continue;
            }

            let finalGroup = result;

            // Select group recursively to add token
            path.forEach((name) => {
                // create group if not exists
                if (!(name in finalGroup)) {
                    finalGroup[name] = {};
                }
                finalGroup = finalGroup[name] as W3CGroup;
            });

            let w3cToken: W3CToken;

            // Set default status to active (later can be overwritten by deprecated)
            const extensions = {
                'com.entaingroup.ext-figma': {
                    status: 'active',
                    collection: token.collection,
                },
            };

            const joinedName = token.name.join('-');

            switch (token.type) {
                case 'VARIABLE_ALIAS': {
                    const refPath = token.value.join('.');
                    w3cToken = {
                        $value: `{${refPath}}`,
                        $extensions: extensions,
                    };

                    break;
                }
                case 'COLOR':
                    w3cToken = {
                        $type: 'color',
                        $value: token.value,
                        $extensions: extensions,
                    };

                    break;

                case 'STRING':
                    if (joinedName.includes('family')) {
                        w3cToken = {
                            $type: 'fontFamily',
                            $value: token.value,
                            $extensions: extensions,
                        };
                    } else if (joinedName.includes('weight')) {
                        const simplifiedWeight = token.value.toLowerCase().replace(/[^a-z]/g, '');
                        const usedValue = getUsedFontWeightFromText(simplifiedWeight);
                        w3cToken = {
                            $type: 'fontWeight',
                            $value: usedValue,
                            $extensions: extensions,
                        };
                    } else {
                        //console.warn(`Unsupported token type ${token.type}, token name: ${token.name.join('.')}, skipping token`);
                        continue;
                    }

                    break;

                case 'BOOLEAN':
                    w3cToken = {
                        $type: 'number',
                        $value: token.value ? 1 : 0,
                        $extensions: extensions,
                    };

                    break;

                case 'FLOAT':
                    w3cToken = joinedName.includes('weight')
                        ? {
                              $type: 'fontWeight',
                              $value: token.value,
                              $extensions: extensions,
                          }
                        : {
                              $type: 'number',
                              $value: token.value,
                              $extensions: extensions,
                          };
                    break;
                case 'FONT_FAMILY':
                    w3cToken = {
                        $type: 'fontFamily',
                        $value: token.value,
                        $extensions: extensions,
                    };

                    break;

                case 'FONT_WEIGHT':
                    w3cToken = {
                        $type: 'fontWeight',
                        $value: token.value,
                        $extensions: extensions,
                    };

                    break;

                case 'SHADOW':
                    w3cToken = {
                        $type: 'shadow',
                        $value: token.value,
                        $extensions: extensions,
                    };

                    break;
                case 'TYPOGRAPHY':
                    w3cToken = {
                        $type: 'typography',
                        $value: {
                            fontFamily: `{${token.value.fontFamily.join('.')}}`,
                            fontWeight: `{${token.value.fontWeight.join('.')}}`,
                            fontSize: `{${token.value.fontSize.join('.')}}`,
                            lineHeight: `{${token.value.lineHeight.join('.')}}`,
                            letterSpacing: `0px`,
                        },
                        $extensions: extensions,
                    };
                    break;
                default:
                    throw new Error('Unknown type');
            }

            finalGroup[tokenName] = w3cToken;
        }

        drafts[themeName] = result;
    });

    return drafts;
}
