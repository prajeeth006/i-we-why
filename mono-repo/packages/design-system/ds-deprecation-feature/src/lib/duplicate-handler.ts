import { readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

/* eslint-disable sonarjs/cognitive-complexity,@typescript-eslint/no-explicit-any,@typescript-eslint/no-dynamic-delete,no-param-reassign,@typescript-eslint/no-unsafe-assignment */

const EXTENSIONS_PROPERTY = '$extensions';
const FIGMA_GROUP_NAME = 'com.entaingroup.ext-figma';

export function cleanDuplicateHandler(filePath: string) {
    const files = readdirSync(filePath, { recursive: true, encoding: 'utf8' }).filter((file) => file.endsWith('.json'));
    const filesRead = files.map((file) => ({ filePath: `${filePath}/${file}`, fileContent: readFileSync(`${filePath}/${file}`, 'utf8') }));
    filesRead.forEach((file) => {
        scanJson(file.filePath, file.fileContent, filesRead);
    });
}

type LeafInfo = {
    isDeprecated: boolean;
    path: string[];
};

function findDuplicatePaths(content: any, currentVariablePath: string[] = [], path: string[] = [], duplicates: Record<string, LeafInfo[]> = {}) {
    if ('$value' in content) {
        let isDeprecated = false;
        if (EXTENSIONS_PROPERTY in content && FIGMA_GROUP_NAME in content[EXTENSIONS_PROPERTY]) {
            const figmaExt = content[EXTENSIONS_PROPERTY][FIGMA_GROUP_NAME];
            if ('status' in figmaExt && figmaExt.status === 'deprecated') {
                // TODO handle deprecation
                isDeprecated = true;
            }
        }

        const name = path.join('-');
        if (!(name in duplicates)) {
            duplicates[name] = [];
        }
        duplicates[name].push({
            isDeprecated,
            path: currentVariablePath,
        });

        return duplicates;
    }

    for (const key in content) {
        if (key.startsWith('$')) {
            continue;
        }
        const pathName = key.toLowerCase().split(/[^a-z\d]/);

        findDuplicatePaths(content[key], [...currentVariablePath, key], [...path, ...pathName], duplicates);
    }

    return duplicates;
}

/**
 * This function is similar to iterateTokenContent in deprecation-json-handler with the difference of knowing the paths instead of the variables
 * This two functions can be merged at some later point if it has to be touched again.
 * @param content
 * @param tokensToBeDeleted
 * @param currentVariablePath
 * @param parent
 */
function deleteTokens(content: any, tokensToBeDeleted: string[][], currentVariablePath: string[] = [], parent: any = null): boolean {
    if ('$value' in content) {
        if (EXTENSIONS_PROPERTY in content && FIGMA_GROUP_NAME in content[EXTENSIONS_PROPERTY]) {
            const figmaExt = content[EXTENSIONS_PROPERTY][FIGMA_GROUP_NAME];
            if ('status' in figmaExt && figmaExt.status === 'deprecated') {
                if (tokensToBeDeleted.includes(currentVariablePath)) {
                    return false;
                }
                // eslint-disable-next-line no-console
                console.warn(currentVariablePath.join('-'), 'deprecated and not found, will be deleted');
                const forDeletion = currentVariablePath.at(-1);
                if (forDeletion) {
                    delete parent[forDeletion];
                }

                return true;
            }
        }
        return false;
    }

    let isDeleted = true;
    for (const key in content) {
        if (key.startsWith('$')) {
            continue;
        }
        const isChildDeleted = deleteTokens(content[key], tokensToBeDeleted, [...currentVariablePath, key], content);
        isDeleted = isDeleted && isChildDeleted;
    }

    if (isDeleted && parent != null) {
        // eslint-disable-next-line no-console
        console.warn(currentVariablePath.join('-'), '(group) deprecated and not found, will be deleted');
        const forDeletion = currentVariablePath.at(-1);
        if (forDeletion) {
            delete parent[forDeletion];
        }
    }

    return isDeleted;
}

function scanJson(filePath: string, content: string, filesRead: { filePath: string; fileContent: string }[]) {
    const tokenContent = JSON.parse(content);

    // Find tokens that map to same css path
    const duplicateInfo = findDuplicatePaths(tokenContent);

    const duplicatesOnly = Object.values(duplicateInfo).filter((info) => info.length > 1);

    duplicatesOnly.forEach((duplicate) => {
        // Check if there is at least one that is not deprecated
        // If this is the case we can remove all deprecated ones
        const nonDeprecated = duplicate.filter((x) => !x.isDeprecated);
        if (nonDeprecated.length > 0) {
            const deprecatedOnly = duplicate.filter((x) => x.isDeprecated);

            const isDeleted = deleteTokens(
                tokenContent,
                deprecatedOnly.map((x) => x.path),
            );
            if (isDeleted) {
                // eslint-disable-next-line no-console
                console.warn(filePath, '(file) deprecated and not found, will be deleted');
                rmSync(filePath);
            } else {
                const INDENT = 4;
                const writeContent = `${JSON.stringify(tokenContent, undefined, INDENT)}\n`;
                writeFileSync(filePath, writeContent);
                const inData = filesRead.find((x) => x.filePath === filePath);
                if (inData) {
                    inData.fileContent = writeContent;
                }
            }

            // TODO: this part of writing could not be verified
            // Replace removed token references with one that has not been removed
            const newReference = `{${nonDeprecated[0].path.join('.')}}`;
            filesRead.forEach((fileRead) => {
                deprecatedOnly.forEach((x) => {
                    const referenceFormat = `{${x.path.join('.')}}`;
                    if (fileRead.fileContent.includes(referenceFormat)) {
                        fileRead.fileContent = fileRead.fileContent.replace(referenceFormat, newReference);
                        writeFileSync(filePath, fileRead.fileContent);
                    }
                });
            });

            if (nonDeprecated.length > 1) {
                console.error(
                    `Multiple active duplicates. Please discuss with designers for resolving ${nonDeprecated.map((x) => x.path.join('/')).join(', ')}.`,
                );
            }
        } else {
            console.error(
                `Cannot clean up duplicates for ${duplicate.map((x) => x.path.join('/')).join(', ')}. Please decide manually what deprecation should be kept`,
            );
        }
    });
}
