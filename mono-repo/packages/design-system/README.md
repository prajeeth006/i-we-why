# Tokens Export: How To
You can export the tokens from figma with
```
nx run design-system-figma-token-export-app:run <project>
```
but before that you have to add as environment variable your figma token
with the right permission of being able to **read variables**.
The export can be done for example via git bash on windows or on Unix-based systems with:
```
export FIGMA_API_TOKEN="<your token>"
```
Otherwise, you can also define it in your .env file.

After the successful export you can execute the build of the css files with
```
nx run design-system-tokens-to-css-app:generate-css-tokens <project> --skip-nx-cache
```

Project is one of:
- design-system
- casino§
- sports§

§ we already added the initial configuration, 
yet no app specific files are ready yet to be exported.

## New Figma files
You can edit the figma files that are considered during the export at
`packages/design-system/figma-token-export-app/src/assets/figma_file_keys.json`. 
The file_key is mandatory which can be found in the URL of the Figma file
`https://www.figma.com/file/<main_file_key>/branch/<branch_file_key>`
You can either use the main file or if you want to work with a branch you can work with the branch file key.

# Storybook

To run storybook, run the following command
```
nx run design-system-storybook-host-app:storybook
```

To test storybook, storybook must be running and then run the following command
```
nx run design-system-storybook-host-app:test-storybook
```

# Figma Webhook
For local development you need a proxy.
This can be achieved by installing ngrok

```
npm install -g ngrok
```

and then starting the tunnel

```
ngrok http 3333
```

If you use the free version, be aware that the session expires after two hours.


For receiving webhooks for Figma you
* have to be admin of the team
* require an API token
* know the team id
* register the webhook (for example with the webhook plugin in figma) for the ~~FILE_VERSION_UPDATE, FILE_DELETE (included in FILE_UPDATE, but FILE_UPDATE is not required) and~~ LIBRARY_PUBLISH event.

If you stop working, please also unregister your webhooks.

In Figma, you can create a new file version by:
* manually creating a new version over the menu
* creating or merging branches
* publishing as library
* ...

One can see each version in the file history.

In Figma, one can trigger a FILE_DELETE event when a branch is archived or a file is deleted.

In Figma, one can trigger a LIBRARY_PUBLISH event if the main file (branch is not possible) is published as library.

In the first version, we only listen to the LIBRARY_PUBLISH event and create one MR 
collecting all LIBRARY_PUBLISH events of the different files.
