# design-system-ui

This library was generated with [Nx](https://nx.dev).

## Using components

- Import theme file (semantic from generated folder) into your `angular.json` styles array (or in your css bundle file).
```json
{
  "styles": [
    "@frontend/ui/generated/styles/betmgm/light/semantic.css"
  ]
}
```
- or
```css
@import '@frontend/ui/generated/styles/bwin/dark/semantic.css';
```


#### Import and use the component you want, for example (or in your module): 

```ts
import { DsPill } from '@frontend/ui/pill';

@Component({
    template: `
        <button ds-pill>Hello World!</button>
    `,
    standalone: true,
    imports: [DsPill]
}) 
export class CardCmp {}
```

## Running unit tests

Run `nx test design-system-ui` to execute the unit tests.

## Adding demo icons used in storybook only

You have only 3 small steps to add and use a new icon in storybook.
1. Place your svg icon in asset folder `packages\design-system\shared-ds-utils\src\assets\demo-icons`
2. Add to the interface `demo-icon-svg.interface.ts` icon name
3. Use the component ds-demo-icon with input iconName the name you just added