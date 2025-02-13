import { rule as componentClassPrefixUsage, RULE_NAME as componentClassPrefixUsageName } from './rules/component-class-prefix';
import { rule as componentDefaultStory, RULE_NAME as componentDefaultStoryName } from './rules/component-default-story';
import { rule as componentTestsPresent, RULE_NAME as componentTestsPresentName } from './rules/component-tests-present';
import { rule as cssColorTokenUsage, RULE_NAME as cssColorTokenUsageName } from './rules/css-color-token-usage';
import { rule as customComponentUsage, RULE_NAME as customComponentUsageName } from './rules/custom-component-usage';
import { rule as pubsubAlwaysUnSubscribe, RULE_NAME as pubsubAlwaysUnsubscribeName } from './rules/pubsub-always-unsubscribe';

/**
 * Import your custom workspace rules at the top of this file.
 *
 * For example:
 *
 * import { RULE_NAME as myCustomRuleName, rule as myCustomRule } from './rules/my-custom-rule';
 *
 * In order to quickly get started with writing rules you can use the
 * following generator command and provide your desired rule name:
 *
 * ```sh
 * npx nx g @nx/eslint:workspace-rule {{ NEW_RULE_NAME }}
 * ```
 */

module.exports = {
    /**
     * Apply the imported custom rules here.
     *
     * For example (using the example import above):
     *
     * rules: {
     *  [myCustomRuleName]: myCustomRule
     * }
     */
    rules: {
        [cssColorTokenUsageName]: cssColorTokenUsage,
        [componentClassPrefixUsageName]: componentClassPrefixUsage,
        [componentDefaultStoryName]: componentDefaultStory,
        [componentTestsPresentName]: componentTestsPresent,
        [pubsubAlwaysUnsubscribeName]: pubsubAlwaysUnSubscribe,
        [customComponentUsageName]: customComponentUsage,
    },
};
