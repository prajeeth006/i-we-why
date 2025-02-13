// eslint-disable-next-line @nx/enforce-module-boundaries
import * as figma from '@figma/rest-api-spec';

import { getUtilityNames } from './utility.utils';
import { convertToVariableName } from './utils';

/**
 * This represents the boolean type of Figma in the internal representation
 */
type BooleanType = {
    type: 'BOOLEAN';
    value: boolean;
};

/**
 * This represents the string type of Figma in the internal representation
 */
type StringType = {
    type: 'STRING';
    value: string;
};

/**
 * This represents the number type of Figma in the internal representation
 */
type NumberType = {
    type: 'FLOAT';
    value: number;
};

/**
 * This represents the color type of Figma in the internal representation
 */
type ColorType = {
    type: 'COLOR';
    value: string;
};

/**
 * This represents the alias type of Figma in the internal representation
 */
type AliasType = {
    type: 'VARIABLE_ALIAS';
    value: string[];
};

/**
 * This represents the font weight type of Figma in the internal representation
 */
type FontWeightType = {
    type: 'FONT_WEIGHT';
    value: string;
};

/**
 * This represents the font family type of Figma in the internal representation
 */
type FontFamilyType = {
    type: 'FONT_FAMILY';
    value: string;
};

/**
 * This represents the shadow (effect) type of Figma in the internal representation
 */
type ShadowType = {
    type: 'SHADOW';
    value: string;
};

/**
 * This represents the typography group token, only aliases are allowed
 */
type TypographyType = {
    type: 'TYPOGRAPHY';
    value: {
        fontFamily: string[];
        fontSize: string[];
        fontWeight: string[];
        //letterSpacing: string[],
        lineHeight: string[];
    };
};

/**
 * This represents the internal representation of a variable without the name
 */
export type ExportType =
    | BooleanType
    | StringType
    | NumberType
    | ColorType
    | AliasType
    | FontWeightType
    | FontFamilyType
    | ShadowType
    | TypographyType;

/**
 * This represents Figma source of variable in the internal representation
 */
type SourceType = 'VARIABLE' | 'STYLE';

/**
 * This represents the internal representation of a variable with the name
 */
export type InternalVariableRepresentation = ExportType & {
    name: string[];
    collection: string;
    source: SourceType;
};

/**
 * This converts a color to a hex string
 * @param color
 */
export function convertColor(color: figma.RGBA) {
    const MAX_VALUE = 255;
    return rgbaToHex(
        Math.round(color.r * MAX_VALUE),
        Math.round(color.g * MAX_VALUE),
        Math.round(color.b * MAX_VALUE),
        Math.round(color.a * MAX_VALUE),
    );
}

/**
 * This function converts a rgba color to a hex string
 * @param r red between 0 and 255
 * @param g green between 0 and 255
 * @param b blue between 0 and 255
 * @param a alpha between 0 and 255
 */
function rgbaToHex(r: number, g: number, b: number, a = 255) {
    const shiftHelper1 = 24;
    const shiftHelper2 = 8;
    const shiftRed = 16;
    const shiftGreen = 8;
    const maxColor = 255;
    const hexRadix = 16;
    return `#${((1 << shiftHelper1) + (r << shiftRed) + (g << shiftGreen) + b).toString(shiftRed).slice(1)}${a === maxColor ? '' : ((1 << shiftHelper2) + a).toString(hexRadix).slice(1)}`;
}

/**
 * This function takes the response from figma API and converts it to the internal representation,
 * this is the following object
 * the name as [collectionName, mode, groupNames..., tokenName]
 * the value
 * the type
 * @param localVariablesResponse figma response
 */
export function convertFigmaJsonToInternalRepresentation(localVariablesResponse: figma.GetLocalVariablesResponse): InternalVariableRepresentation[] {
    // Iterate over all variables and convert to the internal representation
    return Object.values(localVariablesResponse.meta.variables).flatMap((variable) => {
        if (variable.remote) {
            // We do not want to export remote variables
            // We also do not know where they are coming from
            // TODO: check later, maybe a different solution is required
            return [];
        }
        if (variable.deletedButReferenced) {
            return [];
        }

        // Get the variable collection, so that we can iterate over the modes which are defined in the variable collection
        const variableCollection = localVariablesResponse.meta.variableCollections[variable.variableCollectionId];

        // Iterate over all modes so that we know the value of the variable for each mode and can convert it
        return variableCollection.modes.flatMap((mode) => {
            const value = variable.valuesByMode[mode.modeId];
            const variableCollectionName = convertToVariableName(variableCollection.name);

            // The name is the collection name, the mode name and the variable name
            const initName = [variableCollectionName, mode.name, ...variable.name.split('/').map(convertToVariableName)];

            let names = [initName];
            // We have to inject all utility tokens directly in Figma export to have correct deprecation handling
            // Thus we cannot do it only in generation step.
            if (variableCollectionName === 'utility') {
                const allUtilityNames = getUtilityNames(initName.slice(2).join('/'));
                names = allUtilityNames.map((utilityName) =>
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    [...initName.slice(0, 2), ...utilityName.split('/')],
                );
            }

            // The type is either the type of the variable or the type of the alias
            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            const type = (value as figma.VariableAlias).type ? 'VARIABLE_ALIAS' : variable.resolvedType;

            return names.map((name) => {
                let result: InternalVariableRepresentation = {
                    source: 'VARIABLE',
                } as InternalVariableRepresentation;

                switch (type) {
                    case 'VARIABLE_ALIAS': {
                        // For an alias we need to get the variable and the variable collection to get the name
                        // Note that the alias does not contain any mode as this is independent of the mode
                        // As a look ahead, we have to get rid of the mode in the variable name at some point in the process
                        const alias = value as figma.VariableAlias;

                        if (!(alias.id in localVariablesResponse.meta.variables)) {
                            throw new Error(`Variable reference for ${name.join('.')} could not be resolved`);
                        }
                        const aliasVariable = localVariablesResponse.meta.variables[alias.id];

                        const aliasVariableCollection = localVariablesResponse.meta.variableCollections[aliasVariable.variableCollectionId];
                        result = {
                            ...result,
                            collection: variableCollectionName,
                            name: name,
                            type: type,
                            value: [convertToVariableName(aliasVariableCollection.name), ...aliasVariable.name.split('/').map(convertToVariableName)],
                        };

                        break;
                    }
                    case 'COLOR':
                        result = {
                            ...result,
                            collection: variableCollectionName,
                            name: name,
                            type: type,
                            value: convertColor(variable.valuesByMode[mode.modeId] as figma.RGBA),
                        };

                        break;

                    case 'STRING':
                        result = {
                            ...result,
                            collection: variableCollectionName,
                            name: name,
                            type: type,
                            value: variable.valuesByMode[mode.modeId] as string,
                        };

                        break;

                    case 'BOOLEAN':
                        result = {
                            ...result,
                            collection: variableCollectionName,
                            name: name,
                            type: type,
                            value: variable.valuesByMode[mode.modeId] as boolean,
                        };

                        break;

                    case 'FLOAT':
                        result = {
                            ...result,
                            collection: variableCollectionName,
                            name: name,
                            type: type,
                            value: variable.valuesByMode[mode.modeId] as number,
                        };

                        break;

                    default:
                        // This is to trigger an error in case Figma adds new types, and we do not support them
                        throw new Error('Invalid type');
                }
                return result;
            });
        });
    });
}
