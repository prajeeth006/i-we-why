// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).
// This shows the HTML page in "ui.html".
import { InternalVariable } from './internal-variable';
import { varListRadius } from './radius-list';
import { varListSize } from './size-list';
import { varListSpace } from './space-list';
import { varListTypography } from './typography-list';

figma.showUI(__html__, { width: 800, height: 600, themeColors: true });

type CreateVarData = {
    force: boolean;
    createSizeVariables: boolean;
    createSpaceVariables: boolean;
    createRadiusVariables: boolean;
    createTypographyVariables: boolean;
};

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
// posted message.
// eslint-disable-next-line functional/immutable-data,unicorn/prefer-add-event-listener
figma.ui.onmessage = (msg: { type: string; createVarData: CreateVarData }) => {
    // One way of distinguishing between different types of messages sent from
    // your HTML page is to use an object with a "type" property like this.
    handleMessage(msg)
        .then(() => {
            //Ignore
        })
        .catch(console.error);
};

async function handleMessage(msg: { type: string; createVarData: CreateVarData }) {
    if (msg.type === 'create-variables') {
        try {
            const answer = await createVars(msg.createVarData);
            figma.ui.postMessage({
                message: `Successfully executed (created: ${answer.created}, updated ${answer.updated})`,
                type: 'create-variables-result',
            });
        } catch (error) {
            console.log(error);
            figma.ui.postMessage({ message: 'Variables could not be created', type: 'create-variables-result' });
            return;
        }
    }
}

const varList: InternalVariable[] = [...varListSpace, ...varListRadius, ...varListSize, ...varListTypography];

async function createVars(createVarData: CreateVarData) {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const referenceCollection = collections.find((x) => x.name.startsWith('reference')) ?? figma.variables.createVariableCollection('reference');

    if (referenceCollection.modes.length === 0) {
        referenceCollection.addMode('default');
    } else if (referenceCollection.modes.length > 1) {
        throw new Error('Reference collection should only have one mode');
    }

    const mode = referenceCollection.modes[0];
    const modeId = mode.modeId;

    const localVariables = await figma.variables.getLocalVariablesAsync();

    // eslint-disable-next-line functional/no-let
    let updatedCounter = 0;
    // eslint-disable-next-line functional/no-let
    let createdCounter = 0;

    varList.forEach((varEntry) => {
        if (varEntry.category === 'SPACE' && !createVarData.createSpaceVariables) {
            return;
        }
        if (varEntry.category === 'RADIUS' && !createVarData.createRadiusVariables) {
            return;
        }
        if (varEntry.category === 'SIZE' && !createVarData.createSizeVariables) {
            return;
        }
        if (varEntry.category === 'TYPOGRAPHY' && !createVarData.createTypographyVariables) {
            return;
        }
        // eslint-disable-next-line functional/no-let
        let variable = localVariables.find(
            (localVariable) => localVariable.variableCollectionId === referenceCollection.id && localVariable.name === varEntry.name,
        );
        // eslint-disable-next-line functional/no-let
        let created = false;
        if (variable == null) {
            variable = figma.variables.createVariable(varEntry.name, referenceCollection, varEntry.type);
            created = true;
        }

        if (created || (createVarData.force && variable.valuesByMode[modeId] !== varEntry.value)) {
            variable.setValueForMode(modeId, varEntry.value);
            if (created) {
                createdCounter++;
            } else {
                updatedCounter++;
            }
        }
    });

    return {
        created: createdCounter,
        updated: updatedCounter,
    };
}
