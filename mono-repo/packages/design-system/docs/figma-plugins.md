# Figma Plugins

We currently have five Figma plugins in place:


|App | Name in Figma                    | Description                                                                                      |
|--|----------------------------------|--------------------------------------------------------------------------------------------------|
|Color Grades App | ColorGrades                      | This app calculates accessible color shades                                                      |
| Reference Default Var Creation App | ReferenceVariableCreator         | This app sets default values for variables such as typography, sizing, etc. in reference files   |
| Semantic Color Brand App | Semantic Color Palette Generator | This app helps in linking the reference values to the semantic structure                         | 
| Variable Checker App | Design System - Variable Checker | This app validates the Figma workspace for certain violations of variable naming and structuring | 
| Variable Manager App | Semantic Variable Manager        | This app helps with moving variables on semantic layer to different collection or to relink the variable names between semantic collections |

## Developing plugins

Usually, you can easily start by using the Figma Starterkit.
We transformed the main settings so that we are able to have the plugins as part of the monorepo.
Unfortunately, this complicates the development as the build process in nx is deleting the previous folder,
letting Figma not find the update and those the Live Reloading is not working as expected and you have to reopen the plugin each.

You only have to run the `nx build` of the corresponding plugin and the build is executed.

In order to use the local version in Figma and you can test it before publishing, you have to link your build dist folder with Figma:
1. Click on the Figma Icon
2. Click on Plugins
3. Click on Development
4. Click on Manage Plugins in Development
5. In the opened window on the plugin, click on the three right dots and say locate local version
6. Select the manifest.json of the built version in the dist folder

## Publishing Plugins

For developing Figma plugins you need to have access to the plugin in Figma to publish a new version.
Currently, the following users are invited as plugin developers that are able to update the plugins:
- Stefan Gart
- Igor Radovanovic
- Honeybadgers Team Account
- Markus Nissl and Julia Rapczynska (push-based.io)

You can manage the invitations of who can access the project in Figma by
1. Clicking all workspaces on the left
2. Clicking on plugins
3. Selecting the plugin
4. Click manage resources on the top right and edit page
5. Click on permissions
6. Enter email and click on invite

Note that only one user can be the owner and changing the owner is only possible
after the user accepted the invitation. 

The actual publishing process is then as follows:
1. Click on the Figma Icon
2. Click on Plugins
3. Click on Development
4. Click on Manage Plugins in Development
5. In the opened window on the plugin, click on the three right dots, and then on publish new version
6. Provide in Release Notes the information what has been changed.
7. (Optional) Open Details and change the descriptions. These descriptions have to be provided the first time. Note that there the setting is set to Entain only, so the plugin needs no verification and is visible only to the Entain Workspace
7. Click publish version.

Note that due to the fact that we publish the plugins only for Entain internally, people who are not part of the workspace 
cannot access the plugins. To circumvent this issue, we share the local version with designers who will then import the local version
(and use this as we do during development). To share this version, go to build folder of the plugin and zip the plugin folder and sent 
it over to the designer who requested changes to the plugin.

## Documentation Links

https://www.figma.com/plugin-docs/
https://www.figma.com/plugin-docs/api/api-reference/
