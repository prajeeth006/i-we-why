import { getTokenPathName, getTokenPaths } from '@design-system/token-path-config-utils';
import * as fs from 'fs';
import * as path from 'path';
import { Root } from 'postcss';
import stylelint, { PostcssResult, Rule, Severity, createPlugin } from 'stylelint';

const {
    utils: { report, ruleMessages },
} = stylelint;

const ruleNameMixin = 'design-system/no-deprecated-mixins';

const mixinMessages = ruleMessages(ruleNameMixin, {
    rejected: (mixinName) => `Deprecated mixin "${mixinName}" used`,
});

/** @type {import('stylelint').Rule} */
const ruleMixinFunction = (a: { severity: Severity | undefined; app: string | undefined } | true) => {
    const rootPath = __dirname.substring(0, __dirname.lastIndexOf('dist'));
    const thatTheme = getTokenPathName(a === true || a.app == undefined ? 'design-system' : a.app);
    if (!thatTheme) {
        throw new Error(`Missing token path for theme. You either forgot to provide theme or theme does not exist.`);
    }
    const tokenPaths = getTokenPaths(thatTheme);
    const deprecatedPath = path.join(rootPath, tokenPaths.cssTokensPath, 'deprecated-mixins.txt');
    let deprecatedMixins: string[] = [];
    if (fs.existsSync(deprecatedPath)) {
        deprecatedMixins = fs.readFileSync(deprecatedPath, 'utf-8').split('\n');
    }

    return (root: Root, result: PostcssResult) => {
        const useParams: string[] = [];
        root.walkAtRules((x) => {
            if (x.name === 'use') {
                useParams.push(x.params);
            }
        });
        const paramMap: Record<string, string> = {};
        useParams.forEach((param) => {
            if (!param.includes(' as ') || !param.includes('component')) {
                return;
            }
            const [importPath, usageName] = param.split(' as ', 2);
            paramMap[usageName] = importPath.slice(importPath.lastIndexOf('/') + 1, -1);
        });
        root.walkAtRules((x) => {
            if (x.name === 'include') {
                if (!x.params.includes('.')) {
                    return;
                }
                const parts = x.params.split('.', 2);
                if (parts[0] in paramMap) {
                    parts[0] = paramMap[parts[0]];
                }
                const depName = parts.join('.');
                if (deprecatedMixins.includes(depName)) {
                    report({
                        result,
                        ruleName: ruleNameMixin,
                        message: mixinMessages.rejected(parts[1]),
                        node: x,
                        severity: a === true ? 'error' : a.severity,
                    });
                }
            }
        });
    };
};

ruleMixinFunction.ruleName = ruleNameMixin;
ruleMixinFunction.messages = mixinMessages;

const pluginRuleMixin = createPlugin(ruleNameMixin, ruleMixinFunction as Rule);

module.exports = pluginRuleMixin;
