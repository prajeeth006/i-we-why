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
import { Selectors } from '@angular-eslint/utils';

import { AST_NODE_TYPES, ESLintUtils, TSESTree } from '@typescript-eslint/utils';

// NOTE: The rule will be available in ESLint configs as "@nx/workspace-pubsub-always-unsubscribe"
export const RULE_NAME = 'pubsub-always-unsubscribe';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
    name: RULE_NAME,
    meta: {
        schema: [],
        type: 'suggestion',
        docs: {
            description: `.....`,
            recommended: 'recommended',
        },
        hasSuggestions: true,
        messages: {
            subscribe: `You should unsubscribe this subscription: {{subscribe}}`,
        },
    },
    defaultOptions: [],

    create(context) {
        const subscribeCalls: Record<string, TSESTree.CallExpression> = {};
        const unsubscribeCalls: Record<string, TSESTree.CallExpression> = {};

        let isRootService = false;

        return {
            [Selectors.INJECTABLE_CLASS_DECORATOR]: (node: TSESTree.Decorator) => {
                if ('expression' in node && 'type' in node.expression && node.expression.type === 'CallExpression') {
                    if ('arguments' in node.expression && node.expression.arguments.length) {
                        if (node.expression.arguments[0].properties[0].value.value === 'root') {
                            isRootService = true;
                        }
                    }
                }
            },
            'CallExpression'(node: TSESTree.CallExpression) {
                if (isRootService && !isPubSubService(node)) {
                    return;
                }
                if ('type' in node.callee && node.callee.type === AST_NODE_TYPES.MemberExpression) {
                    if ('type' in node.callee.property && node.callee.property.type === 'Identifier') {
                        if (node.callee.property.name === 'subscribe') {
                            if (node.arguments.length === 0) {
                                return;
                            }
                            populateWithArg(subscribeCalls, node);
                        }
                        if (node.callee.property.name === 'unsubscribe') {
                            if (node.arguments.length === 0) {
                                return;
                            }
                            populateWithArg(unsubscribeCalls, node);
                        }
                    }
                }
            },
            'Program:exit'() {
                if (isRootService) return;

                Object.keys(subscribeCalls).forEach((key) => {
                    const subscribeCall = subscribeCalls[key];
                    const unsubscribeCall = unsubscribeCalls[key];
                    if (!unsubscribeCall) {
                        context.report({
                            node: subscribeCall as any,
                            messageId: 'subscribe',
                            data: { subscribe: key },
                        });
                    }
                });
            },
        };
    },
});

function populateWithArg(obj: Record<string, TSESTree.CallExpression>, node: TSESTree.CallExpression) {
    let firstArg = node.arguments[0];
    if ('type' in firstArg && firstArg.type === 'Literal') {
        obj[firstArg.value] = node;
        return;
    }

    if ('type' in firstArg && firstArg.type === 'TemplateLiteral' && ('quasis' in firstArg || 'expressions' in firstArg)) {
        const templateLiteral = (firstArg.quasis || []).map((q) => q.value.raw).join('');
        const templateExpressions = firstArg.expressions.map((q) => q.value).join('');
        obj[templateLiteral + templateExpressions] = node;
        return;
    }

    if ('type' in firstArg && firstArg.type === 'MemberExpression' && 'property' in firstArg && 'name' in firstArg.property) {
        obj[firstArg.property.name] = node;
        return;
    }
}

function isPubSubService(node: TSESTree.CallExpression) {
    if ('type' in node.callee && node.callee.type === AST_NODE_TYPES.MemberExpression && 'object' in node.callee) {
        if ('type' in node.callee.object && node.callee.object.type === 'Identifier') {
            return node.callee.object.name.toLowerCase().includes('pubsub');
        }
        if ('property' in node.callee.object && 'type' in node.callee.object.property && node.callee.object.property.type === 'Identifier') {
            return node.callee.object.property.name.toLowerCase().includes('pubsub');
        }
    }
    return false;
}

// needed to suppress error of invalid docs URL as rule filename will be set as default
rule.meta.docs.url = undefined;
