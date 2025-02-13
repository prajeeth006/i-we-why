const movementStorage: {
    sourceCollection?: string;
    sourceMode?: string;
    targetCollection?: string;
} = {};

async function renderMovementDialog() {
    const variableCollections = await figma.variables.getLocalVariableCollectionsAsync();
    let message = '<h2>Movement Dialog</h2>';
    message +=
        '<p>This plugin allows you to move modes between collections. Please be aware that variables pointing to this mode, which will be moved, will not be updated. However, it updates references inside the mode that points to the same collection to itself.</p>';

    message += "<form style='display: flex; flex-direction: column; gap: 12px;'>";
    message += "<input type='hidden' name='type' value='renderMovementDialog'>";
    message += "<select name='sourceCollection'>";
    message += `<option value='' ${movementStorage.sourceCollection === undefined ? 'selected' : ''}>Select a variable collection</option>`;
    variableCollections.forEach((variableCollection) => {
        message += `<option value="${variableCollection.id}" ${movementStorage.sourceCollection === variableCollection.id ? 'selected' : ''}>${variableCollection.name}</option>`;
    });
    message += '</select>';

    if (movementStorage.sourceCollection) {
        const variableCollection = variableCollections.find((variableCol) => variableCol.id === movementStorage.sourceCollection);
        message += "<select name='sourceMode'>";
        message += `<option value='' ${movementStorage.sourceMode === undefined ? 'selected' : ''}>Select a source mode</option>`;
        variableCollection?.modes.forEach((mode) => {
            message += `<option value="${mode.modeId}" ${movementStorage.sourceMode === mode.modeId ? 'selected' : ''}>${mode.name}</option>`;
        });
        message += '</select>';
    }

    message += "<select name='targetCollection'>";
    message += `<option value='' ${movementStorage.targetCollection === undefined ? 'selected' : ''}>Select a target variable collection</option>`;
    variableCollections.forEach((variableCollection) => {
        message += `<option value="${variableCollection.id}" ${movementStorage.targetCollection === variableCollection.id ? 'selected' : ''}>${variableCollection.name}</option>`;
    });
    message += '</select>';

    if (movementStorage.sourceCollection && movementStorage.targetCollection && movementStorage.sourceMode) {
        message += "<button type='submit'>Move</button>";
    }

    message += '</form>';

    return message;
}

function renderRelinkSemantics() {
    let message = '<h2>Relink Semantics</h2>';
    message +=
        "<p>Relink semantics links a collection named 'semantic-{name}' to each mode column named 'semantic-{name}' in any semantic collection (collection name starting with semantic). It also creates missing variables across all semantic collections.</p>";

    message += "<form style='display: flex; flex-direction: column;'>";
    message += "<input type='hidden' name='type' value='renderRelinkSemantics'>";
    message += "<button type='submit'>Relink semantics</button>";
    message += '</form>';
    return message;
}

async function renderAll() {
    let message = await renderMovementDialog();
    message += '<hr>';
    message += renderRelinkSemantics();

    figma.ui.postMessage({
        type: 'renderMovementDialog',
        data: message,
    });
}

async function renderInProgress() {
    figma.ui.postMessage({
        type: 'renderInProgress',
        data: 'Please wait...',
    });
    await sleep(100);
}

async function createMissingVarNames(sourceCollection: VariableCollection, targetCollection: VariableCollection) {
    const variables = await figma.variables.getLocalVariablesAsync();
    // Check variables
    const sourceVariables = variables.filter((variable) => variable.variableCollectionId === sourceCollection.id);
    const targetVariablesBeforeCreation = variables.filter((variable) => variable.variableCollectionId === targetCollection.id);

    // Ensure that the target collection has a subset of the source collection
    const sourceVariableNames = new Set(sourceVariables.map((variable) => variable.name));
    const targetVariableNames = targetVariablesBeforeCreation.map((variable) => variable.name);

    if (targetVariableNames.some((variableName) => !sourceVariableNames.has(variableName))) {
        figma.notify(
            `The target contains variables that are not in the source collection ${targetVariableNames.filter((variableName) => !sourceVariableNames.has(variableName)).join(', ')}`,
            { error: true },
        );
        throw new Error('The target contains variables that are not in the source collection.');
    }

    // Create missing variables
    sourceVariables.forEach((sourceVariable) => {
        if (!targetVariablesBeforeCreation.some((targetVariable) => targetVariable.name === sourceVariable.name)) {
            figma.variables.createVariable(sourceVariable.name, targetCollection, sourceVariable.resolvedType);
        }
    });
}

async function submitMovementDialog() {
    if (
        movementStorage.sourceCollection === undefined ||
        movementStorage.sourceMode === undefined ||
        movementStorage.targetCollection === undefined
    ) {
        return;
    }

    const sourceCollection = await figma.variables.getVariableCollectionByIdAsync(movementStorage.sourceCollection);
    const targetCollection = await figma.variables.getVariableCollectionByIdAsync(movementStorage.targetCollection);
    if (!sourceCollection || !targetCollection) {
        return;
    }
    const sourceMode = sourceCollection.modes.find((mode) => mode.modeId === movementStorage.sourceMode);
    if (!sourceMode) {
        return;
    }

    await createMissingVarNames(sourceCollection, targetCollection);

    const variables = await figma.variables.getLocalVariablesAsync();
    const sourceVariables = variables.filter((variable) => variable.variableCollectionId === sourceCollection.id);
    const targetVariables = variables.filter((variable) => variable.variableCollectionId === targetCollection.id);
    const targetModeId = targetCollection.modes.find((mode) => mode.name === sourceMode.name)?.modeId ?? targetCollection.addMode(sourceMode.name);

    sourceVariables.forEach((sourceVariable) => {
        const targetVariable = targetVariables.find((targetVar) => targetVar.name === sourceVariable.name);
        if (!targetVariable) {
            figma.notify('Variable not found', { error: true });
            throw new Error('Variable not found');
        }
        const value = sourceVariable.valuesByMode[sourceMode.modeId];

        // Copy reference in its own collection
        if (typeof value === 'object' && 'type' in value) {
            //value["type"] === "VARIABLE_ALIAS" check not needed
            const referencedVariable = sourceVariables.find((referenceVariable) => referenceVariable.id === value.id);
            if (referencedVariable) {
                const targetReferencedVariable = targetVariables.find((targetVar) => targetVar.name === referencedVariable.name);
                if (targetReferencedVariable) {
                    const alias = figma.variables.createVariableAlias(targetReferencedVariable);
                    targetVariable.setValueForMode(targetModeId, alias);
                    return;
                }
            }
        }
        targetVariable.setValueForMode(targetModeId, sourceVariable.valuesByMode[sourceMode.modeId]);
    });

    sourceCollection.removeMode(sourceMode.modeId);
    movementStorage.sourceMode = undefined;

    figma.notify('Variables copied successfully', { error: false });
}

async function syncVarNames(allSemanticCollections: VariableCollection[]) {
    const allVariables = await figma.variables.getLocalVariablesAsync();
    const allVariablesInSemanticCollections = allVariables.filter((variable) =>
        allSemanticCollections.map((x) => x.id).includes(variable.variableCollectionId),
    );

    const varTypes: Record<string, VariableResolvedDataType> = {};
    allVariablesInSemanticCollections.forEach((variable) => {
        if (variable.name in varTypes && varTypes[variable.name] !== variable.resolvedType) {
            figma.notify(`Variable ${variable.name} has conflicting types. Please resolve the conflict manually`, { error: true });
            throw new Error(`Variable ${variable.name} has conflicting types. Please resolve the conflict manually`);
        }
        varTypes[variable.name] = variable.resolvedType;
    });

    allSemanticCollections.forEach((variableCollection) => {
        const variables = allVariables.filter((variable) => variable.variableCollectionId === variableCollection.id);
        Object.entries(varTypes).forEach(([varName, varType]) => {
            if (variables.some((variable) => variable.name === varName)) {
                return;
            }
            figma.variables.createVariable(varName, variableCollection, varType);
        });
    });
}

function relinkSemanticMode(modeId: string, variables: Variable[], referenceVariables: Variable[]) {
    variables.forEach((variable) => {
        const value = variable.valuesByMode[modeId];
        if (typeof value === 'object' && 'type' in value) {
            // && value["type"] === "VARIABLE_ALIAS" not needed in check
            const referencedVariable = referenceVariables.find((referenceVariable) => referenceVariable.id === value.id);
            if (referencedVariable?.name === variable.name) {
                return;
            }
        }
        const variableReference = referenceVariables.find((referenceVariable) => referenceVariable.name === variable.name);
        if (variableReference) {
            variable.setValueForMode(modeId, figma.variables.createVariableAlias(variableReference));
        } else {
            figma.notify(`Variable ${variable.name} not found`, { error: true });
        }
    });
}

async function relinkSemantics() {
    const variableCollections = await figma.variables.getLocalVariableCollectionsAsync();

    // Parent collection
    const semanticCollection = variableCollections.find((variableCollection) => variableCollection.name.toLocaleLowerCase() === 'semantic');
    if (!semanticCollection) {
        figma.notify("No semantic collection found. Please create a collection called 'semantic'", { error: true });
        return;
    }

    const allSemanticCollections = variableCollections.filter((variableCollection) =>
        variableCollection.name.toLocaleLowerCase().startsWith('semantic'),
    );

    await syncVarNames(allSemanticCollections);

    const allVariables = await figma.variables.getLocalVariablesAsync();

    allSemanticCollections.forEach((variableCollection) => {
        const modes = variableCollection.modes;
        const variables = allVariables.filter((variable) => variable.variableCollectionId === variableCollection.id);
        modes.forEach((mode) => {
            const isSemanticReference = allSemanticCollections.find((x) => x.name.toLocaleLowerCase() === mode.name.toLocaleLowerCase());
            if (isSemanticReference == null) {
                return;
            }
            const referenceVariables = allVariables.filter((variable) => variable.variableCollectionId === isSemanticReference.id);
            relinkSemanticMode(mode.modeId, variables, referenceVariables);
        });
    });
}

async function init() {
    await renderAll();
}

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

type RenderMovementMessage = {
    type: 'renderMovementDialog';
    sourceCollection?: string;
    sourceMode?: string;
    targetCollection?: string;
};

type RenderRelinkSemantics = {
    type: 'renderRelinkSemantics';
};

type MessageData = RenderMovementMessage | RenderRelinkSemantics;

async function handleMessage(msg: { type: string; data: MessageData }) {
    await renderInProgress();

    if (msg.type === 'form-update') {
        if (msg.data.type === 'renderMovementDialog') {
            movementStorage.sourceCollection = msg.data.sourceCollection;
            movementStorage.sourceMode = msg.data.sourceMode;
            movementStorage.targetCollection = msg.data.targetCollection;
            await renderAll();
        }
        if (msg.data.type === 'renderRelinkSemantics') {
            await renderAll();
        }
    }

    if (msg.type === 'form-submit') {
        if (msg.data.type === 'renderMovementDialog') {
            movementStorage.sourceCollection = msg.data.sourceCollection;
            movementStorage.sourceMode = msg.data.sourceMode;
            movementStorage.targetCollection = msg.data.targetCollection;
            await submitMovementDialog();
            await renderAll();
        }
        if (msg.data.type === 'renderRelinkSemantics') {
            await relinkSemantics();
            await renderAll();
        }
    }
}

const WINDOW_WIDTH = 600;
const WINDOW_HEIGHT = 600;
figma.showUI(__html__, { themeColors: true, width: WINDOW_WIDTH, height: WINDOW_HEIGHT });

figma.ui.on('message', (msg: { type: string; data: MessageData }) => {
    handleMessage(msg)
        .then(() => {
            // Ignore
        })
        .catch(() => {
            initWrapper();
        });
});

function initWrapper() {
    init()
        .then(() => {
            //Ignore
        })
        .catch(console.error);
}

initWrapper();
