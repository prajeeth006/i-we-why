# 🕵️ Design System Usage Reports/Audits 📋

## Code PushUp plugin for detecting styles usage in the design system components

### Run the audit
The audit runner is an Nx project.

```bash
yarn nx run design-system-ui:code-pushup-ds-report
```

By running the audit, a `report.json` and `report.markdown` report file will be generated.

You can find them in: `/.code-pushup` folder.

🔗[Quick link to the generated report](..%2F..%2F..%2F.code-pushup%2Freport.md)

### Understand the audit
When you open the markdown report file, you will see something like:

![codepushup-report.png](docs%2Fassets%2Fcodepushup-report.png)

---

Inside the `Audits` section you will be able to look at the information for each audit that has been executed against the current design system components.

To understand more about each audit read this links:

- [DS Components Generated Styles Usage Audit](docs%2Fgenerated-style-usage-audit.md)
- [DS Components CSS Variables Usage Audit](docs%2Fcss-variables-usage-audit.md)
- [DS Components @mixin-s Usage Audit](docs%2Fmixins-usage-audit.md)

---

## Code PushUp plugin for auditing design system components adoption

### Add plugin
In order to be able to run DS adoption report as a separate task independently of default CPU config, complete the following steps:
1. Create file `code-pushup.ds-adoption-reports.config.ts` in project package.
2. Add the following configuration for plugin:
```ts
import { mergeConfigs } from '@frontend/code-pushup-utils';
import {dsAdoptionReportConfig} from '@design-system/usage-reports-utils';

export default mergeConfigs(
    {
        persist: {
            outputDir: '.code-pushup/packages/sports-web-app', <--- app name
            format: ['json', 'md'],
        },
    },
    await dsAdoptionReportConfig ({
        directory: 'packages/sports/web/app', <--- app path
        projectSlug: 'sports-ds-report', <--- unique project slug
        reportsTitle: 'Sports DS Report', <--- unique  reports title for MR separation
    }),
);
```
3. Add replacements in ```dsAdoptionReportConfig```
```ts
    await dsAdoptionReportConfig ({
        ...
        replacements: {
            'ms-tab-bar': {
                componentName: 'DSTabsModule',
                    storybookLink: 'https://storybook.entaingroup.corp/latest/?path=/docs/components-tabsgroup--overview',
            },
        },
    }),
);
```
Replacements provide a list of app-specific classes & component selectors that should be replaced by DS components. Default set of components is based on Themepark classes used globally.
4. In `project.json`, add target for running report:
```json
"code-pushup-ds-report": {
            "executor": "nx:run-commands",
            "options": {
                "commands": [
                    "npx @code-pushup/cli --config=${path}/code-pushup.ds-adoption-reports.config.ts --tsconfig=tsconfig.base.json --progress=false"
                ]
            }
        },
```
