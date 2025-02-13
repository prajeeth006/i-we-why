# DS Components CSS Variables Usage Audit

This audit helps you better understand what css variables that are exported from the generated styles are used and not used inside the design system components. 

### Example
Inside DS components we have styles like: 

```scss
@use '../../generated/styles/components/badge/badge' as ds-badge;

.ds-badge {
  --badge-font-family: 'GT America', sans-serif;

  @include ds-badge.shared;

  align-items: center;
  background: var(--badge-color-bg);
  border-radius: var(--badge-radius-border);
  box-sizing: border-box;
}
```

Inside the generated badge styles we have content like this: 

```scss
@mixin large {
    --badge-size-icon: var(--semantic-size-icon-small);
    --badge-space-inline: var(--semantic-spacing-inline-sm);
}

@mixin live {
    --badge-color-bg: var(--semantic-color-negative-base);
    --badge-color-border: #ffffff00;
    --badge-color-icon: var(--semantic-color-on-negative-base);
    --badge-color-text: var(--semantic-color-on-negative-base);
}
```

This audit will check all the css variables that are inside the generated badge styles if they are being used in the `badge.component.scss` file.
If it's not used it will show up in the report file like this: 

![unusedcssvars.png](assets%2Funusedcssvars.png)

This way, we can easily pinpoint which vars are missing inside our components and easily add them to the component.

If all the variables are used, they will show up like this: 

![usedcssvars.png](assets%2Fusedcssvars.png)

> Keep in mind that the variables starting with `--semantic` are skipped.