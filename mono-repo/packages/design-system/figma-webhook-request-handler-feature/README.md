# design-system-figma-webhook-request-handler-feature

This library was generated with [Nx](https://nx.dev).

## Building

Run `nx build design-system-figma-webhook-request-handler-feature` to build the library.

## Running unit tests

Run `nx test design-system-figma-webhook-request-handler-feature` to execute the unit tests via [Jest](https://jestjs.io).

## Documentation

![Webhook Logic](../docs/assets/images/webhook-logic.png "Webhook Logic")

The webhook logic for library publish event is structured as follows (see image):
* Download Current Tokens from Main Branch
* Download Tokens from Changed Figma File
* Compare changes only for tokens that are part of figma file and add deprecation flag etc. (so we get multiple files per figma file and we compare only those)
* Upload these updates to branch (so branch contains the changed files from figma, but with this trick before, it always handles deprecation compared with main gitlab file)
* It just has issues with file deletions inside branch, therefore we get branch files and compare whether there is a file that should be deleted and make an additional commit in case
* Download now the tokens from the branch and store them in a temporary folder
* Run Style Dictionary to get generated css in temporary folder
* Download CSS files from Repo
* Create Commit containing created and updated CSS files and files missing (by comparing with downloaded css files)
* Delete Local folder
* Create Merge Request if not exists 

In case of an error during converting Tokens to CSS files (i.e., some issues with variable references),
we remove all css files that have not been produced in the output due to an error.
With this, theming will fail, storybook looks broken and the reviewing process with visual testing should reject the changes.