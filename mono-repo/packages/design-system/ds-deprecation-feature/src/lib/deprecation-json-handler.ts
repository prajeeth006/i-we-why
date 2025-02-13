import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import * as path from 'node:path';

/* eslint-disable sonarjs/cognitive-complexity,@typescript-eslint/no-explicit-any,@typescript-eslint/no-dynamic-delete,no-param-reassign,@typescript-eslint/no-unsafe-assignment */

const EXTENSIONS_PROPERTY = '$extensions';

function compareExportAndCss(
    directory: string,
    generatedThemeStylesPath: string,
    callback: (tokenPath: string, cssPath: string, cssFileName: string, tokenPrefix: string) => void,
    tokenPrefix: string,
    onlyComponents: boolean,
) {
    const files = readdirSync(directory, { recursive: true, encoding: 'utf8' }).filter((file) => file.endsWith('.json'));

    files.forEach((file) => {
        const fileName = path.basename(file);
        const dir = path.relative(directory, path.dirname(path.join(directory, file)));
        const name = fileName.slice(0, Math.max(0, fileName.length - '.tokens.json'.length)).split('_')[1];

        if (dir === 'reference') {
            // We don't have css files for reference tokens, so we don't compare
            // This can be cleaned up by checking references from semantic file to reference file directly
            return;
        }

        if (dir.startsWith('semantic')) {
            if (onlyComponents) {
                return;
            }
            const theme = dir.slice('semantic'.length).replace(/[^\w-]/g, '');
            if (name === 'style') {
                // Here we have to scan folder and load all variables from all files
                callback(path.join(directory, file), `${generatedThemeStylesPath}/${theme}`, 'semantic.css', tokenPrefix);
                return;
            }
            callback(path.join(directory, file), `${generatedThemeStylesPath}/${theme}/${name}/semantic.css`, '', tokenPrefix);
        }

        if (dir === 'components') {
            callback(path.join(directory, file), `${generatedThemeStylesPath}/components/${name}/${name}.scss`, name, tokenPrefix);
        }
    });
}

const cssVariableRegex = /--[\w-]+/g;
function variableMatches(cssString: string) {
    const matches = cssString.match(cssVariableRegex);
    return matches ?? [];
}

function iterateTokenContent(content: any, variables: string[], currentVariablePath: string[] = [], parent: any = null): boolean {
    if ('$value' in content) {
        if (EXTENSIONS_PROPERTY in content && 'com.entaingroup.ext-figma' in content[EXTENSIONS_PROPERTY]) {
            const figmaExt = content[EXTENSIONS_PROPERTY]['com.entaingroup.ext-figma'];
            if ('status' in figmaExt && figmaExt.status === 'deprecated') {
                if (variables.includes(paramCase(currentVariablePath.join(' ')))) {
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
        const isChildDeleted = iterateTokenContent(content[key], variables, [...currentVariablePath, key], content);
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

function readVariablesFromCssFile(cssPath: string, cssFileName: string, tokenPrefix: string) {
    const allVariables: string[] = [];
    if (existsSync(cssPath)) {
        const cssContent = readFileSync(cssPath, 'utf8');

        // Utility
        if (cssFileName === 'utility') {
            cssFileName = '';
        }

        // Tokens in css follow the following schema for component tokens, @mixin <name> { --var: <some value>}
        const mixins = cssContent.split('@mixin');
        mixins.forEach((mixin) => {
            const firstCurvedBracket = mixin.indexOf('{');
            let mixinName = mixin.slice(0, Math.max(0, firstCurvedBracket)).trim();

            // No Mixin Content (class or part of a comment in case there is some deprecation notice)
            if (mixinName.startsWith('.') || mixinName.startsWith('/*')) {
                mixinName = '';
            }

            const variableBlock = mixin.slice(firstCurvedBracket + 1, mixin.lastIndexOf('}')).trim();
            // We don't care if there are more variables, we just want to know which are not in the file anymore
            variableMatches(variableBlock).forEach((variable) => {
                let localVariable = variable.slice('--'.length);
                if (localVariable.startsWith(`${tokenPrefix}-`)) {
                    localVariable = localVariable.slice(`${tokenPrefix}-`.length);
                }

                const kebabCaseName = paramCase(cssFileName);
                allVariables.push(
                    kebabCaseName + (cssFileName.length > 0 ? '-' : '') + paramCase(mixinName) + localVariable.slice(kebabCaseName.length),
                );
            });
        });
    }
    return allVariables;
}

function compareFiles(tokenPath: string, cssPath: string, cssFileName: string, tokenPrefix: string) {
    const tokenContent = JSON.parse(readFileSync(tokenPath, 'utf8'));

    const allVariables: string[] = [];
    // Special case style export that counts for all semantic files
    if (cssFileName === 'semantic.css') {
        if (existsSync(cssPath)) {
            const semanticFiles = readdirSync(cssPath, { recursive: true, encoding: 'utf8' }).filter((file) => file.endsWith('.css'));
            const allVarSet = new Set(
                semanticFiles.flatMap((cssPathChild) => readVariablesFromCssFile(`${cssPath}/${cssPathChild}`, '', tokenPrefix)),
            );
            allVarSet.forEach((variable) => {
                allVariables.push(variable);
            });
        }
    } else {
        readVariablesFromCssFile(cssPath, cssFileName, tokenPrefix).forEach((variable) => {
            allVariables.push(variable);
        });
    }

    const isDeleted = iterateTokenContent(tokenContent, allVariables);

    if (isDeleted) {
        // eslint-disable-next-line no-console
        console.warn(tokenPath, '(file) deprecated and not found, will be deleted');
        rmSync(tokenPath);
    } else {
        const INDENT = 4;
        const writeContent = `${JSON.stringify(tokenContent, undefined, INDENT)}\n`;
        writeFileSync(tokenPath, writeContent);
    }
}

export function runDeprecationHandlerCss(filePath: string, generatedThemeStylesPath: string, tokenPrefix: string, onlyComponents = false) {
    compareExportAndCss(filePath, generatedThemeStylesPath, compareFiles, tokenPrefix, onlyComponents);
}

// We use the code of style dict, but don't want to use deprecated packages

// https://www.npmjs.com/package/no-case?activeTab=code
// https://www.npmjs.com/package/param-case?activeTab=code

// Regexps involved with splitting words in various case formats.
const SPLIT_LOWER_UPPER_RE = /([\p{Ll}\d])(\p{Lu})/gu;
const SPLIT_UPPER_UPPER_RE = /(\p{Lu})(\p{Lu}\p{Ll})/gu;
// Regexp involved with stripping non-word characters from the result.
const DEFAULT_STRIP_REGEXP = /[^\p{L}\d]+/giu;
// The replacement value for splits.
const SPLIT_REPLACE_VALUE = '$1\0$2';

/**
 * Split any cased input strings into an array of words.
 */
function split(input: string) {
    let result = input.replace(SPLIT_LOWER_UPPER_RE, SPLIT_REPLACE_VALUE).replace(SPLIT_UPPER_UPPER_RE, SPLIT_REPLACE_VALUE);

    result = result.replace(DEFAULT_STRIP_REGEXP, '\0');
    let start = 0;
    let end = result.length;
    // Trim the delimiter from around the output string.
    while (result.charAt(start) === '\0') {
        start++;
    }
    if (start === end) {
        return [];
    }
    while (result.charAt(end - 1) === '\0') {
        end--;
    }
    // Transform each token independently.
    return result.slice(start, end).split(/\0/g);
}

export function paramCase(input: string) {
    return split(input)
        .map((s) => s.toLowerCase())
        .join('-');
}
