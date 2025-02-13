# DS Components @mixin-s Usage Audit

This audit helps you better understand which `mixins` from the generated style files are not being used by the DS Components.

### Example
Inside DS components we have styles like:

```scss
@use '../../generated/styles/components/badge/badge' as ds-badge;

.ds-badge {
  @include ds-badge.shared;

  align-items: center;
  background: var(--badge-color-bg);
  border-radius: var(--badge-radius-border);
  box-sizing: border-box;
  
  &.large {
    @include ds-badge.large;
  }
}
```

Inside the generated badge styles we have content like this:

```scss
@mixin shared {
  --badge-color-success-icon: var(--semantic-color-positive-base);
  --badge-radius-border: var(--semantic-radius-semi-rounded-sm);
}

@mixin large {
  --badge-size-icon: var(--semantic-size-icon-small);
  --badge-space-inline: var(--semantic-spacing-inline-sm);
  --badge-space-padding-bottom: var(--semantic-spacing-container-padding-xxs);
  --badge-space-padding-left: var(--semantic-spacing-container-padding-xs);
  --badge-space-padding-right: var(--semantic-spacing-container-padding-xs);
  --badge-space-padding-top: var(--semantic-spacing-container-padding-xxs);
}
```

This audit will check all the `mixins` that are inside the generated badge styles if they are being used in the `badge.component.scss` file.
If it's not used it will show up in the report file like this:

![mixinsusage.png](assets%2Fmixinsusage.png)

The ones with `error` should be fixed, while the one with `info` severity are already using all the mixins.