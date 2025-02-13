# Deprecation Handling

When we generate theme and component styles, there are times when we add `@deprecated` comment on top of the generated variables 
which do not exist in Figma anymore. We don't remove these tokens (generated variables) because they may have been used, so we need 
to migrate our components to not use them anymore in order to remove the deprecated variables. 

In DS, we have an app which collects all the deprecated tokens that are not used anymore, and that are safe to be removed. 

```bash
nx run ds-deprecation-app:all
```

This script executes both steps of the following description.
You may have to run the script several times as circular dependencies are not handled automatically (you can check for changes by using git and added changing with git add before).
Before running the script again or in other words, always after executing the script, we recommend to also regenerate the css again to have a clean state.
For this run the well-known command from the extraction script:

```bash
nx run design-system-tokens-to-css-app:generate-css-tokens --skipNxCache
```

---

In order to collect all these tokens you need to run: 

```bash
nx run ds-deprecation-app:generate-safely-removable-deprecated-tokens-list
```

This command will generate a file called [safely-removable-tokens.txt](..%2Fui%2Fgenerated%2Fsafely-removable-tokens.txt) inside `/packages/ui/generated` folder.

In order to remove all those tokens from the generated files which declare these tokens, you can run: 

```bash
nx run ds-deprecation-app:remove-safe-deprecated-tokens
```

Running it will:
- Remove tokens from semantic but also generated component styles
- Clean up all the empty mixins after the tokens are removed
- Delete the file if it's empty after the cleanup
- Updates the json files based on the removed variables
- Checks for duplicate paths issues that can be resolved automatically











