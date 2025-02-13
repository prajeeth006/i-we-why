import { Selectors } from '@angular-eslint/utils';

import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import * as fs from 'fs';

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-component-tests-present"
const KEYWORDS_TO_SKIP = ['demo', 'test', 'fake', 'mock', 'harness', 'utils', 'util'];
export const RULE_NAME = 'component-tests-present';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
    name: RULE_NAME,
    meta: {
        schema: [],
        type: 'suggestion',
        docs: {
            description: `Design System component must have tests created`,
            recommended: 'recommended',
        },
        hasSuggestions: true,
        messages: {
            missingTestFile: `Create *.spec.ts file for {{name}} component.`,
            missingTests: `Test file {{file}} is missing component tests.`,
        },
    },
    defaultOptions: [],
    create(context) {
        return {
            [Selectors.COMPONENT_CLASS_DECORATOR]: (node: TSESTree.Decorator) => {
                const classParent = node.parent as TSESTree.ClassDeclaration;
                if (classParent.id) {
                    const className = classParent.id.name;

                    if (
                        KEYWORDS_TO_SKIP.some((keyword) => className.toLowerCase().includes(keyword)) ||
                        KEYWORDS_TO_SKIP.some((keyword) => context.filename.includes(keyword))
                    ) {
                        return;
                    }
                    const testFile = context.filename.replace('component', 'component.spec');
                    if (!fs.existsSync(testFile)) {
                        context.report({
                            node,
                            messageId: 'missingTestFile',
                            data: {
                                name: className,
                            },
                        });
                    }

                    try {
                        const content = fs.readFileSync(testFile, 'utf8');
                        if (!/it\(/.test(content)) {
                            context.report({
                                node,
                                messageId: 'missingTests',
                                data: {
                                    file: testFile,
                                },
                            });
                        }
                    } catch (err) {
                        context.report({
                            node,
                            messageId: 'missingTests',
                            data: {
                                file: testFile,
                            },
                        });
                    }
                }
            },
        };
    },
});
