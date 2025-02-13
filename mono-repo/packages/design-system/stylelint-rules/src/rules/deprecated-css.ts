import { getTokenPathName, getTokenPaths } from '@design-system/token-path-config-utils';
import * as fs from 'fs';
import * as path from 'path';
import { Root } from 'postcss';
import stylelint, { PostcssResult, Rule, Severity, createPlugin } from 'stylelint';

const {
    utils: { report, ruleMessages },
} = stylelint;

const ruleName = 'design-system/no-deprecated-variable';

const messages = ruleMessages(ruleName, {
    rejected: (variableName) => `Deprecated variable "${variableName}" used`,
});

const cssVariableRegex = /--[\w-]+/g;
function variableMatches(cssString: string) {
    const matches = cssString.match(cssVariableRegex);
    return matches || [];
}

/** @type {import('stylelint').Rule} */
const ruleFunction = (a: { severity: Severity | undefined; app: string | undefined } | true) => {
    const rootPath = __dirname.substring(0, __dirname.lastIndexOf('dist'));
    const thatTheme = getTokenPathName(a === true || a.app == undefined ? 'design-system' : a.app);
    if (!thatTheme) {
        throw new Error(`Missing token path for theme. You either forgot to provide theme or theme does not exist.`);
    }
    const tokenPaths = getTokenPaths(thatTheme);
    const deprecatedPath = path.join(rootPath, tokenPaths.cssTokensPath, 'deprecated.txt');
    let deprecatedVariables: string[] = [];
    if (fs.existsSync(deprecatedPath)) {
        deprecatedVariables = fs.readFileSync(deprecatedPath, 'utf-8').split('\n');
    }

    return (root: Root, result: PostcssResult) => {
        root.walkDecls((node) => {
            if (node.type === 'decl') {
                const matchedVars = variableMatches(node.value);
                if (matchedVars.length == 0) {
                    // No variables found
                    return;
                }
                const deprecatedMatches = matchedVars.filter((x) => deprecatedVariables.includes(x));
                if (deprecatedMatches.length === 0) {
                    return;
                }

                // Variables are deprecated, report

                deprecatedMatches.forEach((deprecatedMatch) => {
                    report({
                        result,
                        ruleName,
                        message: messages.rejected(deprecatedMatch),
                        node,
                        severity: a === true ? 'error' : a.severity,
                    });
                });
            }
        });
    };
};

ruleFunction.ruleName = ruleName;
ruleFunction.messages = messages;

const pluginRule = createPlugin(ruleName, ruleFunction as Rule);

module.exports = pluginRule;
