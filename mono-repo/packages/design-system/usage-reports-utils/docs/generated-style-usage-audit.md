# DS Components Generated Styles Usage Audit

This audit helps you better understand which components are not using the generated style files (that include the css variables needed for the DS system)

### Example
Inside DS components we have styles like:

```scss
@use '../../generated/styles/components/badge/badge' as ds-badge;

.ds-badge {
  // ... removed for brevity
  align-items: center;
  background: var(--badge-color-bg);
  border-radius: var(--badge-radius-border);
  box-sizing: border-box;
}
```

This audit will check all imports of the component styles and check if it uses the generated styles file, if not it will show up in the audit report like this: 

![generated-styles-usage.png](assets%2Fgenerated-styles-usage.png)

The ones with `error` should be fixed, while the one with `info` severity are already using the generated style files.