# Contributing to Design System Components

### Developing components

- Make sure the component selector starts with `ds-`. Ex: `ds-search` (enforced by an eslint rule)
- Make sure the component class name starts with `Ds`. Ex: `DsSearch` (enforced by an eslint rule)
- Make sure internal component css classes start with `.ds-`. Ex: `.ds-input-group`.
- You don't have to prefix the class with `Component` or `Directive` 
  - Example. It's OK to have a component called `DsSearch` instead of the longer name `DsSearchComponent`
- Always use `ChangeDetectionStrategy.OnPush`
- If the template is smaller than 50 lines, include it directly in the `.ts` file (inline templates)
- Make sure component is added as a secondary entry point.
- Every component, directive or pipe should be standalone.
- Create at least one Storybook story for the default state of the component

### Including styles

- The component should get the main style tokens from the generated files found in: 
  `packages/design-system/ui/generated/styles/components`

- Can be imported as:
  `@use '../../generated/styles/components/pill/pill' as ds-pill`

### Adding demo icons used in storybook only

You have only 3 small steps to add and use a new icon in storybook.
1. Place your svg icon in asset folder `packages\design-system\shared-ds-utils\src\assets\demo-icons`
2. Add to the interface `demo-icon-svg.interface.ts` icon name
3. Use the component ds-demo-icon with input iconName the name you just added

### Usage report

To have usage reports on how css variables are being used, or if deprecated css variables are being used,
we can generate usage reports using the tool described here: [Usage Report Readme](..%2Fusage-reports-utils%2FREADME.md)

## Documentation

### How to get correct Figma link for specific component (stories) in Figma

1. Select a Component:
- Open your Figma file and navigate to the component you want to have a link for.
- On the left-hand side panel, select the component. This will display its layers.
2. Drill Down into Layers:
- Expand the component by clicking on the arrow next to its name to go one level deep into its layers.
- Identify the specific child node you need to link to within the component.
3. Right-Click on the Child Node:
- Right-click on the child node you have selected.
- This will open a context menu.
4. Copy Link to Selection:
- In the context menu, navigate to the top option for "Copy/Paste as".
- Select the "Copy link to selection" option from the submenu.
- This will copy a link to the particular node ID in the file to your clipboard.

### Note: The link you copied will look something like this:

<div style="background-color: #f0f8ff; padding: 15px;">
https://www.figma.com/design/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?node-id=9508-43236&t=fS1qO73SS8lGciLj-4
</div>

## Changing the Link format:

## You'll need to modify the copied link to include additional parameters:

- type=design
- mode=design

### Here's the updated link format:

<div style="background-color: #f0f8ff; padding: 15px;">
https://www.figma.com/file/NgrOt8MGJhe0obKFBQgqdT/Component-Tokens-(POC)?type=design&node-id=9508-43236&mode=design&t=fS1qO73SS8lGciLj-4
</div>
