import { Effect, GetFileNodesResponse, Node, RectangleNode, TextNode } from '@figma/rest-api-spec';

import { InternalVariableRepresentation, convertColor } from './convert-figma-json-to-internal-representation.utils';
import { convertCamelToKebabCase, convertToVariableName } from './utils';

/*type StyleConverter = (name: string[], style: TypeStyle) => InternalVariableRepresentation[];

const stylePropertyConverters: Record<string, (style: TypeStyle) => string | number | null> = {
    fontFamily: (style) => style.fontFamily ?? null,
    fontSize: (style) => style.fontSize ?? null,
    fontWeight: (style) => style.fontWeight?.toString() ?? null,
    lineHeightPx: (style) => style.lineHeightPx ?? null,
};*/

const boxShadowConverter = (effect: Effect) => {
    if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
        return `${pxValue(effect.offset.x)} ${pxValue(effect.offset.y)} ${pxValue(effect.radius)} ${convertColor(effect.color)}`;
    }
    return null;
};

const pxValue = (value: number) => (value === 0 ? value : `${value}px`);

export function convertStyleNodeJsonToInternalRepresentation(
    response: GetFileNodesResponse,
    variablesById: Record<string, string>,
    isComponent = false,
): InternalVariableRepresentation[] {
    return [
        ...convertStyleNodeJsonToEffectInternalRepresentation(response),
        ...(isComponent ? convertStyleNodeJsonToTypographyInternalRepresentation(response, variablesById) : []),
    ];
}

export function convertStyleNodeJsonToTypographyInternalRepresentation(
    response: GetFileNodesResponse,
    variablesById: Record<string, string>,
): InternalVariableRepresentation[] {
    return filterStyleNodes(response, 'TEXT')
        .map((node) => toStyleType<TextNode>(node.document))
        .flatMap((x) => convertToTypographyInternalRepresentation(x, variablesById));
}

export function convertStyleNodeJsonToEffectInternalRepresentation(response: GetFileNodesResponse): InternalVariableRepresentation[] {
    return filterStyleNodes(response, 'RECTANGLE')
        .map((node) => toStyleType<RectangleNode>(node.document))
        .flatMap(convertToEffectInternalRepresentation);
}

function filterStyleNodes(response: GetFileNodesResponse, type: string) {
    return Object.values(response.nodes).filter((nodes) => nodes.document.type === type);
}

function toStyleType<T>(document: Node): T {
    return document as T;
}

function convertToEffectInternalRepresentation(document: RectangleNode): InternalVariableRepresentation[] {
    const baseName = `reference/${document.name}`.split('/');
    const results = document.effects.flatMap((effect) => convertBoxShadow(baseName, effect));
    return [...results, ...convertReferenceToSemanticTokens(results)];
}

function convertToTypographyInternalRepresentation(document: TextNode, variablesById: Record<string, string>): InternalVariableRepresentation[] {
    const baseName = ['utility', 'Mode', ...document.name.split('/').map(convertToVariableName)];
    const lineHeights = document.boundVariables?.lineHeight || [];
    const fontSizes = document.boundVariables?.fontSize || [];
    const fontFamilies = document.boundVariables?.fontFamily || [];
    const fontWeights = document.boundVariables?.fontWeight || [];

    //const baseName = `reference/${document.name}`.split('/');
    const results: InternalVariableRepresentation[] = [];

    const elements = [lineHeights, fontSizes, fontFamilies, fontWeights];
    const elNames: ('lineHeight' | 'fontSize' | 'fontFamily' | 'fontWeight')[] = ['lineHeight', 'fontSize', 'fontFamily', 'fontWeight'];
    //const styleConverters: StyleConverter[] = [convertLineHeight, convertFontSize, convertFontFamily, convertFontWeight];

    const token: InternalVariableRepresentation = {
        source: 'VARIABLE',
        type: 'TYPOGRAPHY',
        collection: 'utility',
        name: [...baseName],
        value: {
            fontSize: [],
            fontFamily: [],
            fontWeight: [],
            lineHeight: [],
        },
    };
    elements.forEach((element, index) => {
        if (element.length > 0) {
            if (element.length > 1) {
                throw new Error(`Invalid amount of ${elNames[index]}`);
            }
            const varId = element[0].id;
            if (!(varId in variablesById)) {
                throw new Error(`Variable reference not found for ${elNames[index]} (${varId})`);
            }
            token.value[elNames[index]] = variablesById[varId].split('/');
            /*results.push({
                source: 'VARIABLE',
                type: 'VARIABLE_ALIAS',
                collection: 'utility',
                name: [...baseName, elNames[index]],
                value: variablesById[varId].split("/"),
            })*/
        } else {
            throw new Error(`Invalid typography style ${elNames[index]}`);
            /*  styleConverters[index](baseName, document.style).forEach((token) => {
                results.push(token);
            });*/
        }
    });

    results.push(token);

    return results;

    //return [...results, ...convertReferenceToSemanticTokens(results)];
}

/*
function convertToTypographyReferenceToken(
    name: string[],
    style: TypeStyle,
    property: keyof TypeStyle,
    type: 'FONT_WEIGHT' | 'FONT_FAMILY' | 'FLOAT',
): InternalVariableRepresentation[] {
    return createInternalVariableRepresentation(stylePropertyConverters[property](style), name, property, type);
}*/

function convertToBoxShadowReferenceToken(name: string[], effect: Effect, property: string, type: 'SHADOW'): InternalVariableRepresentation[] {
    return createInternalVariableRepresentation(boxShadowConverter(effect), name, property, type);
}

function createInternalVariableRepresentation(value: string | number | null, name: string[], property: string, type: string) {
    if (value) {
        return [
            {
                name: [...name, convertCamelToKebabCase(property)],
                collection: 'reference',
                source: 'STYLE',
                value: value,
                type: type,
            } as InternalVariableRepresentation,
        ];
    }
    return [];
}

/*
function convertFontFamily(name: string[], style: TypeStyle): InternalVariableRepresentation[] {
    return convertToTypographyReferenceToken(name, style, 'fontFamily', 'FONT_FAMILY');
}

function convertFontSize(name: string[], style: TypeStyle): InternalVariableRepresentation[] {
    return convertToTypographyReferenceToken(name, style, 'fontSize', 'FLOAT');
}

function convertFontWeight(name: string[], style: TypeStyle): InternalVariableRepresentation[] {
    return convertToTypographyReferenceToken(name, style, 'fontWeight', 'FONT_WEIGHT');
}

function convertLineHeight(name: string[], style: TypeStyle): InternalVariableRepresentation[] {
    return convertToTypographyReferenceToken(name, style, 'lineHeightPx', 'FLOAT');
}*/

function convertBoxShadow(name: string[], effect: Effect): InternalVariableRepresentation[] {
    return convertToBoxShadowReferenceToken(name, effect, 'boxShadow', 'SHADOW');
}

function convertReferenceToSemanticTokens(referenceTokens: InternalVariableRepresentation[]): InternalVariableRepresentation[] {
    return referenceTokens.map((token) => ({
        ...token,
        type: 'VARIABLE_ALIAS',
        collection: 'semantic',
        name: getSemanticTokenName(token.name),
        value: getSemanticTokenValue(token.name),
    }));
}

function getSemanticTokenName(name: string[]) {
    const copyName = name.slice(1);
    return ['semantic', ...copyName];
}

function getSemanticTokenValue(name: string[]) {
    return [...name.slice(0, 1), ...name.slice(2)];
}
