// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const deprecatedCss = require('./rules/deprecated-css');
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const deprecatedMixins = require('./rules/deprecated-mixins');

module.exports = [deprecatedCss, deprecatedMixins];
