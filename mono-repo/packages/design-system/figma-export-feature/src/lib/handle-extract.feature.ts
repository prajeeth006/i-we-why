import { IFigmaClient } from '@design-system/figma-data-access';
import { W3CTokenDocument } from '@design-system/w3c-token-standard-utils';

import {
    compareAndAddDeprecated,
    componentGroupExtractor,
    convertAliasInternalRepresentation,
    convertFigmaJsonToInternalRepresentation,
    convertGroupedInternalRepresentationToW3CStandard,
    convertStyleNodeJsonToInternalRepresentation,
    convertToVariableName,
    deleteOldTokens,
    getWriteableFiles,
    globalAliasConverter,
    globalSplitter,
    groupInternalRepresentationByTheme,
    loadExistingToken,
    loadExistingTokens,
    semanticSplitter,
    sortObject,
    storeNewTokens,
} from './helpers';

async function handleExtractHelper(fileKey: { fileKey: string; originalFileKey?: string }, figmaClient: IFigmaClient) {
    // Get Variables from Figma Local Variable Endpoint
    const localVariablesResponse = await figmaClient.getLocalVariables({ file_key: fileKey.fileKey }).catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error(`Error for file ${fileKey.fileKey}`);
        throw error;
    });

    // Convert to internal representation, by combining variable collections and variables to have the real values
    const mutableInternalRepresentation = convertFigmaJsonToInternalRepresentation(localVariablesResponse).filter((internalRepresentation) => {
        // Figma 40 modes+ support
        // Step 1: We ignore figma helper collections in the sense that the mode is not allowed to start with semantic
        if (!internalRepresentation.collection.startsWith('semantic')) {
            return true;
        }
        return !internalRepresentation.name[1].startsWith('semantic');
    });

    // Figma 40 modes+ support
    // Step 2: We rename all semantic collections to semantic, so that they are all part of same folder
    mutableInternalRepresentation.forEach((internalRepresentation) => {
        if (internalRepresentation.collection.startsWith('semantic')) {
            internalRepresentation.collection = 'semantic';
            internalRepresentation.name[0] = 'semantic';
        }
        //Also fix alias values to point to changed collection
        if (internalRepresentation.type === 'VARIABLE_ALIAS' && internalRepresentation.value[0].startsWith('semantic')) {
            internalRepresentation.value[0] = 'semantic';
        }
    });

    const styles = await fetchStyles(fileKey.originalFileKey ?? fileKey.fileKey, figmaClient);
    const nodeIds = styles
        .filter((v) => v.style_type === 'TEXT' || v.style_type === 'EFFECT')
        .map((v) => v.node_id)
        .join(',');

    if (nodeIds.length > 0) {
        const response = await figmaClient
            .getFileNodes({ file_key: fileKey.originalFileKey ?? fileKey.fileKey }, { ids: nodeIds })
            .catch((error: unknown) => {
                // eslint-disable-next-line no-console
                console.error(`Error getting file nodes for file ${fileKey.fileKey}`);
                throw error;
            });

        const hasUtility = Object.values(localVariablesResponse.meta.variableCollections).some((x) => x.name === 'utility');

        //We don't care, if it is not a utility based file to save time
        const localVariablesResponse2 =
            hasUtility && fileKey.originalFileKey
                ? await figmaClient.getLocalVariables({ file_key: fileKey.originalFileKey }).catch((error: unknown) => {
                      // eslint-disable-next-line no-console
                      console.error(`Error for file ${fileKey.fileKey}`);
                      throw error;
                  })
                : localVariablesResponse;

        const convertedRepresentation: Record<string, string> = hasUtility
            ? Object.fromEntries(
                  Object.values(localVariablesResponse2.meta.variables).map((x) => [
                      x.id,
                      [localVariablesResponse2.meta.variableCollections[x.variableCollectionId].name, ...x.name.split('/')]
                          .map(convertToVariableName)
                          .join('/'),
                  ]),
              )
            : {};

        const stylesInternalRep = convertStyleNodeJsonToInternalRepresentation(response, convertedRepresentation, hasUtility);
        mutableInternalRepresentation.push(...stylesInternalRep);
    }

    // For Alias values, we want to remove some parts (matching the removal of the groups afterward)
    const aliasConvertedInternalRepresentation = convertAliasInternalRepresentation(mutableInternalRepresentation, [globalAliasConverter]);

    // For each design system layer, we require different grouping and variable names, we apply functions that handle this here
    const groupedInternalRepresentation = groupInternalRepresentationByTheme(aliasConvertedInternalRepresentation, [
        globalSplitter,
        semanticSplitter,
        componentGroupExtractor,
    ]);

    // The grouped representation is transformed to the W3C Token Standard
    return {
        fileKey,
        data: convertGroupedInternalRepresentationToW3CStandard(groupedInternalRepresentation),
    };
}

export async function handleExtractWithDeprecationToken(
    fileKeys: { fileKey: string; originalFileKey?: string }[],
    figmaClient: IFigmaClient,
    existingDrafts: Record<string, W3CTokenDocument>,
    options: {
        deprecateFileOnly: boolean;
    } = { deprecateFileOnly: false },
) {
    const w3cDrafts = await handleExtractInternalOnly(fileKeys, figmaClient);

    let withDeprecation: Record<string, W3CTokenDocument>;

    if (options.deprecateFileOnly) {
        const draftKeys = new Set(Object.keys(w3cDrafts).map((x) => x.split('_')[0]));
        const partialExistingDrafts: Record<string, W3CTokenDocument> = Object.fromEntries(
            Object.entries(existingDrafts).filter((x) => draftKeys.has(x[0].split('_')[0])),
        );

        withDeprecation = compareAndAddDeprecated(w3cDrafts, partialExistingDrafts);
    } else {
        //Load current files and compare for deprecation
        withDeprecation = compareAndAddDeprecated(w3cDrafts, existingDrafts);
    }

    return sortObject(withDeprecation) as Record<string, W3CTokenDocument>;
}

export async function handleExtractWithDeprecation(
    fileKeys: { fileKey: string; originalFileKey?: string }[],
    figmaClient: IFigmaClient,
    tokenStoragePath: string,
    options: {
        deprecateFileOnly: boolean;
    } = { deprecateFileOnly: false },
) {
    const existingDrafts: Record<string, W3CTokenDocument> = loadExistingTokens(tokenStoragePath);
    return handleExtractWithDeprecationToken(fileKeys, figmaClient, existingDrafts, options);
}

export async function handleExtractInternalOnly(
    fileKeys: { fileKey: string; originalFileKey?: string }[],
    figmaClient: IFigmaClient,
): Promise<Record<string, W3CTokenDocument>> {
    // We do it async, so we can do the file fetching in parallel
    const promises = fileKeys.map(async (fileKey: { fileKey: string; originalFileKey?: string }) => handleExtractHelper(fileKey, figmaClient));

    const results = await Promise.all(promises);

    /*We include the file key as part to have separation*/
    return results.reduce(function (result: Record<string, W3CTokenDocument>, current) {
        Object.keys(current.data).forEach((key) => {
            result[`${current.fileKey.originalFileKey ?? current.fileKey.fileKey}_${key}`] = current.data[key];
        });
        return result;
    }, {});
}

export async function handleExtract(
    fileKeys: { fileKey: string; originalFileKey?: string }[],
    figmaClient: IFigmaClient,
): Promise<Record<string, W3CTokenDocument>> {
    const data = await handleExtractInternalOnly(fileKeys, figmaClient);
    return sortObject(data) as Record<string, W3CTokenDocument>;
}

export function storeTokens(data: Record<string, W3CTokenDocument>, tokenStoragePath: string) {
    storeNewTokens(tokenStoragePath, data);
}

export function deleteTokens(fileKeys: string[] | null, data: Record<string, W3CTokenDocument>, tokenStoragePath: string) {
    return deleteOldTokens(tokenStoragePath, fileKeys, data);
}

export function getPathAndDataFromDrafts(data: Record<string, W3CTokenDocument>, tokenStoragePath: string) {
    return getWriteableFiles(tokenStoragePath, data);
}

export function loadExistingTokenFromMemory(fileRoot: string, fileName: string, fileContent: string) {
    return loadExistingToken(fileRoot, fileName, fileContent);
}

export async function fetchStyles(fileKey: string, figmaClient: IFigmaClient) {
    const stylesData = await figmaClient.getFileStyles({ file_key: fileKey }).catch((error: unknown) => {
        // eslint-disable-next-line no-console
        console.error(`Error getting styles for file ${fileKey}`);
        throw error;
    });
    return stylesData.meta.styles;
}
