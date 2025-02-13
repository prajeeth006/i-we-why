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
// @ts-ignore
import { DomElementSchemaRegistry, HTM, TmplAstElement } from '@angular-eslint/bundled-angular-compiler';

import { ESLintUtils } from '@typescript-eslint/utils';
import type { TSESLint } from '@typescript-eslint/utils';

import { OxygenStandaloneComponentSelectors } from './oxygen-standalone-component-selectors';

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-custom-component-usage"
export const RULE_NAME = 'custom-component-usage';

const ALL_HTML_TAGS = [...new DomElementSchemaRegistry().allKnownElementNames(), 'ng-container', 'ng-template', 'ng-content'];

export const rule = ESLintUtils.RuleCreator(() => __filename)({
    name: RULE_NAME,
    meta: {
        type: 'suggestion',
        docs: {
            description: `Tells you the count of custom components in the template`,
        },
        schema: [],
        messages: {
            items: `File {{fileName}} contains {{count}} components: \n\n{{selectors}}\n`,
        },
    },
    defaultOptions: [],
    create(context: Readonly<TSESLint.RuleContext<string, readonly unknown[]>>) {
        let customElementsSet = new Set<string>();
        let fileNode: any;

        return {
            'Program'(node) {
                if (!fileNode) {
                    fileNode = node;
                }
            },
            'Element$1': (node: TmplAstElement) => {
                const isHtmlTag = ALL_HTML_TAGS.includes(node.name);
                if (isHtmlTag) {
                    return;
                }

                customElementsSet.add(node.name);
            },
            'Program:exit'() {
                const filename = context.getFilename();
                const onlyFilename = filename.split(/\/|\\/).pop(); // Extract filename

                context.report({
                    node: fileNode,
                    messageId: 'items',
                    data: {
                        fileName: onlyFilename,
                        count: customElementsSet.size,
                        selectors: Array.from(customElementsSet.keys())
                            .filter((item) => item !== null)
                            .map((x) => {
                                if (OxygenStandaloneComponentSelectors.has(x)) {
                                    return `    ✅ ${x}  (standalone)`;
                                }
                                return `    ❌ ${x}`;
                            })
                            .join(', \n'),
                    },
                });
            },
        };
    },
});
