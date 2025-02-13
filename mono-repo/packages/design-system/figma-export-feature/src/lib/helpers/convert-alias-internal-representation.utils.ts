import { InternalVariableRepresentation } from './convert-figma-json-to-internal-representation.utils';

export type VariableAliasConverterResult = string[] | null;
export type VariableAliasConverter = (value: string[]) => VariableAliasConverterResult;

/**
 * This function renames all variable aliases according to the passed variableAliasConverters
 * @param internalVariables the internal representation of the variables from the figma file
 * @param variableAliasConverters the converters passed to rename the alias variable values
 */
export function convertAliasInternalRepresentation(
    internalVariables: InternalVariableRepresentation[],
    variableAliasConverters: VariableAliasConverter[],
): InternalVariableRepresentation[] {
    // Iterate over all variables and rename the alias variables
    return internalVariables.map((variable) => {
        if (variable.type === 'VARIABLE_ALIAS') {
            // Iterate over all converters (provided to the function) and return the first result that is not null
            for (const variableAliasConverter of variableAliasConverters) {
                const variableAliasConverterResult = variableAliasConverter(variable.value);
                if (variableAliasConverterResult != null) {
                    return {
                        ...variable,
                        value: variableAliasConverterResult,
                    };
                }
            }

            return variable;
        } else if (typeof variable.value === 'object') {
            const newVar: InternalVariableRepresentation = {
                ...variable,
                value: {
                    ...variable.value,
                },
            };
            Object.entries(variable.value).forEach(([key, value]) => {
                for (const variableAliasConverter of variableAliasConverters) {
                    const variableAliasConverterResult = variableAliasConverter(value);
                    if (variableAliasConverterResult != null) {
                        (newVar.value as Record<string, any>)[key] = variableAliasConverterResult;
                    }
                }
            });

            return newVar;
        } else {
            return variable;
        }
    });
}
