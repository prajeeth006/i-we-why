/**
 * Checks if the mode of the variable alias is the same as the mode of the variable that contains the alias reference
 * @param referencedCollection the collection that is referenced with in the alias
 * @param referencedVariable  the variable that is referenced with in the alias
 * @param modeName  the mode we are checking
 * @param variableName the variable name that we are checking
 * @param collectionName the collection name that we are checking
 * @param checkModes whether modes should be checked whether they match
 * @returns an object describing whether the check was successful (type success), not successful (error) or in case something could not be found (warning)
 */
async function verifySameMode(
    referencedCollection: VariableCollection,
    referencedVariable: Variable,
    modeName: string,
    variableName: string,
    collectionName: string,
    checkModes: boolean,
) {
    const modeWithSameNameExists =
        referencedCollection.modes.filter((referencedMode) => referencedMode.name.split(' ')[0] === modeName.split(' ')[0]).length > 0;
    const isSemanticParentCollection = (await figma.variables.getLocalVariableCollectionsAsync()).some((x) => x.name === modeName);

    if (!modeWithSameNameExists && !isSemanticParentCollection) {
        // Is it relevant, i.e., checkModes is true?
        if (checkModes) {
            return {
                type: 'error',
                message: `Variable <strong>${variableName}</strong> in collection <strong>${collectionName}</strong> and mode <strong>${modeName}</strong> references variable ${referencedVariable.name} in collection ${referencedCollection.name} but the mode ${modeName.split(' ')[0]} does not exist in the referenced collection which contains the modes ${referencedCollection.modes.map((referencedMode) => referencedMode.name.split(' ')[0]).join(', ')}`,
            };
        }
    } else if (isSemanticParentCollection) {
        if (referencedCollection.name != modeName) {
            return {
                type: 'error',
                message: `Variable <strong>${variableName}</strong> in collection <strong>${collectionName}</strong> and mode <strong>${modeName}</strong> references variable ${referencedVariable.name} in collection ${referencedCollection.name} but should reference collection with name ${modeName}`,
            };
        }
        if (referencedVariable.name != variableName) {
            return {
                type: 'error',
                message: `Variable <strong>${variableName}</strong> in collection <strong>${collectionName}</strong> and mode <strong>${modeName}</strong> references variable ${referencedVariable.name} in collection ${referencedCollection.name} but should reference variable with name ${variableName}`,
            };
        }
    }

    return {
        type: 'success',
        message: '',
    };
}

/**
 * Looks up the variable and collection that is referenced in the alias
 * @param variableAlias the variable alias to be checked
 * @returns an object describing whether the check was successful (type success), not successful (error) or in case something could not be found (warning)
 */
async function getReferenceVariableAndCollection(
    variableAlias: VariableAlias,
): Promise<{ type: 'success'; referencedVariable: Variable; referencedCollection: VariableCollection } | { type: 'warning'; message: string }> {
    const referencedVariable = await figma.variables.getVariableByIdAsync(variableAlias.id);
    if (referencedVariable == null) {
        return {
            type: 'warning',
            message: `Variable ${variableAlias.id} not found`,
        };
    }
    const referencedCollection = await figma.variables.getVariableCollectionByIdAsync(referencedVariable.variableCollectionId);
    if (referencedCollection == null) {
        return {
            type: 'warning',
            message: `Collection ${referencedVariable.variableCollectionId} not found`,
        };
    }

    return { type: 'success', referencedVariable, referencedCollection };
}

/**
 * The reference is local so no need to check remote collection.
 * However, we have to check if variable exists in local collection
 * @param referencedCollection the collection that is referenced with in the alias
 * @param referencedVariable  the variable that is referenced with in the alias
 * @param modeName  the mode we are checking
 * @param variableName the variable name that we are checking
 * @param collectionName the collection name that we are checking
 * @returns an object describing whether the check was successful (type success), not successful (error) or in case something could not be found (warning)
 */
function verifyLocalCollection(
    referencedCollection: VariableCollection,
    referencedVariable: Variable,
    modeName: string,
    variableName: string,
    collectionName: string,
) {
    const variableExists = referencedCollection.variableIds.filter((variableId) => variableId === referencedVariable.id).length > 0;

    if (!variableExists) {
        return {
            type: 'error',
            message: `Variable <strong>${variableName}</strong> in collection <strong>${collectionName}</strong> and mode <strong>${modeName}</strong> references variable ${referencedVariable.name} in collection ${referencedCollection.name} but the variable does not exist.`,
        };
    }

    return {
        type: 'success',
        message: '',
    };
}

/**
 * It is a remote collection, so we have to check if the variable exists in the remote collection
 * And ensure it is still ok with current published collection
 * @param variablesPerTeamCollections the variables of external collections
 * @param referencedCollection the collection that is referenced with in the alias
 * @param referencedVariable  the variable that is referenced with in the alias
 * @param modeName  the mode we are checking
 * @param variableName the variable name that we are checking
 * @param collectionName the collection name that we are checking
 * @returns an object describing whether the check was successful (type success), not successful (error) or in case something could not be found (warning)
 */
function verifyRemoteCollection(
    variablesPerTeamCollections: Record<string, { variableNames: string[]; collection: LibraryVariableCollection }>,
    referencedCollection: VariableCollection,
    referencedVariable: Variable,
    modeName: string,
    variableName: string,
    collectionName: string,
) {
    const teamCollection = variablesPerTeamCollections[referencedCollection.key];
    if (teamCollection == null) {
        return {
            type: 'error',
            message: 'Referenced collection not found in team library',
        };
    }
    const variableExists = teamCollection.variableNames.filter((variableName) => variableName === referencedVariable.name).length > 0;

    if (!variableExists) {
        return {
            type: 'error',
            message: `Variable <strong>${variableName}</strong> in collection <strong>${collectionName}</strong> and mode <strong>${modeName}</strong> references variable ${referencedVariable.name} in collection ${referencedCollection.name} but in the current published version the variable does not exist anymore. Please update the library if it is not updated yet and run the plugin again. If the same error appears again, update the reference of the variable.`,
        };
    }

    return {
        type: 'success',
        message: '',
    };
}

/**
 * This function checks a specific alias variable whether the reference is correct.
 * @param variableAlias the variable alias to be checked
 * @param modeName the mode to be checked if checkModes is enabled
 * @param variableName the name of the variable that contains the alias reference
 * @param collectionName the name of the collection that contains the variable that contains the alias reference
 * @param variablesPerTeamCollections the variables of external collections
 * @param checkModes whether modes should be checked whether they match
 * @param isComponent whether we check for a component file
 * @returns an object describing whether the check was successful (type success), not successful (error) or in case something could not be found (warning)
 */
async function verifyAlias(
    variableAlias: VariableAlias,
    modeName: string,
    variableName: string,
    collectionName: string,
    variablesPerTeamCollections: Record<string, { variableNames: string[]; collection: LibraryVariableCollection }>,
    checkModes: boolean,
    isComponent: boolean = false,
) {
    const result = await getReferenceVariableAndCollection(variableAlias);
    if (result.type != 'success') {
        return result;
    }
    const { referencedVariable, referencedCollection } = result;

    if (isComponent && referencedCollection.name.startsWith('reference')) {
        return {
            type: 'error',
            message: `Variable <strong>${variableName}</strong> in collection <strong>${collectionName}</strong> and mode <strong>${modeName}</strong> references variable ${referencedVariable.name} in collection ${referencedCollection.name}. A reference to a <strong>reference</strong> collection is not allowed inside a component collection.`,
        };
    }

    const sameModeResult = await verifySameMode(referencedCollection, referencedVariable, modeName, variableName, collectionName, checkModes);

    if (sameModeResult.type !== 'success') {
        return sameModeResult;
    }
    if (!referencedCollection.remote) {
        return verifyLocalCollection(referencedCollection, referencedVariable, modeName, variableName, collectionName);
    }

    return verifyRemoteCollection(variablesPerTeamCollections, referencedCollection, referencedVariable, modeName, variableName, collectionName);
}

/**
 * Analyzes the collection names and returns the type of the file
 * @returns the type of the file
 */
async function getFileType() {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();

    const isReference = collections.some((c) => c.name.toLowerCase().startsWith('reference'));
    const semanticCollections = collections.filter((c) => c.name.toLowerCase().startsWith('semantic'));

    if (isReference && collections.length === 1) {
        return 'reference';
    }

    if (semanticCollections.length > 0 && collections.length === semanticCollections.length) {
        return 'semantic';
    }

    if (semanticCollections.length === 0 && !isReference) {
        return 'component';
    }

    return 'all';
}

/**
 * Helper function to check if the same mode checkbox should be marked as true
 * @returns whether the same mode checkbox should be marked as true when the plugin is opened
 */
async function shouldCheckSameMode() {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    return collections.filter((c) => c.name.toLowerCase().startsWith('reference') || c.name.toLowerCase().startsWith('semantic')).length > 0;
}

/**
 * Helper function to send the result to the UI
 * @param errors the list of errors
 * @param warnings the list of warnings
 * @param isProgress whether the result is a progress update or the final result
 */
async function sendUiResult(errors: string[], warnings: string[], isProgress: boolean = false) {
    let returnMessage = '';
    if (errors.length > 0) {
        returnMessage += `<strong>Errors:</strong><ul class='danger'><li>${errors.join('</li><li>')}</li></ul>`;
    }

    if (warnings.length > 0) {
        returnMessage += `<strong>Warnings:</strong><ul class='warning'><li>${warnings.join('</li><li>')}</li></ul>`;
        warnings.push('No warnings found');
    }

    if (errors.length === 0 && warnings.length === 0) {
        returnMessage += "<strong class='success'>No issues detected</strong>";
    }

    if (isProgress) {
        await sendUpdate(returnMessage);
    } else {
        figma.ui.postMessage({ message: returnMessage, type: 'check-variables-result' });
    }
}

/**
 * Helper function to send an update to the UI
 * @param message the message to be sent to the UI
 */
async function sendUpdate(message: string) {
    figma.ui.postMessage({ message, type: 'check-variables-result-progress' });
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
 * A helper function to load the collections and variables of external collections
 * @returns a promise that resolves to the collections and variables of external collections
 */
async function loadCollections() {
    // We go over collections as some variables are still in the document in case the collection is removed
    await sendUpdate('Loading collections...');
    const collections = await figma.variables.getLocalVariableCollectionsAsync();

    const teamCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const variablesPerTeamCollections: Record<string, { variableNames: string[]; collection: LibraryVariableCollection }> = {};

    let teamCollectionCounter = 0;
    for (const teamCollection of teamCollections) {
        teamCollectionCounter++;
        const variableNames = (await figma.teamLibrary.getVariablesInLibraryCollectionAsync(teamCollection.key)).map((variable) => variable.name);
        variablesPerTeamCollections[teamCollection.key] = {
            variableNames,
            collection: teamCollection,
        };
        if (teamCollectionCounter % 5 === 0) {
            await sendUpdate(`Loading collections ${teamCollectionCounter}/${teamCollections.length}`);
        }
    }

    await sendUpdate('Collections loaded');

    return { collections, variablesPerTeamCollections };
}

/**
 * Checks if the collection names are correct depending on the fileTypeValue
 * @param fileTypeValue which kind of file we are checking
 * @param collections list of collections
 * @returns a list of errors if the collection names are not correct
 */
function verifyCollectionNames(fileTypeValue: string, collections: VariableCollection[]) {
    const errors: string[] = [];
    if (fileTypeValue != 'all') {
        for (const collection of collections) {
            const collectionName = collection.name.toLocaleLowerCase();

            if (!collectionName.startsWith(fileTypeValue) && ['reference', 'semantic'].some((s) => s === fileTypeValue)) {
                errors.push(`collection ${collection.name} not allowed in ${fileTypeValue} file`);
            } else if (
                !['reference', 'semantic'].some((s) => s === fileTypeValue) &&
                ['reference', 'semantic'].some((s) => collectionName.startsWith(s))
            ) {
                errors.push(`collection ${collection.name} not allowed in ${fileTypeValue} file`);
            }
        }
    }

    const semanticCollections = collections.filter((x) => x.name.startsWith('semantic'));
    const semanticModes = semanticCollections.flatMap((x) => x.modes.map((y) => y.name));
    const findDuplicates = (arr: string[]) => {
        const sortedArr = [...arr].sort(); // You can define the comparing function here.
        // JS by default uses a crappy string compare.
        // (we use slice to clone the array so the
        // original array won't be modified)
        const results = [];
        for (let i = 0; i < sortedArr.length - 1; i++) {
            if (sortedArr[i + 1] == sortedArr[i]) {
                results.push(sortedArr[i]);
            }
        }
        return results;
    };
    const dupModes = findDuplicates(semanticModes);

    if (dupModes.length > 0) {
        errors.push(`found same mode in semantic collections, which is not allowed: ${dupModes.join(', ')}`);
    }
    return errors;
}

/**
 * Main function to verify a complete collection
 * @param collection the collection to be verified
 * @param variablesPerTeamCollections the variables of external collections
 * @param checkModes whether modes should be checked whether they match
 * @param collectionInfo a string that describes the collection in the progress
 * @returns a list of errors and warnings
 */
// eslint-disable-next-line complexity
async function verifyCollection(
    collection: VariableCollection,
    variablesPerTeamCollections: Record<
        string,
        {
            variableNames: string[];
            collection: LibraryVariableCollection;
        }
    >,
    checkModes: boolean,
    collectionInfo: string,
) {
    const errors: string[] = [];
    const warnings: string[] = [];

    let variableCounter = 0;
    const isComponentCollection = !['reference', 'semantic'].some((s) => collection.name.startsWith(s));

    const isSemanticCollection = ['semantic'].some((s) => collection.name.startsWith(s));

    // Check that each mode has exactly one space
    for (const mode of collection.modes) {
        if (modeSelectionStorage.selectedMode && modeSelectionStorage.selectedCollection && mode.modeId != modeSelectionStorage.selectedMode) {
            continue;
        }
        if (isSemanticCollection) {
            if (mode.name.split(' ').length != 2 && !(await figma.variables.getLocalVariableCollectionsAsync()).some((x) => x.name == mode.name)) {
                errors.push(`Mode ${mode.name} should have following naming convention "{brand} {theme}" (exactly one space)`);
            }
        }
    }

    for (const variableId of collection.variableIds) {
        variableCounter++;
        const variable = await figma.variables.getVariableByIdAsync(variableId);

        if (variable == null) {
            warnings.push(`Variable ${variableId} not found`);
            continue;
        }

        for (const mode of collection.modes) {
            if (modeSelectionStorage.selectedMode && modeSelectionStorage.selectedCollection && mode.modeId != modeSelectionStorage.selectedMode) {
                continue;
            }
            const variableValue: VariableValue = variable.valuesByMode[mode.modeId];
            if (typeof variableValue == 'object' && 'type' in variableValue && variableValue.type === 'VARIABLE_ALIAS') {
                const result = await verifyAlias(
                    variableValue,
                    mode.name,
                    variable.name,
                    collection.name,
                    variablesPerTeamCollections,
                    checkModes && !isComponentCollection,
                    isComponentCollection,
                );
                if (result.type === 'warning') {
                    warnings.push(result.message);
                } else if (result.type === 'error') {
                    errors.push(result.message);
                }
            }
        }

        if (variableCounter % 20 === 0) {
            await sendUiResult(
                errors,
                [`Ongoing scan, collection ${collectionInfo}, variable ${variableCounter}/${collection.variableIds.length}`, ...warnings],
                true,
            );
        }
    }

    return { errors, warnings };
}

/**
 * This function checks all variables in the document
 * @param msg the message that contains the fileTypeValue and checkModes value from the UI.
 */
async function checkVariables(msg: Record<string, any>) {
    // We go over collections as some variables are still in the document in case the collection is removed
    const { collections, variablesPerTeamCollections } = await loadCollections();

    const warnings: string[] = [];
    const errors: string[] = [];

    verifyCollectionNames(msg['fileTypeValue'], collections).forEach((error) => errors.push(error));

    let collectionCounter = 0;
    for (const collection of collections) {
        collectionCounter++;

        if (modeSelectionStorage.selectedCollection && collection.id != modeSelectionStorage.selectedCollection) {
            continue;
        }

        const verificationResult = await verifyCollection(
            collection,
            variablesPerTeamCollections,
            msg['checkModes'],
            `${collectionCounter}/${collections.length}`,
        );
        verificationResult.errors.forEach((error) => errors.push(error));
        verificationResult.warnings.forEach((warning) => warnings.push(warning));

        await sendUiResult(errors, [`Ongoing scan, collection ${collectionCounter}/${collections.length}`, ...warnings], true);
    }

    await sendUiResult(errors, warnings);
}

/**
 * Function to handle the message from the UI asynchronously
 * @param msg the message from the UI
 */
async function processMessage(msg: Record<string, any>) {
    if (msg['type'] === 'check-variables') {
        await checkVariables(msg);
    }

    if (msg['type'] === 'mode-selection-form-update') {
        // Reset before
        modeSelectionStorage.selectedCollection = undefined;
        modeSelectionStorage.selectedCollection = msg['selectedCollection'] as string | undefined;
        // Reset before
        modeSelectionStorage.selectedMode = undefined;
        modeSelectionStorage.selectedMode = msg['selectedMode'] as string | undefined;
        await renderSelectionDialog();
    }
}

const modeSelectionStorage: {
    selectedCollection?: string;
    selectedMode?: string;
} = {};

async function renderSelectionDialog() {
    const variableCollections = await figma.variables.getLocalVariableCollectionsAsync();
    let message = '<h3>Restrict to collection or mode</h3>';

    message += "<form style='display: flex; flex-direction: column; gap: 12px;'>";
    message += "<select name='selectedCollection'>";
    message += `<option value='' ${modeSelectionStorage.selectedCollection === undefined ? 'selected' : ''}>Select a variable collection</option>`;
    variableCollections.forEach((variableCollection) => {
        message += `<option value="${variableCollection.id}" ${modeSelectionStorage.selectedCollection === variableCollection.id ? 'selected' : ''}>${variableCollection.name}</option>`;
    });
    message += '</select>';

    if (modeSelectionStorage.selectedCollection) {
        const variableCollection = variableCollections.find((variableCol) => variableCol.id === modeSelectionStorage.selectedCollection);
        message += "<select name='selectedMode'>";
        message += `<option value='' ${modeSelectionStorage.selectedMode === undefined ? 'selected' : ''}>Select a mode</option>`;
        variableCollection?.modes.forEach((mode) => {
            message += `<option value="${mode.modeId}" ${modeSelectionStorage.selectedMode === mode.modeId ? 'selected' : ''}>${mode.name}</option>`;
        });
        message += '</select>';
    }

    message += '</form>';

    figma.ui.postMessage({ message: message, type: 'mode-selection-dialog' });
}

/**
 * Start the plugin and send the initial message to the UI
 */
figma.showUI(__html__, { width: 800, height: 400, themeColors: true });

async function init() {
    figma.ui.postMessage({ message: await shouldCheckSameMode(), type: 'check-same-mode-result' });
    figma.ui.postMessage({ message: await getFileType(), type: 'file-type-result' });
    renderSelectionDialog();
}
// eslint-disable-next-line unicorn/prefer-top-level-await
init().then(() => {});

/**
 * Define the message handler for the UI
 * @param msg the message from the UI
 */
figma.ui.onmessage = (msg: Record<string, any>) => {
    processMessage(msg).then(() => {});
};
