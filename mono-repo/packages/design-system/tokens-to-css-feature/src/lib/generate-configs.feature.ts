import { THEME_LIST, Theme } from '@design-system/shared-ds-utils';
import { TokenPathName, getTokenPaths, getTokenPathsByFigmaKey } from '@design-system/token-path-config-utils';
import * as fs from 'node:fs/promises';
import { normalize, resolve } from 'node:path';
import { Config } from 'style-dictionary/types';

import { GLOBAL_TOKEN_NAME, SEMANTIC_TOKEN_NAME } from './constants.utils.js';

// Depending on the use case in the future:
// replace attributes/cti transformer with transformer action to create cti structure as needed for predefined transformers if necessary
// impact: some logic has to adapted to check other attributes that are defined with our custom cti transformer
// Requirement: know when it is which type of token (size, color, etc.)

/**
 * This function removes the .tokens.json suffix from the file name
 * @param fileName
 */
function removeTokensJsonSuffix(fileName: string) {
    return fileName.replace('.tokens.json', '');
}

function removeFileKeyPrefix(fileName: string) {
    return fileName.split('_').slice(1).join('_');
}
function getFileKeyPrefix(fileName: string) {
    return fileName.split('_')[0];
}

/**
 * Load all brands from the file structure
 * The file structure is structured according to the figma namings in the file structure as follows:
 * <token dir>
 *     <global token dir as named in figma>
 *         <brand1 as named in figma>.tokens.json
 *         <brand2 as named in figma>.tokens.json
 *     <semantic token dir as named in figma>
 *         <brand1>
 *             <theme1 as named in figma>.tokens.json
 *             <theme2 as named in figma>.tokens.json
 *         <brand2>
 *             <theme1 as named in figma>.tokens.json
 *             <theme2 as named in figma>.tokens.json
 *             <theme3 as named in figma>.tokens.json
 *    components
 *         <component1 as named in figma>.tokens.json
 *         <component2 as named in figma>.tokens.json
 *
 *  This method reads the file names inside the global token dir and returns them as brands, and removes the .tokens.json suffix
 *  @param tokenPath the path where the w3c token files are stored
 */
async function getBrands(tokenPath: string) {
    const brands = await fs.readdir(`${tokenPath}/${GLOBAL_TOKEN_NAME}`);
    const brandsMapped = brands.map(removeTokensJsonSuffix);
    // We sort for consistent order
    return brandsMapped.sort((a, b) => removeFileKeyPrefix(a).localeCompare(removeFileKeyPrefix(b)));
}

async function getBrandsControl(tokenPath: string) {
    const brands = await fs.readdir(`${tokenPath}/${SEMANTIC_TOKEN_NAME}`);
    const finalBrands: string[] = [];

    // Ignore empty folders
    for (const brand of brands) {
        const childElements = await fs.readdir(`${tokenPath}/${SEMANTIC_TOKEN_NAME}/${brand}`);
        if (childElements.length > 0) {
            finalBrands.push(brand);
        }
    }

    // We sort for consistent order
    return finalBrands.sort((a, b) => a.localeCompare(b));
}

async function exists(f: string) {
    try {
        await fs.stat(f);
        return true;
    } catch {
        return false;
    }
}

/**
 * Load all themes from the file structure
 * The file structure is structured according to the figma namings in the file structure as follows:
 * <token dir>
 *     <global token dir as named in figma>
 *         <brand1 as named in figma>.tokens.json
 *         <brand2 as named in figma>.tokens.json
 *     <semantic token dir as named in figma>
 *         <brand1>
 *             <theme1 as named in figma>.tokens.json
 *             <theme2 as named in figma>.tokens.json
 *         <brand2>
 *             <theme1 as named in figma>.tokens.json
 *             <theme2 as named in figma>.tokens.json
 *             <theme3 as named in figma>.tokens.json
 *     components
 *         <component1 as named in figma>.tokens.json
 *         <component2 as named in figma>.tokens.json
 *
 *  This method reads the file names inside the semantic/brand dir to derive the themes, and removes the .tokens.json suffix
 *   @param tokenPath the path where the w3c token files are stored
 *   @param brand the name of the brand to load
 */
async function getThemes(tokenPath: string, brand: string) {
    const path = `${tokenPath}/${SEMANTIC_TOKEN_NAME}/${removeFileKeyPrefix(brand)}`;
    if (await exists(path)) {
        const themes = await fs.readdir(path);
        const t = themes.map(removeTokensJsonSuffix);
        // We sort for consistent order
        return t.sort((a, b) => removeFileKeyPrefix(a).localeCompare(removeFileKeyPrefix(b)));
    } else {
        return [];
    }
}

/**
 * This function call getThemes for each brand
 * @param tokenPath the path where the w3c token files are stored
 * @param brands
 */
async function getAllThemes(tokenPath: string, brands: string[]) {
    return await Promise.all(
        brands.map(async (brand) => {
            const themes = await getThemes(tokenPath, brand);
            return {
                brand: brand,
                themes: themes,
            };
        }),
    );
}

/**
 * Load all component stylings from the file structure
 * The file structure is structured according to the figma namings in the file structure as follows:
 * <token dir>
 *     <global token dir as named in figma>
 *         <brand1 as named in figma>.tokens.json
 *         <brand2 as named in figma>.tokens.json
 *     <semantic token dir as named in figma>
 *         <brand1>
 *             <theme1 as named in figma>.tokens.json
 *             <theme2 as named in figma>.tokens.json
 *         <brand2>
 *             <theme1 as named in figma>.tokens.json
 *             <theme2 as named in figma>.tokens.json
 *             <theme3 as named in figma>.tokens.json
 *     components
 *         <component1 as named in figma>.tokens.json
 *         <component2 as named in figma>.tokens.json
 *
 *  This method reads the file names inside the components dir to derive the components, and removes the .tokens.json suffix
 *   @param tokenPath the path where the w3c token files are stored
 *   @param brand the name of the brand to load
 */
async function getComponents(tokenPath: string) {
    const components = await fs.readdir(`${tokenPath}/components`);
    // We sort for consistent order
    return components.map(removeTokensJsonSuffix).sort((a, b) => removeFileKeyPrefix(a).localeCompare(removeFileKeyPrefix(b)));
}

/**
 * Helper function that load all brands, themes and components
 *  @param tokenPath the path where the w3c token files are stored
 *  @param tokenPathPrefix the prefix if placed in sub folder (e.g. for webhooks)
 */
async function loadAllConfigs(tokenPath: string, tokenPathPrefix: string) {
    // Brands and themes loaded from design-system
    const dsPath = getTokenPaths(TokenPathName.DesignSystem);
    const prefixedJsonPath = tokenPathPrefix + dsPath.jsonTokensPath;
    const brands = await getBrands(prefixedJsonPath);

    // Ensure semantic brand names do not contain a brand data that is not mentioned by a reference file
    const brandsControl = await getBrandsControl(prefixedJsonPath);
    const brandsCleaned = new Set(brands.map(removeFileKeyPrefix));
    const onlyInBrandsControl = brandsControl.filter((x) => !brandsCleaned.has(x));
    if (onlyInBrandsControl.length > 0) {
        throw new Error(`Semantic export contains themes that are not in reference files: ${onlyInBrandsControl.join(', ')}`);
    }

    return await Promise.all([getAllThemes(prefixedJsonPath, brands), getComponents(tokenPath)]);
}

/**
 * Helper function to create one style dictionary config for a theme
 * @param tokenPath the path where the w3c token files are stored
 * @param brand the brand the theme belongs to
 * @param theme the theme
 * @param stylesSource the name of styles file for given theme
 */
function createThemeConfig(tokenPath: string, brand: string, theme: string, stylesSource: string | undefined) {
    const brandNormalized = removeFileKeyPrefix(brand);
    const themeNormalized = removeFileKeyPrefix(theme);
    //TODO handle nested themes for country-specific theming like sportingbet/brazil
    if (!themeNormalized) {
        return;
    }

    const themeSource = [
        resolve(normalize(`${tokenPath}/${GLOBAL_TOKEN_NAME}/${brand}.tokens.json`)),
        resolve(normalize(`${tokenPath}/${SEMANTIC_TOKEN_NAME}/${brandNormalized}/${theme}.tokens.json`)),
    ];
    if (stylesSource) {
        themeSource.push(resolve(normalize(`${tokenPath}/${SEMANTIC_TOKEN_NAME}/${brandNormalized}/${stylesSource}.tokens.json`)));
    }

    const themeParkClassName = getThemeparkThemeClassName(`${brandNormalized}-${themeNormalized}`);
    const themeConfig: Config = {
        // Each theme consists of a global and a semantic token file
        source: themeSource,
        parsers: ['w3c-parser-custom'],
        platforms: {
            // We generate a scss files for the global tokens
            // We do not need it in the new design system, but it can be used as a compatability layer (the first level of theming in the old system)
            // scss: {
            //     transforms: ['attribute/cti', 'name/kebab', 'custom/deprecated-name', 'custom/length-zero-no-unit','custom/length-add-unit-where-missing'],
            //     buildPath: `styles/${brandNormalized}/${themeNormalized}/`,
            //     files: [
            //         {
            //             // We do not need this token for semantic token, so we only generate for completion, as style dictionary automatically resolves the global tokens
            //             destination: 'global.scss',
            //             format: 'customThemeScss',
            //             filter: 'isGlobalToken',
            //             options: {
            //                 outputReferences: false, // We want to output the actual value, not a reference to the value on the global level
            //                 showFileHeader: false,
            //             },
            //         },
            //     ],
            // },
            // We generate a css file for the semantic tokens
            // This is, one file per theme
            css: {
                transforms: [
                    'attribute/cti',
                    'name/kebab',
                    'custom/deprecated-name',
                    'custom/length-zero-no-unit',
                    'custom/length-add-unit-where-missing',
                    'custom/escape-font-family',
                ],
                buildPath: `styles/${brandNormalized}/${themeNormalized}/`,
                files: [
                    {
                        destination: 'semantic.css',
                        //format: 'css/variables',
                        format: 'customThemeCss',
                        filter: 'isSemanticToken',
                        options: {
                            // cssSelector: `.${brandNormalized}-${themeNormalized}`,
                            cssSelector: `.${themeParkClassName}`,
                            outputReferences: false, // We want to output a reference, which we will not use, but to allow global overriding
                            outputReferenceFallbacks: true, // We want to output the actual value as a fallback
                        },
                    },
                ],
            },
        },
    };

    return themeConfig;
}

/**
 * function to create all theme configs
 * @param tokenPath the path where the w3c token files are stored
 * @param brandWithThemes
 */
function createThemeConfigs(tokenPath: string, brandWithThemes: { brand: string; themes: string[] }[]) {
    return brandWithThemes.flatMap((brandWithTheme) => {
        const stylesSource = brandWithTheme.themes.find((v) => v.includes('style'));
        return brandWithTheme.themes
            .filter((theme) => !theme.includes('style'))
            .map((theme) => createThemeConfig(tokenPath, brandWithTheme.brand, theme, stylesSource))
            .filter((config): config is Config => !!config);
    });
}

/**
 * function to create all component configs
 * The components require multiple files, one file per component
 * @param tokenPath the path where the w3c token files are stored
 * @param tokenPathPrefix the path prefix in case we have sub dir (e.g., webhooks)
 * @param component the component to create the config for
 * @param brand required as we need to reference the semantic tokens
 * @param theme required as we need to reference the semantic tokens
 */
function createComponentConfig(tokenPath: string, tokenPathPrefix: string, component: string, brand: string, theme: string): Config {
    const componentNormalized = removeFileKeyPrefix(component);
    const fileKey = getFileKeyPrefix(component);
    const tokenPathId = getTokenPathsByFigmaKey(fileKey);
    const dsPath = getTokenPaths(TokenPathName.DesignSystem);
    const prefixedJsonPath = tokenPathPrefix + dsPath.jsonTokensPath;
    if (!tokenPathId) {
        throw new Error(`File key not found in definition ${fileKey}`);
    }
    return {
        source: [
            // We have to add one theme config otherwise component config will fail (there exist no option to disable reference resolving internally)
            resolve(normalize(`${prefixedJsonPath}/${GLOBAL_TOKEN_NAME}/${brand}.tokens.json`)),
            resolve(normalize(`${prefixedJsonPath}/${SEMANTIC_TOKEN_NAME}/${removeFileKeyPrefix(brand)}/${theme}.tokens.json`)),
            resolve(normalize(`${tokenPath}/components/${component}.tokens.json`)),
        ],
        parsers: ['w3c-parser-custom'],
        platforms: {
            css: {
                transforms: [
                    'attribute/cti',
                    'name/kebab',
                    'custom/deprecated-name',
                    'custom/length-zero-no-unit',
                    'custom/length-add-unit-where-missing',
                    'custom/escape-font-family',
                ],
                buildPath: `styles/components/${componentNormalized}/`,
                files: [
                    {
                        destination: `${componentNormalized}.scss`,
                        //format: 'css/variables',
                        format: componentNormalized === 'utility' ? 'customUtilityScss' : 'customComponentScss',
                        // For json output, we cannot use any outer variables, so we pass it to format and let format handle it
                        filter: 'isComponent',
                        options: {
                            outputReferences: true, // We want to output the reference value
                            componentTokenPrefix: tokenPathId.exportPrefix,
                        },
                    },
                ],
            },
        },
    };
}

function getThemeparkThemeClassName(newThemeName: string): string {
    const mappedThemeNames: Record<string, string> = THEME_LIST.reduce(
        (current: Record<string, string>, value: Theme) => ({
            ...current,
            [value.exportedFigmaName]: [value.mainThemeparkClass, ...(value.alternativeThemeparkClasses ?? [])].join(', .'),
        }),
        {} satisfies Record<string, string>,
    );

    if (!(newThemeName in mappedThemeNames)) {
        return newThemeName;
    }

    return mappedThemeNames[newThemeName];
}

/**
 *  We create all configs
 *  @param tokenPath the path where the w3c token files are stored
 *  @param tokenPathPrefix the path prefix in case it a sub dir
 */
export default async function createConfigs(tokenPath: string, tokenPathPrefix: string) {
    // Themes are only used in DSCore
    const dsPath = getTokenPaths(TokenPathName.DesignSystem);
    const prefixedJsonPath = tokenPathPrefix + dsPath.jsonTokensPath;
    // We check ends with to be sure to support sub paths, e.g. for webhooks
    const isDsPath = tokenPath === prefixedJsonPath;

    const [brandWithThemes, components] = await loadAllConfigs(tokenPath, tokenPathPrefix);
    const themeConfigs = isDsPath ? createThemeConfigs(tokenPath, brandWithThemes) : [];

    // We search for whitelabel here
    const componentBrand = brandWithThemes.find((s) => s.brand.endsWith('_whitelabel'));
    if (componentBrand == null) {
        throw new Error('Brand whitelabel does not exist anymore, please fix script by changing brand for component styles');
    }

    const componentTheme = componentBrand.themes.find((x) => !x.endsWith('style'));
    if (!componentTheme) {
        throw new Error('Brand whitelabel does not exist anymore, please fix script by changing brand for component styles');
    }
    const componentConfigs = components.map((component) =>
        createComponentConfig(tokenPath, tokenPathPrefix, component, componentBrand.brand, componentTheme),
    );
    return [...themeConfigs, ...componentConfigs];
}
