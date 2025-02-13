module.exports = {
    ...require('./packages/dev-kit/src/lint-staged/index'),
    'packages/themepark/**/*.scss': 'nx lint-styles-staged themepark-app --quiet',
    'packages/design-system/ui/**/*.scss': 'nx lint-styles-staged design-system-ui --quiet',
    'packages/sports/**/*.scss': 'nx lint-styles-staged sports-web-app --quiet',
    'packages/casino/ui-lib/**/*.scss': 'nx lint-styles-staged casino-ui-lib --quiet',
    'packages/myaccount-app/**/*.scss': 'nx lint-styles-staged myaccount-app --quiet',
};
