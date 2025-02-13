import { IFigmaClient } from '@design-system/figma-data-access';
import { getTokenPathsByFigmaKey } from '@design-system/token-path-config-utils';
import { VariableChange } from '@figma/rest-api-spec';

async function getFile(file_key: string, figmaClient: IFigmaClient) {
    return await figmaClient.getLocalVariables({ file_key: file_key }).catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error(`Error for file ${file_key}`);
        throw error;
    });
}

function convertToVariableName(name: string) {
    return name
        .toLowerCase()
        .replace(/(\s|\/)+/gi, '-')
        .replace(/_/gi, '-')
        .replace(/[^a-z\d-]/gi, '')
        .replace(/-{2,}/g, '-'); //replace double hyphen
}

// eslint-disable-next-line max-lines-per-function,sonarjs/cognitive-complexity
export async function runCodeSyntaxForFile(file_key: string, figmaClient: IFigmaClient) {
    const file = await getFile(file_key, figmaClient);
    const tokenPath = getTokenPathsByFigmaKey(file_key);
    if (!tokenPath) {
        throw new Error(`Figma file not assigned to theme ${file_key}!`);
    }

    const variableUpdates: VariableChange[] = [];

    for (const variableId in file.meta.variables) {
        if (!(variableId in file.meta.variables)) {
            continue;
        }
        const variable = file.meta.variables[variableId];
        if (variable.remote) {
            continue;
        }
        const variableCollection = file.meta.variableCollections[variable.variableCollectionId];

        // We only set to semantic and component tokens
        if (variableCollection.name.startsWith('semantic') && variableCollection.name !== 'semantic') {
            continue;
        }
        if (variableCollection.name.startsWith('reference')) {
            continue;
        }

        // We ignore utility tokens
        if (variableCollection.name.startsWith('utility')) {
            continue;
        }

        const cssNamePath = [variableCollection.name, ...variable.name.split('/')].map(convertToVariableName);
        if (variableCollection.name !== 'semantic') {
            cssNamePath.splice(0, 0, tokenPath.exportPrefix);
            cssNamePath.splice(2, 1);
        }
        const cssName = `var(--${cssNamePath.join('-')})`;

        if (variable.codeSyntax.WEB === cssName) {
            continue;
        }

        variableUpdates.push({
            action: 'UPDATE',
            id: variable.id,
            codeSyntax: {
                WEB: cssName,
            },
        });
    }

    console.info(`Updating ${variableUpdates.length} variables for ${file_key}.`);

    if (variableUpdates.length > 0) {
        await figmaClient
            .postVariables(
                { file_key: file_key },
                {
                    variables: variableUpdates,
                },
            )
            .catch((error: unknown) => {
                // eslint-disable-next-line no-console
                console.error(`Error updating file ${file_key}`);
                // eslint-disable-next-line no-console
                console.error(error);
                throw error;
            });
    }

    // eslint-disable-next-line no-console
    console.log(`Update finished for ${file_key}`);
}
