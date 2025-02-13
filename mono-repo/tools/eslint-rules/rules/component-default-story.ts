import { Selectors } from '@angular-eslint/utils';

import type { TSESTree } from '@typescript-eslint/utils';
import { ESLintUtils } from '@typescript-eslint/utils';
import * as fs from 'fs';
import * as path from 'path';

const KEYWORDS_TO_SKIP = ['demo', 'test', 'fake', 'mock', 'harness', 'utils', 'util'];
const DESIGN_SYSTEM_COMPONENT_STORY_NAME = 'Default';
export const RULE_NAME = 'component-default-story';

export const rule = ESLintUtils.RuleCreator(() => __filename)({
    name: RULE_NAME,
    meta: {
        schema: [],
        type: 'problem',
        docs: {
            description: `Design System components must have ${DESIGN_SYSTEM_COMPONENT_STORY_NAME} story present'`,
            recommended: 'recommended',
        },
        hasSuggestions: false,
        messages: {
            missingStoriesFile: `Create *.stories file for {{name}} component`,
            missingStories: `Create ${DESIGN_SYSTEM_COMPONENT_STORY_NAME} story for {{name}} component.`,
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

                    const storiesFilePath = context.filename.replace('component', 'component.stories').split(path.sep);
                    const storiesFile = [
                        ...storiesFilePath.slice(0, storiesFilePath.lastIndexOf('design-system') + 1),
                        'storybook-host-app',
                        'src',
                        'stories',
                        ...storiesFilePath.slice(storiesFilePath.lastIndexOf('design-system') + 2).filter((x) => x != 'src'),
                    ].join(path.sep);

                    if (!fs.existsSync(storiesFile)) {
                        context.report({
                            node,
                            messageId: 'missingStoriesFile',
                            data: {
                                name: className,
                                filename: context.filename,
                            },
                        });
                    }

                    try {
                        const content = fs.readFileSync(storiesFile, 'utf8');
                        const storyExportPattern = /export\s+const\s+.+:\s*Story(?:Obj)?\b/;
                        if (!storyExportPattern.test(content)) {
                            context.report({
                                node,
                                messageId: 'missingStories',
                                data: {
                                    name: className,
                                    filename: storiesFile,
                                },
                            });
                        }
                    } catch (err) {
                        context.report({
                            node,
                            messageId: 'missingStories',
                            data: {
                                name: className,
                            },
                        });
                    }
                }
            },
        };
    },
});

// needed to suppress error of invalid docs URL as rule filename will be set as default
rule.meta.docs.url = undefined;
