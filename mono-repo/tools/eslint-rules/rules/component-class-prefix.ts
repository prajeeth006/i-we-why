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
import { ASTUtils, Selectors } from '@angular-eslint/utils';

import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-component-class-prefix"
export const RULE_NAME = 'component-class-prefix';

const DESIGN_SYSTEM_COMPONENTS_PREFIX = 'Ds';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
    name: RULE_NAME,
    meta: {
        schema: [],
        type: 'suggestion',
        docs: {
            description: `Design System components must have prefix '${DESIGN_SYSTEM_COMPONENTS_PREFIX}'`,
            recommended: 'recommended',
        },
        hasSuggestions: true,
        messages: {
            dsPrefix: `Use '${DESIGN_SYSTEM_COMPONENTS_PREFIX}' as a prefix in the class name of the Design System Components.`,
            suggestAddPrefix: `Add 'Ds' prefix to the component class`,
        },
    },
    defaultOptions: [],

    create(context) {
        return {
            [Selectors.COMPONENT_CLASS_DECORATOR](node: TSESTree.Decorator) {
                const classParent = node.parent as TSESTree.ClassDeclaration;
                const className = ASTUtils.getClassName(classParent);

                const keywordsToSkip = ['demo', 'test', 'fake', 'mock'];

                // skip components that are for demo purposes or testing
                if (keywordsToSkip.some((keyword) => className.toLowerCase().includes(keyword))) return;

                if (!className.startsWith(DESIGN_SYSTEM_COMPONENTS_PREFIX)) {
                    context.report({
                        node: classParent.id ? classParent.id : classParent,
                        messageId: 'dsPrefix',
                        suggest: [
                            {
                                messageId: 'suggestAddPrefix',
                                fix: (fixer) => fixer.replaceText(classParent.id, `Ds${className}`),
                            },
                        ],
                    });
                }
            },
        };
    },
});

// needed to suppress error of invalid docs URL as rule filename will be set as default
rule.meta.docs.url = undefined;
