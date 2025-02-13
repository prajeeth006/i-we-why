import tinycolor from 'tinycolor2';

import { getReferenceFile, getSelectedOptionValue, getTheme, isDarkMode } from './state-manager';
import { staticMapRadius, staticMapSize, staticMapSocial, staticMapSpacing, staticMapTypography } from './static-mapping';

const oldColorSchema = ['100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100', '1200', '1300', '1400'];
const newColorSchema = ['5', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', '110', '120', '130'];

type ColorListEntryType = {
    color: tinycolor.Instance;
    reference?: string;
    referenceName?: string;
};

type ColorList = Record<string, ColorListEntryType[]>;

let colorListByPaletteCache: Record<string, ColorList> = {};
let colorPaletteOptionsReferenceFileCache: Record<string, string> = {};
let colorPaletteOptionsColorModeCache: Record<string, string> = {};

export async function computeColorListByPalette(value: string) {
    if (value in colorListByPaletteCache) {
        return colorListByPaletteCache[value];
    }
    const parts = value.split('_');
    const collectionId = parts[0];
    const modeId = parts[1];
    const colorVariant = parts[2];
    const isOld = parts[3] === 'old';
    const isLocal = parts[4] === 'local';

    const returnList: ColorList = {};

    let whiteVar: { color: tinycolor.Instance; referenceName: string; reference: string; variablePartName: string } | null = null;
    let blackVar: { color: tinycolor.Instance; referenceName: string; reference: string; variablePartName: string } | null = null;

    if (isLocal) {
        const variables = await figma.variables.getLocalVariablesAsync();
        for (const variable of variables) {
            if (variable.variableCollectionId != collectionId) {
                continue;
            }
            if (variable.name.startsWith('color') && variable.name.includes('neutrals')) {
                const isDark = colorVariant.startsWith('dark/');
                const isLight = colorVariant.startsWith('light/');
                const colorString = isDark ? 'color/dark/neutrals/' : isLight ? 'color/light/neutrals/' : 'color/neutrals/';
                const variableShortened = variable.name.replace(colorString, '');

                if (['white', '0'].includes(variableShortened)) {
                    whiteVar = await loadVar(variable.id, modeId, collectionId, false);
                    continue;
                } else if (['black', '140', '1500'].includes(variableShortened)) {
                    blackVar = await loadVar(variable.id, modeId, collectionId, false);
                    continue;
                }
            }
            if (!variable.name.startsWith(`color/${colorVariant}/`)) {
                continue;
            }
            const varLoaded = await loadVar(variable.id, modeId, collectionId, false);
            if (varLoaded == null) {
                continue;
            }

            if (isOld) {
                const index = oldColorSchema.findIndex((x) => x === varLoaded.variablePartName);
                if (index < 0) {
                    continue;
                }
                const colorGrade = newColorSchema[index];
                returnList[colorGrade] = [
                    {
                        color: varLoaded.color,
                        reference: varLoaded.reference,
                        referenceName: varLoaded.referenceName,
                    },
                ];
            } else {
                // Validate
                const index = ['0', ...newColorSchema, '140'].findIndex((x) => x === varLoaded.variablePartName);
                if (index < 0) {
                    continue;
                }
                returnList[varLoaded.variablePartName] = [
                    {
                        color: varLoaded.color,
                        reference: varLoaded.reference,
                        referenceName: varLoaded.referenceName,
                    },
                ];
            }
        }
    } else {
        const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collectionId);
        for (const variableExt of variables) {
            if (variableExt.name.startsWith('color') && variableExt.name.includes('neutrals')) {
                const isDark = colorVariant.startsWith('dark/');
                const isLight = colorVariant.startsWith('light/');
                const colorString = isDark ? 'color/dark/neutrals/' : isLight ? 'color/light/neutrals/' : 'color/neutrals/';
                const variableShortened = variableExt.name.replace(colorString, '');

                if (['white', '0'].includes(variableShortened)) {
                    whiteVar = await loadVar(variableExt.key, modeId, collectionId, true);
                    continue;
                } else if (['black', '140', '1500'].includes(variableShortened)) {
                    blackVar = await loadVar(variableExt.key, modeId, collectionId, true);
                    continue;
                }
            }
            if (!variableExt.name.startsWith(`color/${colorVariant}/`)) {
                continue;
            }
            const varLoaded = await loadVar(variableExt.key, modeId, collectionId, true);
            if (varLoaded == null) {
                continue;
            }
            if (isOld) {
                const index = oldColorSchema.findIndex((x) => x === varLoaded.variablePartName);
                if (index < 0) {
                    continue;
                }
                const colorGrade = newColorSchema[index];
                returnList[colorGrade] = [
                    {
                        color: varLoaded.color,
                        reference: varLoaded.reference,
                        referenceName: varLoaded.referenceName,
                    },
                ];
            } else {
                // Validate
                const index = ['0', ...newColorSchema, '140'].findIndex((x) => x === varLoaded.variablePartName);
                if (index < 0) {
                    continue;
                }
                returnList[varLoaded.variablePartName] = [
                    {
                        color: varLoaded.color,
                        reference: varLoaded.reference,
                        referenceName: varLoaded.referenceName,
                    },
                ];
            }
        }
    }

    if (!('0' in returnList)) {
        returnList['0'] = whiteVar != null ? [whiteVar] : [{ color: tinycolor({ r: 255, g: 255, b: 255 }) }];
    }
    if (!('140' in returnList)) {
        returnList['140'] = blackVar != null ? [blackVar] : [{ color: tinycolor({ r: 0, g: 0, b: 0 }) }];
    }

    colorListByPaletteCache[value] = returnList;

    return returnList;
}

export async function getMode(value: string) {
    // Example: color_mode: "VariableCollectionId:1:2_1:0_primary_new_local"
    const parts = value.split('_');
    const collectionId = parts[0];
    const modeId = parts[1];
    const isLocal = parts[4] === 'local';

    if (isLocal) {
        const col = await figma.variables.getVariableCollectionByIdAsync(collectionId);
        return col?.modes.find((mode) => mode.modeId === modeId)?.name;
    }

    const variables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collectionId);
    if (variables.length === 0) {
        return undefined;
    }
    const refVariable = await figma.variables.importVariableByKeyAsync(variables[0].key);
    const col = await figma.variables.getVariableCollectionByIdAsync(refVariable.variableCollectionId);
    return col?.modes.find((mode) => mode.modeId === modeId)?.name;
}

export function getReferencedColorPalette(value: string) {
    const parts = value.split('_');
    //const collectionId = parts[0];
    //const modeId = parts[1];
    //const colorVariant = parts[2];
    return parts[2];
}

export async function getColorPaletteOptions(type: 'reference_file' | 'color_mode', useCache = false) {
    if (useCache && Object.keys(colorPaletteOptionsReferenceFileCache).length > 0) {
        return type === 'reference_file' ? colorPaletteOptionsReferenceFileCache : colorPaletteOptionsColorModeCache;
    }

    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const teamCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const collectionAmount = collections.length + teamCollections.length;

    const modeOptions: Record<string, string> = {};
    const referenceOptions: Record<string, string> = {};
    const localVariables = await figma.variables.getLocalVariablesAsync();

    let counter = 1;
    for (const collection of collections) {
        await postStepUpdate(`Analyzing collection ${counter}/${collectionAmount}`);
        counter++;

        if (!collection.name.toLocaleLowerCase().startsWith('reference')) {
            continue;
        }
        const variableGroups: Record<string, string[]> = {};

        for (const variable of localVariables) {
            if (variable.variableCollectionId != collection.id) {
                continue;
            }
            if (!variable.name.startsWith('color/')) {
                continue;
            }
            const fragments = variable.name.split('/');
            let fragmentOffset = 0;
            if (fragments[1] === 'light' || fragments[1] === 'dark') {
                fragmentOffset = 1;
            }
            if (!(fragments.slice(1, 1 + fragmentOffset + 1).join('/') in variableGroups)) {
                variableGroups[fragments.slice(1, 1 + fragmentOffset + 1).join('/')] = [];
            }
            variableGroups[fragments.slice(1, 1 + fragmentOffset + 1).join('/')].push(fragments.slice(2 + fragmentOffset).join('/'));
        }

        const variableGroupKeys = Object.keys(variableGroups);
        const variableGroupConvention: Record<string, 'old' | 'new'> = {};

        for (const variableGroupKey of variableGroupKeys) {
            const isOld = oldColorSchema.filter((x) => variableGroups[variableGroupKey].indexOf(x) >= 0).length === oldColorSchema.length;
            const isNew = newColorSchema.filter((x) => variableGroups[variableGroupKey].indexOf(x) >= 0).length === newColorSchema.length;
            if (!isOld && !isNew) {
                delete variableGroups[variableGroupKey];
            }
            variableGroupConvention[variableGroupKey] = isNew ? 'new' : 'old';
        }

        for (const mode of collection.modes) {
            for (const variableGroupKey in variableGroups) {
                modeOptions[`${collection.id}_${mode.modeId}_${variableGroupKey}_${variableGroupConvention[variableGroupKey]}_local`] =
                    `${variableGroupKey}`;
                referenceOptions[`${collection.id}_${mode.modeId}_local`] = `${mode.name}`;
            }
        }
    }

    // Team Lib
    for (const collection of teamCollections) {
        await postStepUpdate(`Analyzing collection ${counter}/${collectionAmount}`);
        counter++;

        if (!collection.name.toLocaleLowerCase().startsWith('reference')) {
            continue;
        }
        const teamVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collection.key);
        if (teamVariables.length === 0) {
            continue;
        }
        const variableGroups: Record<string, string[]> = {};

        for (const teamVariable of teamVariables) {
            if (!teamVariable.name.startsWith('color/')) {
                continue;
            }
            const fragments = teamVariable.name.split('/');
            let fragmentOffset = 0;
            if (fragments[1] === 'light' || fragments[1] === 'dark') {
                fragmentOffset = 1;
            }
            if (!(fragments.slice(1, 1 + fragmentOffset + 1).join('/') in variableGroups)) {
                variableGroups[fragments.slice(1, 1 + fragmentOffset + 1).join('/')] = [];
            }
            variableGroups[fragments.slice(1, 1 + fragmentOffset + 1).join('/')].push(fragments.slice(2 + fragmentOffset).join('/'));
        }

        const variableGroupKeys = Object.keys(variableGroups);
        const variableGroupConvention: Record<string, 'old' | 'new'> = {};

        for (const variableGroupKey of variableGroupKeys) {
            const isOld = oldColorSchema.filter((x) => variableGroups[variableGroupKey].indexOf(x) >= 0).length === oldColorSchema.length;
            const isNew = newColorSchema.filter((x) => variableGroups[variableGroupKey].indexOf(x) >= 0).length === newColorSchema.length;
            if (!isOld && !isNew) {
                delete variableGroups[variableGroupKey];
            }
            variableGroupConvention[variableGroupKey] = isNew ? 'new' : 'old';
        }

        const exampleVariable = await figma.variables.importVariableByKeyAsync(teamVariables[0].key);
        const exampleCollection = await figma.variables.getVariableCollectionByIdAsync(exampleVariable.variableCollectionId);
        if (exampleCollection == null) {
            continue;
        }
        for (const mode of exampleCollection.modes) {
            for (const variableGroupKey in variableGroups) {
                modeOptions[`${collection.key}_${mode.modeId}_${variableGroupKey}_${variableGroupConvention[variableGroupKey]}_team`] =
                    `${variableGroupKey}`;
                referenceOptions[`${collection.key}_${mode.modeId}_team`] = `${mode.name}`;
            }
        }
    }

    // Reset caches if new palette is loaded.
    colorPaletteOptionsReferenceFileCache = referenceOptions;
    colorPaletteOptionsColorModeCache = modeOptions;
    colorListByPaletteCache = {};

    if (type === 'reference_file') {
        return referenceOptions;
    }
    return modeOptions;
}

async function loadVar(key: string, modeId: string, collectionId: string, isTeam: boolean) {
    const variable = isTeam ? await figma.variables.importVariableByKeyAsync(key) : await figma.variables.getVariableByIdAsync(key);
    if (variable == null) {
        return null;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value = variable.valuesByMode[modeId] as any;
    if (value == null) {
        return null;
    }
    let color: tinycolor.Instance | undefined = undefined;

    // We ignore aliases for now
    if ('r' in value && 'g' in value && 'b' in value) {
        color = tinycolor({ r: value.r * 255, g: value.g * 255, b: value.b * 255 });
    } else {
        return null;
    }

    const variableParts = variable.name.split('/');
    let offset = 2;
    if (variableParts[1] === 'light' || variableParts[1] === 'dark') {
        offset = 3;
    }
    const variablePartName = variableParts[offset];

    return {
        color: color,
        variablePartName: variablePartName,
        reference: collectionId + '_' + key + (isTeam ? '_team' : '_local'),
        referenceName: variable.name.toLowerCase().replace(/[\W_]+/g, '-'),
    };
}

async function postStepUpdate(msg: string) {
    figma.ui.postMessage({ message: msg, type: 'step-update' });
    await delay(10);
}

/**
 * Helper function to delay the execution of the code
 * @param time the time to delay the execution
 * @returns a promise that resolves after the time has passed
 */
function delay(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * Helper function to linking fixed options accordingly
 * @param config which options should be linked
 */
export async function linkFixedOptions(config: { social_colors: boolean; radius: boolean; spacing: boolean; sizing: boolean; typography: boolean }) {
    const value = getReferenceFile();
    const parts = value.split('_');
    const collectionId = parts[0];
    const mode = parts[1];
    const isLocal = parts[2] === 'local';

    // === Local vars start ===
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const semanticCollection = collections.find((x) => x.id === getSelectedOptionValue('target_collection'));
    if (semanticCollection == null) {
        figma.notify('Selected target collection does not exist anymore', { error: true });
        return;
    }
    const modeNamePart = await getMode(`${collectionId}_${mode}_1_1_${isLocal}`);
    const modeName = `${modeNamePart} ${getTheme().replace(' Mode', '').toLowerCase()}`;

    let modeId = semanticCollection.modes.find((mode) => mode.name === modeName)?.modeId;
    if (modeId == null) {
        modeId = semanticCollection.addMode(modeName);
    }
    const variablesLocal = await figma.variables.getLocalVariablesAsync();
    const semanticVariables = variablesLocal.filter((s) => s.variableCollectionId === semanticCollection.id);
    const semanticVariableByName: Record<string, Variable> = semanticVariables.reduce(
        (acc, cur) => ({
            ...acc,
            [cur.name]: cur,
        }),
        {} satisfies Record<string, Variable>,
    );
    // === Local vars end ===

    const mappings: Record<string, string[]> = {
        ...(config.social_colors ? staticMapSocial : {}),
        ...(config.radius ? staticMapRadius : {}),
        ...(config.spacing ? staticMapSpacing : {}),
        ...(config.sizing ? staticMapSize : {}),
        ...(config.typography ? staticMapTypography : {}),
    };

    const mappingsOk: Record<string, boolean> = Object.keys(mappings).reduce(
        (acc, cur) => ({ ...acc, [cur]: false }),
        {} satisfies Record<string, boolean>,
    );

    const relevantMappings: Record<string, string[]> = {};

    Object.entries(mappings).forEach(([semanticName, value]) => {
        value.forEach((referenceName) => {
            if (!(referenceName in relevantMappings)) {
                relevantMappings[referenceName] = [];
            }
            relevantMappings[referenceName].push(semanticName);
        });
    });

    let counter = 0;

    if (isLocal) {
        for (const variable of variablesLocal) {
            if (variable.variableCollectionId !== collectionId) {
                continue;
            }
            const name = variable.name.replace(`color/${isDarkMode() ? 'dark/' : 'light/'}`, 'color/');
            if (name in relevantMappings) {
                const variableAlias = figma.variables.createVariableAlias(variable);
                relevantMappings[name].forEach((semanticName) => {
                    if (!(semanticName in semanticVariableByName)) {
                        semanticVariableByName[semanticName] = figma.variables.createVariable(
                            semanticName,
                            semanticCollection,
                            variable.resolvedType,
                        );
                    }
                    semanticVariableByName[semanticName].setValueForMode(modeId!, { type: 'VARIABLE_ALIAS', id: variableAlias.id });
                    mappingsOk[semanticName] = true;
                    counter++;
                });
            }
        }
    } else {
        const variablesRemote = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(collectionId);
        for (const variable of variablesRemote) {
            const name = variable.name.replace(`color/${isDarkMode() ? 'dark/' : 'light/'}`, 'color/');
            if (name in relevantMappings) {
                const localVariable = await figma.variables.importVariableByKeyAsync(variable.key);
                const variableAlias = figma.variables.createVariableAlias(localVariable);
                relevantMappings[name].forEach((semanticName) => {
                    if (!(semanticName in semanticVariableByName)) {
                        semanticVariableByName[semanticName] = figma.variables.createVariable(
                            semanticName,
                            semanticCollection,
                            localVariable.resolvedType,
                        );
                    }
                    semanticVariableByName[semanticName].setValueForMode(modeId!, { type: 'VARIABLE_ALIAS', id: variableAlias.id });
                    mappingsOk[semanticName] = true;
                    counter++;
                });
            }
        }
    }

    let message = '';
    message += `<p>Successfully linked <strong>${counter}/${Object.keys(mappings).length}</strong> variables.</p>`;
    const notOk = Object.entries(mappingsOk).filter((x) => !x[1]);
    if (notOk.length > 0) {
        message += '<p>Following semantic variables could not be linked:</p>';
        message += '<ul>';
        notOk.forEach((x) => {
            message += `<li>${x[0]}</li>`;
        });
        message += '</ul>';
    }
    return message;
}

export function loadFixedLinkingOptions() {
    return [
        {
            name: 'Social Colors',
            key: 'social_colors',
            value: 'yes',
        },
        {
            name: 'Radius',
            key: 'radius',
            value: 'yes',
        },
        {
            name: 'Spacing',
            key: 'spacing',
            value: 'yes',
        },
        {
            name: 'Size',
            key: 'sizing',
            value: 'yes',
        },
        {
            name: 'Typography',
            key: 'typography',
            value: 'yes',
        },
    ];
}
