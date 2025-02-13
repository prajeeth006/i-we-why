import { InternalVariableRepresentation } from './convert-figma-json-to-internal-representation.utils';
import { removeInvalidChars } from './utils';

export type GroupExtractorResult = {
    group: string | null;
    posToRemove: number[];
};
export type GroupExtractor = (variable: InternalVariableRepresentation) => GroupExtractorResult;

/**
 * This is a helper function to split the internal representation by mode
 * It creates a group name of the collection name and the mode name (first two parts of the variable name)
 * And removes the mode from the variable name
 * @param variable
 */
export function themingSplitByMode(variable: InternalVariableRepresentation): GroupExtractorResult {
    const var2 = variable;
    // Variable name has to consist of brand and theme
    if (!var2.name[1].includes(' ')) {
        var2.name[1] = var2.name[1] + (var2.source === 'STYLE' ? ' style' : ' default');
    }
    return {
        group: `${var2.name[0]} ${removeInvalidChars(var2.name[1])}`,
        posToRemove: [1],
    };
}

/**
 * This is a helper function to not split the internal representation.
 * It enables the processing of the variable, with the next group extractor
 */
export function themingNoSplit(): GroupExtractorResult {
    return {
        group: null,
        posToRemove: [],
    };
}

/**
 * This function groups the internal representation by theme and remove the theme modifiers according to passed groupExtractors
 * @param internalVariables the internal representation of the variables from the figma file
 * @param groupExtractors the extractors passed to group the variables accordingly
 */
export function groupInternalRepresentationByTheme(
    internalVariables: InternalVariableRepresentation[],
    groupExtractors: GroupExtractor[],
): Record<string, InternalVariableRepresentation[]> {
    const groups: Record<string, InternalVariableRepresentation[]> = {};

    // Iterate over all variables and group them
    internalVariables.forEach((variable) => {
        // Used to check whether a group has been found for the variable to detect errors or missing extractors,
        // as each variable has to be grouped by at least one extractor
        let groupFound = false;
        // Iterate over all group extractors and check whether the variable can be grouped
        for (const groupExtractor of groupExtractors) {
            // Extract the group
            const groupExtractorResult = groupExtractor(variable);
            // If the group is not null, add the variable to the group and stop iterating over the extractors
            // If the group is null, continue iterating over the extractors
            if (groupExtractorResult.group != null) {
                // Create group if not exists
                if (!(groupExtractorResult.group in groups)) {
                    groups[groupExtractorResult.group] = [];
                }

                // Remove the parts of the variable name which are not needed anymore
                const copyName = [...variable.name];
                for (const posToRemove of groupExtractorResult.posToRemove.sort().reverse()) {
                    copyName.splice(posToRemove, 1);
                }

                // Add the variable to the group
                groups[groupExtractorResult.group].push({
                    ...variable,
                    name: copyName,
                });
                groupFound = true;
                break;
            }
        }
        if (!groupFound) {
            throw new Error(`no group found for variable ${variable.name.join('.')}`);
        }
    });
    return groups;
}
