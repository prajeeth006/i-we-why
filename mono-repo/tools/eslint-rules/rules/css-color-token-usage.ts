/**
 * This file sets you up with structure needed for an ESLint rule.
 *
 * It leverages utilities from @typescript-eslint to allow TypeScript to
 * provide autocompletions etc for the configuration.
 *
 * Your rule's custom logic will live within the create() method below
 * and you can learn more about writing ESLint rules on the official guide:
 *
 * https://eslint.org/docs/developer-guide/working-with-rules
 *
 * You can also view many examples of existing rules here:
 *
 * https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin/src/rules
 */
import { getTemplateParserServices } from '@angular-eslint/utils';
// @ts-ignore
import { TmplAstElement } from '@angular/compiler';

import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESLint } from '@typescript-eslint/utils';

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-css-color-token-usage"
export const RULE_NAME = 'css-color-token-usage';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Forbids the usage of color values in styles`,
        },
        schema: [],
        messages: {
            dsColorDisallowed: `Color {{colors}} is not allowed. Use a variable instead`,
        },
    },
    defaultOptions: [],
    create(context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>) {
        // @ts-ignore
        const parserServices = getTemplateParserServices(context);

        return {
            Element$1: (node: TmplAstElement) => {
                const styles = node.attributes.filter(({ name }) => name == 'style');
                const styles2 = node.inputs.filter(
                    ({ name, keySpan }) => ['style', 'ngStyle'].includes(name) || keySpan?.details?.includes('style.') || false,
                );

                let isInvalid = false;
                let isInvalidText = '';

                for (const style of styles) {
                    const foundTokens = retrieveNonVariableCssTokens(style.value);
                    if (foundTokens.length > 0) {
                        if (isInvalid) {
                            isInvalidText += ', ';
                        }
                        isInvalidText = foundTokens.join(', ');
                        isInvalid = true;
                    }
                }

                for (const style of styles2) {
                    if ('source' in style.value && typeof style.value.source == 'string') {
                        const foundTokens = retrieveNonVariableCssTokens(style.value.source);
                        if (foundTokens.length > 0) {
                            if (isInvalid) {
                                isInvalidText += ', ';
                            }
                            isInvalidText += foundTokens.join(', ');
                            isInvalid = true;
                        }
                    }
                }

                if (isInvalid) {
                    // @ts-ignore
                    const loc = parserServices.convertElementSourceSpanToLoc(context, node);

                    context.report({
                        loc: loc,
                        messageId: 'dsColorDisallowed',
                        data: {
                            colors: isInvalidText,
                        },
                    });
                }
            },
        };
    },
});

const REGEX_CSS_RGBA = /rgba?\(.*?\)/g;
const REGEX_CSS_HEX = /#[0-9a-f]+/gi;
const REGEX_CSS_HWB = /hwb\(.*?\)/g;
const REGEX_CSS_HSLA = /hsla?\(.*?\)/g;
// @TODO, border-color, color, background-color, outline-color, column-rule-color, fill, stroke
const REGEX_CSS_NAMED_COLORS =
    /(--)?(aliceblue|antiquewhite|aqua|aquamarine|azure|beige|bisque|black|blanchedalmond|blue|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|cyan|darkblue|darkcyan|darkgoldenrod|darkgray|darkgreen|darkgrey|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|fuchsia|gainsboro|ghostwhite|gold|goldenrod|gray|green|greenyellow|grey|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgreen|lightgrey|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|lime|limegreen|linen|magenta|maroon|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|navy|oldlace|olive|olivedrab|orange|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|purple|rebeccapurple|red|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|silver|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|teal|thistle|tomato|turquoise|violet|wheat|white|whitesmoke|yellow|yellowgreen)/gi;
// VARIABLE OK: var(--color-primary); NOT OK: #000000; NOT OK: var(--color-primary, #000000);

export function retrieveNonVariableCssTokens(textString: string): string[] {
    const tokens: string[] = [];
    const cssTokens = [
        ...textString.matchAll(REGEX_CSS_RGBA),
        ...textString.matchAll(REGEX_CSS_HEX),
        ...textString.matchAll(REGEX_CSS_HWB),
        ...textString.matchAll(REGEX_CSS_HSLA),
        ...textString.matchAll(REGEX_CSS_NAMED_COLORS),
    ];
    for (const token of cssTokens) {
        if (token[0].startsWith('--')) continue; // Ignore variable names
        tokens.push(token[0]);
    }
    return tokens;
}

// needed to suppress error of invalid docs URL as rule filename will be set as default
rule.meta.docs.url = undefined;
