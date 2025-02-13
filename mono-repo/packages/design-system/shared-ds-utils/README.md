# Shared Design System Utils

## Themes

We provide helper function to get all available themes.
You can use `getDesignSystemThemes` or `getThemeparkThemes` for
a different format of theme structure. The first works per
defined brand theme in Figma, the second via defined themepark classes,
so you get for each theme one entry (e.g., mgm-3,mgm-2,mgm-4 instead of only mgm-4).

For native access to the theme structure you can import `THEME_LIST`
