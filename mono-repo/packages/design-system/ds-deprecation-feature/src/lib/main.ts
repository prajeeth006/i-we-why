// eslint-disable-next-line @nx/enforce-module-boundaries
import type { CrawlFileSystemOptions } from '@code-pushup/utils';
import { TokenPathName, getAllTokenPaths, getTokenPaths } from '@design-system/token-path-config-utils';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as process from 'node:process';
import * as sass from 'sass';

import { runDeprecationHandlerCss } from './deprecation-json-handler';
import { cleanDuplicateHandler } from './duplicate-handler';

/* eslint-disable no-console */

export const CSS_VARIABLES_REGEX = /--(?!semantic\b)([\w-]+)/g;
export const CSS_VARIABLES_REGEX_SEMANTICS = /--semantic([\w-]+)/g;
export const MIXIN_VARIABLES_REGEX = /@mixin\s+([\w-]+)\s*{/g;

const DEPRECATED_ANNOTATION = '@deprecated';

export interface DsDeprecationOptions {
    generatedThemeStyles: string;
    deprecatedTokensFile: string;
    deprecatedMixinsFile: string;
    safelyRemovableTokenFile: string;
    safelyRemovableMixinFile: string;
}

const options: DsDeprecationOptions = {
    deprecatedTokensFile: 'deprecated.txt',
    deprecatedMixinsFile: 'deprecated-mixins.txt',
    safelyRemovableTokenFile: 'safely-removable-tokens.txt',
    safelyRemovableMixinFile: 'safely-removable-mixins.txt',
    generatedThemeStyles: path.join(getTokenPaths(TokenPathName.DesignSystem).cssTokensPath, 'styles'),
};

type CPURelevantMethods = {
    crawlFileSystem: <T = string>(options: CrawlFileSystemOptions<T>) => Promise<T[]>;
    readTextFile: (path: string) => Promise<string>;
};

async function useCodePushUpUtils() {
    // eslint-disable-next-line @nx/enforce-module-boundaries
    return (await import('@code-pushup/utils')) as CPURelevantMethods;
}

export async function main() {
    const cpu = await useCodePushUpUtils();
    const skipGeneration = process.argv.find((x) => x.includes('--skip-generation'));
    const onlyComponents = process.argv.some((x) => x.includes('--only-components'));

    const allGeneratedComponentsCssVars = await getAllGeneratedComponentsCssVars(cpu);
    const allGeneratedThemeStyles = await getAllGeneratedThemesCssVars(cpu);
    const deprecatedVarsUnused: string[] = await (skipGeneration
        ? getCssVarsFromFiles(cpu, options.safelyRemovableTokenFile)
        : generateTextFileWithSafelyRemovableTokens(cpu, allGeneratedComponentsCssVars, allGeneratedThemeStyles));
    const deprecatedMixinsUnused: string[] = await (skipGeneration
        ? getMixinsFromFiles(cpu, options.safelyRemovableMixinFile)
        : generateTextFileWithSafelyRemovableMixins(cpu, allGeneratedComponentsCssVars));
    if (process.argv.some((x) => x.includes('--fix'))) {
        await handleRemoval(
            cpu,
            allGeneratedComponentsCssVars,
            allGeneratedThemeStyles,
            deprecatedVarsUnused,
            deprecatedMixinsUnused,
            onlyComponents,
        );

        const tokenPaths = getAllTokenPaths();
        for (const tokenPath of Object.values(tokenPaths)) {
            if (!fs.existsSync(tokenPath.jsonTokensPath) || !fs.existsSync(path.join(tokenPath.cssTokensPath, 'styles'))) {
                continue;
            }
            runDeprecationHandlerCss(tokenPath.jsonTokensPath, path.join(tokenPath.cssTokensPath, 'styles'), tokenPath.exportPrefix, onlyComponents);
            cleanDuplicateHandler(tokenPath.jsonTokensPath);
        }
    }
}

/**
 * Returns unused deprecated vars as string[]
 * @param cpu
 * @param allGeneratedComponentsCssVars
 * @param allGeneratedThemeStyles
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
async function generateTextFileWithSafelyRemovableTokens(
    cpu: CPURelevantMethods,
    allGeneratedComponentsCssVars: { variables: string[]; content: string; filePath: string }[],
    allGeneratedThemeStyles: { variables: string[]; content: string; filePath: string }[],
): Promise<string[]> {
    // get all deprecated vars in order to reuse them
    const deprecatedCssVars = await getCssVarsFromFiles(cpu, options.deprecatedTokensFile);
    const allDsComponentsStyles = await getAllDsComponentsStyles(cpu);
    const deprecatedVarsUsed: Record<string, boolean | undefined> = {};
    // go over all the generated components css vars and check if they are used in the ds components
    for (const generatedComponentCssVars of allGeneratedComponentsCssVars) {
        for (const cssVar of generatedComponentCssVars.variables) {
            if (deprecatedCssVars.includes(cssVar) && deprecatedVarsUsed[cssVar] === undefined) {
                const isUsed = allDsComponentsStyles.some((dsComponent) => dsComponent.contentParsed.includes(cssVar));
                if (isUsed) {
                    deprecatedVarsUsed[cssVar] = true;
                }
            }
        }
    }
    for (const generatedThemeCssVars of allGeneratedThemeStyles) {
        for (const cssVar of generatedThemeCssVars.variables) {
            if (deprecatedCssVars.includes(cssVar) && deprecatedVarsUsed[cssVar] === undefined) {
                // It is eiter used in the component itself, in the generated component file, or found in theme file itself in case a deprecated variable references do it or a variable references it
                const isUsed = allDsComponentsStyles.some((dsComponent) => dsComponent.content.includes(cssVar));
                const isUsed2 = !isUsed && allGeneratedComponentsCssVars.some((dsComponent) => dsComponent.content.includes(cssVar));
                const isUsed3 = !isUsed && !isUsed2 && generatedThemeCssVars.content.includes(`var(${cssVar})`);
                if (isUsed || isUsed2 || isUsed3) {
                    deprecatedVarsUsed[cssVar] = true;
                }
            }
        }
    }
    const unusedDeprecatedVars = deprecatedCssVars.filter((v) => !deprecatedVarsUsed[v]);

    const tokenPaths = getAllTokenPaths();
    for (const tokenPath of Object.values(tokenPaths)) {
        let vars = await getCssVarsFromFile(cpu, path.join(tokenPath.cssTokensPath, options.deprecatedTokensFile));
        if (vars.length === 0) {
            continue;
        }
        vars = vars.filter((x) => unusedDeprecatedVars.includes(x));
        // write the result to the output file
        fs.writeFileSync(path.join(tokenPath.cssTokensPath, options.safelyRemovableTokenFile), unusedDeprecatedVars.join('\n'));
    }

    return unusedDeprecatedVars;
}

/**
 * Returns unused deprecated mixins as string[]
 * @param cpu
 * @param allGeneratedComponentsCssVars
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
async function generateTextFileWithSafelyRemovableMixins(
    cpu: CPURelevantMethods,
    allGeneratedComponentsCssVars: { variables: string[]; mixins: string[]; content: string; filePath: string }[],
): Promise<string[]> {
    // get all deprecated mixins in order to reuse them
    const deprecatedMixins = await getMixinsFromFiles(cpu, options.deprecatedMixinsFile);

    const allDsComponentsStyles = await getAllDsComponentsStyles(cpu);

    const deprecatedMixinsUsed: Record<string, boolean | undefined> = {};

    // go over all the generated components css vars and check if they are used in the ds components
    for (const generatedComponentCssVars of allGeneratedComponentsCssVars) {
        for (const cssMixin of generatedComponentCssVars.mixins) {
            const componentName = path.parse(path.basename(generatedComponentCssVars.filePath)).name;
            const mixinNameDeprecation = `${componentName}.${cssMixin}`;
            if (deprecatedMixins.includes(mixinNameDeprecation) && deprecatedMixinsUsed[mixinNameDeprecation] === undefined) {
                const isUsed = allDsComponentsStyles.some((dsComponent) => {
                    if (!dsComponent.content.includes(`components/${componentName}/${componentName}`)) {
                        return false;
                    }
                    const lines = dsComponent.content
                        .split('\n')
                        .filter((x) => x.includes(`components/${componentName}/${componentName}`) && x.includes('@use'));
                    if (lines.length !== 1) {
                        throw new Error('Invalid file format');
                    }
                    const line = lines[0];
                    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
                    const fileAlias = line.slice(line.indexOf('as') + 3, line.lastIndexOf(';')).trim();
                    return dsComponent.content.includes(`${fileAlias}.${cssMixin}`);
                });
                if (isUsed) {
                    deprecatedMixinsUsed[mixinNameDeprecation] = true;
                }
            }
        }
    }

    const unusedDeprecatedMixins = deprecatedMixins.filter((v) => !deprecatedMixinsUsed[v]);

    const tokenPaths = getAllTokenPaths();
    for (const tokenPath of Object.values(tokenPaths)) {
        let vars = await getMixinsFromFile(cpu, path.join(tokenPath.cssTokensPath, options.deprecatedMixinsFile));
        if (vars.length === 0) {
            continue;
        }
        vars = vars.filter((x) => unusedDeprecatedMixins.includes(x));
        // write the result to the output file
        fs.writeFileSync(path.join(tokenPath.cssTokensPath, options.safelyRemovableMixinFile), unusedDeprecatedMixins.join('\n'));
    }

    return unusedDeprecatedMixins;
}

// eslint-disable-next-line sonarjs/cognitive-complexity,max-lines-per-function
async function handleRemoval(
    cpu: CPURelevantMethods,
    allGeneratedComponentsCssVars: { variables: string[]; content: string; filePath: string }[],
    allGeneratedThemeStyles: { content: string; filePath: string }[],
    deprecatedVarsUnused: string[],
    deprecatedMixinsUnused: string[],
    onlyComponents: boolean,
) {
    // remove the unused var from the deprecated file
    for (const generatedComponentCssVars of allGeneratedComponentsCssVars) {
        let contentLines = generatedComponentCssVars.content.split('\n');
        const initialLength = contentLines.length;
        for (const unusedVar of deprecatedVarsUnused) {
            contentLines = removeDeprecatedVar(unusedVar, contentLines);
        }

        const componentName = path.parse(path.basename(generatedComponentCssVars.filePath)).name;
        contentLines = cleanUpDeprecatedMixins(
            contentLines,
            deprecatedMixinsUnused.filter((x) => x.startsWith(`${componentName}.`)).map((x) => x.slice(x.indexOf('.') + 1)),
        );
        if (contentLines.length !== initialLength) {
            contentLines = cleanUpEmptyMixins(contentLines);
            contentLines = removeInitialEmptyLines(contentLines);
            const newContent = contentLines.join('\n');

            if (fileIsEmptyOrIncludesEmptyLines(newContent)) {
                fs.unlinkSync(generatedComponentCssVars.filePath);
                console.log(`Removed file: ${generatedComponentCssVars.filePath}`);
            } else {
                fs.writeFileSync(generatedComponentCssVars.filePath, newContent);
                console.log(`Updated file: ${generatedComponentCssVars.filePath}`);
            }
        }
    }

    if (!onlyComponents) {
        for (const generatedThemeCssVars of allGeneratedThemeStyles) {
            let contentLines = generatedThemeCssVars.content.split('\n');

            const initialLength = contentLines.length;

            for (const unusedVar of deprecatedVarsUnused) {
                contentLines = removeDeprecatedVar(unusedVar, contentLines);
            }

            if (contentLines.length !== initialLength) {
                const newContent = contentLines.join('\n');
                if (fileIsEmptyOrIncludesEmptyLines(newContent)) {
                    fs.unlinkSync(generatedThemeCssVars.filePath);
                    console.log(`Removed file: ${generatedThemeCssVars.filePath}`);
                } else {
                    // write the updated content to the file
                    fs.writeFileSync(generatedThemeCssVars.filePath, newContent);
                    console.log(`Updated file: ${generatedThemeCssVars.filePath}`);
                }
            }
        }
    }

    const tokenPaths = getAllTokenPaths();
    for (const tokenPath of Object.values(tokenPaths)) {
        const deprecatedCssVars = await getCssVarsFromFile(cpu, path.join(tokenPath.cssTokensPath, options.deprecatedTokensFile));
        const updatedDeprecatedCssVars = deprecatedCssVars.filter((v) => !deprecatedVarsUnused.includes(v));
        // write the result to the output file
        if (deprecatedCssVars.length !== updatedDeprecatedCssVars.length) {
            fs.writeFileSync(path.join(tokenPath.cssTokensPath, options.deprecatedTokensFile), updatedDeprecatedCssVars.join('\n'));
        }

        const deprecatedCssMixins = await getMixinsFromFile(cpu, path.join(tokenPath.cssTokensPath, options.deprecatedMixinsFile));
        const updatedDeprecatedCssMixins = deprecatedCssMixins.filter((v) => !deprecatedMixinsUnused.includes(v));
        // write the result to the output file
        if (deprecatedCssMixins.length !== updatedDeprecatedCssMixins.length) {
            fs.writeFileSync(path.join(tokenPath.cssTokensPath, options.deprecatedMixinsFile), updatedDeprecatedCssMixins.join('\n'));
        }
        // remove the generated text file
        if (fs.existsSync(path.join(tokenPath.cssTokensPath, options.safelyRemovableTokenFile))) {
            fs.unlinkSync(path.join(tokenPath.cssTokensPath, options.safelyRemovableTokenFile));
        }
        if (fs.existsSync(path.join(tokenPath.cssTokensPath, options.safelyRemovableMixinFile))) {
            fs.unlinkSync(path.join(tokenPath.cssTokensPath, options.safelyRemovableMixinFile));
        }
    }
}

async function getAllGeneratedComponentsCssVars(cpu: CPURelevantMethods): Promise<
    {
        appName: string;
        variables: string[];
        mixins: string[];
        content: string;
        filePath: string;
    }[]
> {
    const tokenPaths = getAllTokenPaths();

    const readerFunc = async (appName: string, componentStyles: string) =>
        await cpu
            .crawlFileSystem({
                directory: componentStyles,
                pattern: /.(scss)$/,
                fileTransform: async (filePath: string) => {
                    const content = await cpu.readTextFile(filePath);

                    if (!content.includes(DEPRECATED_ANNOTATION)) {
                        return { variables: [], mixins: [], content, filePath };
                    }

                    const allVars = removeDuplicateStrings([...content.matchAll(CSS_VARIABLES_REGEX)].map((x) => x[0]));
                    const allMixins = removeDuplicateStrings([...content.matchAll(MIXIN_VARIABLES_REGEX)].map((x) => x[1]));
                    return { appName, variables: allVars, mixins: allMixins, content, filePath };
                },
            })
            .then((arr) =>
                arr.filter(
                    (
                        v,
                    ): v is {
                        appName: string;
                        variables: string[];
                        mixins: string[];
                        content: string;
                        filePath: string;
                    } => !!v,
                ),
            );

    return (
        await Promise.all(
            Object.entries(tokenPaths).map(async (tokenPath) => {
                if (!fs.existsSync(path.join(tokenPath[1].cssTokensPath, 'styles/components'))) {
                    return [];
                }
                return await readerFunc(tokenPath[0], path.join(tokenPath[1].cssTokensPath, 'styles/components'));
            }),
        )
    ).flat();
}

async function getAllGeneratedThemesCssVars(cpu: CPURelevantMethods): Promise<
    {
        variables: string[];
        content: string;
        filePath: string;
    }[]
> {
    return cpu
        .crawlFileSystem({
            directory: options.generatedThemeStyles,
            pattern: /.(css)$/,
            fileTransform: async (filePath: string) => {
                // we process generated component styles separately
                if (filePath.includes('components')) {
                    return false;
                }
                const content = await cpu.readTextFile(filePath);

                if (!content.includes(DEPRECATED_ANNOTATION)) {
                    return false;
                }

                const allVars = removeDuplicateStrings([...content.matchAll(CSS_VARIABLES_REGEX_SEMANTICS)].map((x) => x[0]));

                return { variables: allVars, content, filePath };
            },
        })
        .then((arr) =>
            arr.filter(
                (
                    v,
                ): v is {
                    appName: string;
                    variables: string[];
                    content: string;
                    filePath: string;
                } => !!v,
            ),
        );
}

async function getAllDsComponentsStyles(cpu: CPURelevantMethods) {
    const tokenPaths = getAllTokenPaths();

    const readerFunc = async (appName: string, uiComponentsPath: string) =>
        await cpu
            .crawlFileSystem({
                directory: uiComponentsPath,
                pattern: /.(scss)$/,
                fileTransform: async (filePath: string) => {
                    if (filePath.includes('generated')) {
                        return false; // skip generated files as they are processed separately
                    }

                    const content = await cpu.readTextFile(filePath);
                    const contentParsed = sass.compile(filePath).css;

                    // only process files that include generated css vars
                    const includesGeneratedCss = content.includes('generated');
                    if (!includesGeneratedCss) {
                        return false;
                    }

                    return { appName, content, contentParsed, filePath };
                },
            })
            .then((arr) => arr.filter((v): v is { appName: string; content: string; contentParsed: string; filePath: string } => !!v));

    return (
        await Promise.all(
            Object.entries(tokenPaths).map(async (tokenPath) => {
                if (!fs.existsSync(path.join(tokenPath[1].uiComponentsPath))) {
                    return [];
                }
                return await readerFunc(tokenPath[0], path.join(tokenPath[1].uiComponentsPath));
            }),
        )
    ).flat();
}

export async function getCssVarsFromFiles(cpu: CPURelevantMethods, fileName: string) {
    const tokenPaths = getAllTokenPaths();
    const vars = Object.values(tokenPaths).map(async (tokenPath) => await getCssVarsFromFile(cpu, path.join(tokenPath.cssTokensPath, fileName)));
    return (await Promise.all(vars)).flat();
}

export async function getCssVarsFromFile(cpu: CPURelevantMethods, filePath: string): Promise<string[]> {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    return await cpu.readTextFile(filePath).then((res) => {
        const lines = res
            .split('\n')
            .map((x) => x.trim())
            .filter((x) => x && x.startsWith('--'));
        return removeDuplicateStrings(lines);
    });
}

export async function getMixinsFromFiles(cpu: CPURelevantMethods, fileName: string) {
    const tokenPaths = getAllTokenPaths();
    const vars = Object.values(tokenPaths).map(async (tokenPath) => await getMixinsFromFile(cpu, path.join(tokenPath.cssTokensPath, fileName)));
    return (await Promise.all(vars)).flat();
}

export async function getMixinsFromFile(cpu: CPURelevantMethods, filePath: string): Promise<string[]> {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    return await cpu.readTextFile(filePath).then((res) => {
        const lines = res.split('\n').map((x) => x.trim());
        return removeDuplicateStrings(lines);
    });
}

function removeDeprecatedVar(deprecatedVar: string, contentLines: string[]): string[] {
    const linesToRemove: number[] = [];

    contentLines.forEach((line, index) => {
        // we check if it's the var declaration, that's why ":" is added
        if (line.includes(`${deprecatedVar}:`) && contentLines[index - 1].includes(DEPRECATED_ANNOTATION)) {
            linesToRemove.push(index, index - 1);
        }
    });

    return contentLines.filter((_, index) => !linesToRemove.includes(index));
}

function cleanUpEmptyMixins(contentLines: string[]): string[] {
    // @mixin medium {
    // }

    const linesToRemove: number[] = [];

    contentLines.forEach((line, index) => {
        if (line.includes('@mixin') && contentLines[index + 1].includes('}')) {
            linesToRemove.push(index, index + 1);
        }
    });

    return contentLines.filter((_, index) => !linesToRemove.includes(index));
}

function cleanUpDeprecatedMixins(contentLines: string[], deprecatedMixins: string[]): string[] {
    const linesToRemove: number[] = [];

    contentLines.forEach((line, index) => {
        if (deprecatedMixins.some((x) => line.trim() === `@mixin ${x} {`)) {
            const removalIndex = contentLines.findIndex((a, b) => b > index && a.includes('}'));
            if (index > 0 && contentLines[index - 1].includes('@deprecated')) {
                linesToRemove.push(index - 1);
            }
            for (let i = index; i <= removalIndex; i++) {
                linesToRemove.push(i);
            }
        }
    });

    return contentLines.filter((_, index) => !linesToRemove.includes(index));
}

function fileIsEmptyOrIncludesEmptyLines(content: string) {
    return content.trim() === '' || content.split('\n').every((x) => x === '');
}

function removeInitialEmptyLines(contentLines: string[]) {
    const firstNonEmptyLineIndex = contentLines.findIndex((line) => line.trim() !== '');
    return contentLines.filter((_, index) => index >= firstNonEmptyLineIndex);
}

function removeDuplicateStrings(arr: string[]) {
    return [...new Set(arr)];
}
