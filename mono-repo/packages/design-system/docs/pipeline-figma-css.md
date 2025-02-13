# Pipeline Figma -> CSS

## Overview

This document contains an overview of the export pipeline describing the key functionality of each used technology as well as how they play together for the used pipeline.

In a big picture the pipeline can be sketched with following image:

![Pipeline Overview](docs-assets/pipeline-overview.png "Pipeline Overview")
Our source of truth for the tokens is Figma and the structure applied in Figma and apply the following:

1. Export the variables and transform into W3C Token Standard Draft
2. Transform these documents with style dictionary to the CSS documents.
3. Use the CSS inside components

## Figma

The aim is to enforce as less internal structure in Figma as possible (file names, working mode, ...). Yet, we impose several requirements to have an automated and efficient solution.

For the pipeline to work automatically:

- For the usage of webhooks we require an own team where we can install the webhooks on.
- All files that should be considered when exporting need to be part of this team.

For the correct separation of variables between brands (reference and semantic tokens):

- The collection must start with reference or semantic
- The first part of the mode is the brand the second part (if provided) is the theme (light, dark)

For the correct separation of variables between components (component level):

- The collection is not allowed to start with reference or semantic
- The collection name uniquely defines a component
- There is only one mode allowed

For the optimized assignment of variables inside one component:

- The first group level is considered as variant
- Variants of the same type (e.g., size [small, medium, large, ...]
  or color [primary, secondary, tertiary, primary-outline, ...]) should share the same groups and variable names

### Manual Export

Figma Files are uniquely defined per a key or branch key. This key can be extracted by the

```
https://www.figma.com/file/<file key>
https://www.figma.com/file/<file key>/branch/<branch file key>
```

You need either the file key (to export the main file) or the branch file key (to export the branch).

This key can be added inside the figma-token-export-app/src/assets/figma_fike_keys.json.

The name inside each object you find in the file is just used for a human-readable description of the file.

The only relevant parameter for the export is the file key.

> **Do not forget to add new files from Figma in case you have not run the export for some time**

## Figma -> W3C Token Standard

The variables endpoint from Figma is described at [https://www.figma.com/developers/api#variables](https://www.figma.com/developers/api#variables).
The export code can be found in figma-export-feature and does the following:

- Download variables
- Create an internal representation that flattens the structure to following key [variableCollectionName, modeName, group1, ... groupN, variableName]
  and standardize values
- Group variables of files into groups (e.g., reference betmgm, reference sportingbet or semantic betmgm light or semantic whitelabel default)  
- Per Group create a W3C representation
- Compare each group with existing group in file system and deprecate non-existing variables
- Write new groups (+ deprecated variables) to disk (stored in tokens-assets)

## W3C Token Standard -> CSS

For the generation of CSS we use Style Dictionary (in the current Version 3).

Style Dictionary is build tool that reads token files and transform them into platform-specific (SCSS, Flutter, iOS, ...) representations.

![Style Dictionary Pipeline](docs-assets/style_dict_pipeline.png)

### Parser

Style Dictionary requires as input a certain object structure, which is as follows:

```
{
    "<group name>": {
        "<sub group name ... arbitrary depth>": {
            "<token name>": {
                "value": <some value you want> (mandatory)
                "comment": <a description of the token> (optional)
                "themeable": <whether your variable is themeable, e.g. !default in SASS) (optional)
                <custom attribute>: <custom value> (optional)
            }
        }
    }
}
```

Comparing this object structure with the current W3C Token Draft, there are following differences:

- value is $value
- comment is $description
- any other values are part of $extensions, kept to developers to use however the like

Therefore, the **first step** is to define a custom parser that is able to convert the W3C Token Draft into a format style dictionary can read (found in tokens-to-css-feature/src/lib/extensions/parsers).

### Config File

Next to the input files, Style Dictionary needs a configuration that describes which input files should be read and how they should be transformed and written to disk.

We create this configuration dynamically (tokens-to-css-feature/src/lib/generate-configs.ts).

Here we do basically the following:

- read the token assets folder to understand which brands and themes as well as components exist
- for each theme (reference file (brand) + semantic file (theme)) we generate a unique configuration for generating the semantic file for this configuration. This semantic file is then loaded once globally by the browser depending on the brand that is accessed and theme selected.
- for each component we generate a unique configuration as well. This configuration is used inside the design library
and contains the variables required for the component defined (in Figma).

**Semantic file:**

```
{
    "source": [
        <reference file of brand>
        <semantic file of theme>
    ],
    "platforms": {
        scss: {
            transforms: ['attribute/cti', 'name/kebab', 'custom/length-zero-no-unit', 'custom/length-add-unit-where-missing'],
            buildPath: `styles/${brand}/${theme}/`,
            files: [
                {
                    destination: 'global.scss',
                    format: 'scss/variables',
                    filter: 'isGlobalToken',
                    options: {
                        outputReferences: false,
                        showFileHeader: false,
                    },
                },
            ],
        },
        css: {
            transforms: ['attribute/cti', 'name/kebab', 'custom/length-zero-no-unit', 'custom/length-add-unit-where-missing'],
            buildPath: `styles/${brand}/${theme}/`,
            files: [
                {
                    destination: 'global.css',
                    format: 'customThemeCss',
                    filter: 'isGlobalToken',
                    options: {
                        cssSelector: `.${brand}`,
                        outputReferences: false,
                        showFileHeader: false,
                    },
                },
                {
                    destination: 'semantic.css',
                    format: 'customThemeCss',
                    filter: 'isSemanticToken',
                    options: {
                        cssSelector: `.${brand}.${theme}`,
                        outputReferences: false,
                    },
                },
            ],
        },
    }
}
```

In the platform we generate three files, two files containing only the tokens of the reference file (one css and one scss version).

This file is not used in the design system, but in case someone has to reference the value (e.g., themepark during migration)
it can access the lowest-level tokens. Hence, for description we explain the parameters by the semantic.css file.

- Build Path and destination combined describe the path of the location the file is placed
- Transforms are applied before the file is written (details follow)
- Filter allows to remove tokens that should not be formatted by format.
- Format describes how the internal representation of the tokens in style dictionary is formatted.

**Component File:**

```
{
    source: [
        <reference to one reference file>
        <reference to one semantic file>
        <reference to component file>
    ],
    platforms: {
        css: {
            transforms: ['attribute/cti', 'name/kebab', 'custom/length-zero-no-unit','custom/length-add-unit-where-missing'],
            buildPath: `styles/components/${component}/`,
            files: [
                {
                    destination: `${component}.scss`,
                    format: 'customComponentScss',
                    filter: 'isComponent',
                    options: {
                        outputReferences: true,
                    },
                },
            ],
        },
    },
}
```

There is no big difference from the parameters compared to the semantic file.

The only relevant addition here is that Style Dictionary requires all variables to be present that should be resolved. Therefore, even if not required in the output, we have to provide them.

This is the reason why we add one reference and semantic file to the transformation, which tokens we filter out with the custom filter. Note, as this is a workaround this script produces various warnings that one filters out values that are referenced to which can be ignored. We already issued a feature request to support such settings without warnings.

### Transforms

Style Dictionary allows to transform the tokens in several dimensions:

- value transforms target the `value` property and transforms this property
- attribute transforms allow to modify any attribute of the object
- name transforms, which should be only used once, allow to modify the token name

**attribute/cti**: is an opinionated attribute transform, that assigns the group levels to certain attributes:

- category (group level 1, e.g., color)
- type (group level 2, e.g., background)
- item (group level 3, e.g., button)
- sub item (group level 4, e.g., primary)
- state (group level 5, e.g., active)

In general, as we have to deal with multiple brands (which are encoded in the first layer) we cannot follow this scheme by default and we would have to write our own transformation. However, we just apply to get the first groups mapped to attributes in case we want to check some theme specific properties (what we do in the filters -- see below).

**name/kebab** is a name transformation that transforms a name into kebab case

**custom/length-zero-no-unit** is a custom transform found in tokens-to-css-feature/src/lib/extensions/transforms, that removes any unit from a value that has zero value (e.g., 0px -> 0, 0rem -> 0 and so on)

**custom/length-add-unit-where-missing** is a custom transform found in tokens-to-css-feature/src/lib/extensions/transforms, that adds a unit to a numeric property when it is missing (e.g., 3 -> 3px)

***custom/escape-font-family*** is a custom transform that escapes font families so that if they contain a space they are quoted (e.g. Roboto Condensed -> "Roboto Condensed")
### Filters

The filters we apply are defined in tokens-to-css-feature/src/lib/extensions/filters.

They do exactly what the name do and check whether it is such a token based on the first group level(category).

### Formats

Formats describe how the tokens are formatted so that the resulting string can be written to the output. There exist certain default values, however in our use case of class-based automation optimization the default formats do not work, so we defined our own ones in  tokens-to-css-feature/src/lib/extensions/formats.

**scss/variables** is a pre-defined output that outputs the variables as follows:

```
$<variable name>: <variable value>
```

It supports following options:

- showFileHeader, if true includes in a header the build date (default true)
- outputReferences, if true, a reference to a value instead of the final value is rendered (default false)
- themeable, if not defined, whether the token should include !default (default false)

**customThemeCss** is a custom format for the semantic layer that takes into account that we want to output the css variables inside a custom class so that we can use class-based theming. The current css/variables default formatter usually just outputs all variables inside `:root` css selector.

In addition, we extended the support for `outputReferences` that we can also configure with the property `outputReferenceFallbacks` when `outputReferences` is true, whether the resolved variables should be put as a default parameter.

**customComponentScss** is a custom format for the component layer that understands that our first group level is a variant and groups the tokens on the first group level and renders a unique class per group. This allows to have class-based variants and improves the automation process.

## Webhook Automation

In order to create pull requests automatically, we added support for webhooks.For this, we have the figma-webhook-app and figma-webhook-request-handler.

The app is a node.js/express application that listens to requests from Figma.

Whenever the library is published in Figma, it receives the event that contains the file key.

It downloads the latest variables of the file.

> **Warning** it cannot access the variables of the published version, we can only access the latest version at the moment. So in case some changes happen between publihsing and reading, then we would get them as well.

Then it executes the process above with a special git syncing logic so that it considers deprecations correctly
and publishes the changed files to git.

The details can be found in the Readme of the exported file
[Webhook Logic](https://vie.git.bwinparty.com/vanilla/monorepo/-/blob/main/packages/design-system/figma-webhook-request-handler-feature/README.md)
![Webhook Logic](docs-assets/webhook-logic.png "Webhook Logic")
