/**
 * This file contains logic that was agreed on with the designers.
 */
import { W3CTokenDocument } from '@design-system/w3c-token-standard-utils';
import * as fs from 'node:fs';

import { VariableAliasConverter, VariableAliasConverterResult } from './convert-alias-internal-representation.utils';
import { InternalVariableRepresentation } from './convert-figma-json-to-internal-representation.utils';
import { GroupExtractor, GroupExtractorResult, themingNoSplit, themingSplitByMode } from './group-internal-representation-by-theme.utils';
import { getFilesRecursiveFromDirectory, removeInvalidChars } from './utils';

/**
 * folder name for the global tokens (also name of the first-level group in json file)
 */
export const GLOBAL_TOKEN_NAME = 'reference';

/**
 * folder name for the semantic tokens (also name of the first-level group in json file)
 */
export const SEMANTIC_TOKEN_NAME = 'semantic';

/**
 * This function groups the internal representation for the global layer
 * The brand is encoded as mode, so we have to extract the brand from the mode and remove the mode from the variable name
 * @param variable
 */
export const globalSplitter: GroupExtractor = (variable: InternalVariableRepresentation): GroupExtractorResult =>
    variable.name[0].startsWith(GLOBAL_TOKEN_NAME)
        ? {
              group: `${variable.name[0]} ${removeInvalidChars(variable.name[1])}`,
              posToRemove: [1],
          }
        : themingNoSplit();

/**
 * This function groups the internal representation for the semantic layer, using @see themingSplitByMode
 * @param variable
 */
export const semanticSplitter: GroupExtractor = (variable: InternalVariableRepresentation): GroupExtractorResult => {
    if (variable.name[0].startsWith(SEMANTIC_TOKEN_NAME)) {
        return themingSplitByMode(variable);
    }

    return themingNoSplit();
};

/**
 * This function groups the internal representation by component name and remove the component name and mode from the token name
 * @param variable
 */
export const componentGroupExtractor: GroupExtractor = (variable: InternalVariableRepresentation): GroupExtractorResult => {
    if (!variable.name[0].startsWith(SEMANTIC_TOKEN_NAME) && !variable.name[0].startsWith(GLOBAL_TOKEN_NAME)) {
        return {
            group: `components ${variable.name[0]}`,
            posToRemove: [1], // we remove the component name from the token name and also the mode as the mode is at the moment not needed at component level
        };
    }

    return themingNoSplit();
};

/**
 * This function renames all variable aliases on the global level according to the passed variableAliasConverters
 * @param value
 */
export const globalAliasConverter: VariableAliasConverter = (value: string[]): VariableAliasConverterResult => {
    if (value[0] === GLOBAL_TOKEN_NAME) {
        //const copyValue = value.slice();
        //copyValue.splice(1, 1);
        return value;
    }

    return null;
};

/**
 * Helper function to get the file name from the theme name
 * @param themeName
 */
const getFileName = (themeName: string) => {
    const parts = themeName.split('_');
    const fileKey = parts[0];
    const other = parts.slice(1).join('_');

    const parts2 = other.split(' ');
    parts2[parts2.length - 1] = `${fileKey}_${parts2.at(-1)}`;

    return parts2.join('/');
};

/**
 * Helper function to get the theme name from the path
 * @param fileName
 */
const getFileNameReverse = (fileName: string) => {
    const parts = fileName.split('/');
    const last = parts.at(-1)?.split('_');
    if (last != null) {
        const fileKey = last[0];
        parts[parts.length - 1] = last.slice(1).join('_');
        parts[0] = `${fileKey}_${parts[0]}`;
    }
    return parts.join(' ');
};

const TOKEN_FILE_ENDING = '.tokens.json';

/**
 * This loads the existing tokens in W3C Token Standard from the file system
 * @param path directory to load files
 */
export function loadExistingTokens(path: string): Record<string, W3CTokenDocument> {
    fs.mkdirSync(path, { recursive: true });
    const existingDrafts: Record<string, W3CTokenDocument> = {};
    const currentFiles = getFilesRecursiveFromDirectory(path);
    currentFiles.forEach((fileName) => {
        if (!fileName.endsWith(TOKEN_FILE_ENDING)) {
            return;
        }
        // Remove the path and the file ending
        const name = getFileNameReverse(fileName.slice(path.length + 1, fileName.length - TOKEN_FILE_ENDING.length));
        existingDrafts[name] = JSON.parse(fs.readFileSync(fileName, 'utf8'));
    });
    return existingDrafts;
}

export function loadExistingToken(fileRoot: string, fileName: string, fileContent: string) {
    return {
        name: getFileNameReverse(fileName.slice(fileRoot.length + 1, fileName.length - TOKEN_FILE_ENDING.length)),
        content: JSON.parse(fileContent) as W3CTokenDocument,
    };
}

/**
 * This creates a Map of the new tokens as W3C Token Standard with the in the file system as key and the content of the file as data
 * @param path directory to place files
 * @param drafts drafts to be put into files
 */
export function getWriteableFiles(path: string, drafts: Record<string, W3CTokenDocument>) {
    const returnData: {
        path: string;
        data: string;
    }[] = [];

    Object.entries(drafts).forEach(([themeName, tokens]) => {
        const filePath = `${path}/${getFileName(themeName)}${TOKEN_FILE_ENDING}`;
        const indention = 4;
        returnData.push({
            path: filePath,
            data: `${JSON.stringify(tokens, null, indention)}\n`,
        });
    });

    return returnData;
}

/**
 * This stores the new tokens as W3C Token Standard in the file system
 * @param filePath directory to place files
 * @param drafts drafts to be put into files
 */
export function storeNewTokens(filePath: string, drafts: Record<string, W3CTokenDocument>) {
    const writeableData = getWriteableFiles(filePath, drafts);

    writeableData.forEach(({ path, data }) => {
        fs.mkdirSync(path.slice(0, Math.max(0, path.lastIndexOf('/'))), { recursive: true });
        fs.writeFileSync(path, data, 'utf8');
    });
}

export function deleteOldTokens(path: string, fileKeys: string[] | null, drafts: Record<string, W3CTokenDocument>) {
    const deletedPaths: string[] = [];

    const writePaths = new Set(getWriteableFiles(path, drafts).map((x) => x.path));

    fs.mkdirSync(path, { recursive: true });
    const currentFiles = getFilesRecursiveFromDirectory(path);
    currentFiles.forEach((filePath) => {
        if (!filePath.endsWith(TOKEN_FILE_ENDING)) {
            return;
        }

        // We do not delete a file that gets overwritten
        if (writePaths.has(filePath)) {
            return;
        }

        // Remove the path and the file ending
        const name = getFileNameReverse(filePath.slice(path.length + 1, filePath.length - TOKEN_FILE_ENDING.length))
            .split(' ', 1)[0]
            .split('_', 1)[0];
        if (fileKeys == null || fileKeys.includes(name)) {
            deletedPaths.push(filePath);
            fs.rmSync(filePath);
        }
    });

    return deletedPaths;
}
