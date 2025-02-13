export type DsStylesAnalysisPluginOptions = {
    directory: string;
    variableImportPattern: string;
    deprecatedCssVarsFilePath: string;
};

export type DsRunnerOptions = DsStylesAnalysisPluginOptions;

export interface ComponentStylesData {
    stylesContent: string;
    componentFilePath: string;
    componentSelector: string;
}

export type DsComponentReplacement = {
    [key: string]: DsComponentData;
};

export type Replacement = {
    cssClass: string;
    componentName: string;
    storybookLink: string;
    lineOfCode: number;
};

export type ReplacementGroup = {
    filePath: string;
    replacements: Replacement[];
};

export type DsComponentReplacementConfig = {
    [key: string]: Omit<DsComponentData, 'lineOfCode'>;
};

export interface DsComponentData {
    componentName: string;
    storybookLink: string;
    lineOfCode: number;
}

export type DsAdoptionPluginOptions = {
    projectSlug: string;
    directory: string;
    replacements?: DsComponentReplacement;
};

export type DsOverride = {
    file: string;
    overrides: DSProperty[];
};
export interface DSProperty {
    property: string;
    value: string;
}

export interface DsCssVarsUsage {
    allVars: string[];
    usedVars: string[];
    unusedVars: string[];
}
