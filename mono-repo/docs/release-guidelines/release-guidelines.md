# Release Guidelines

This documentation will cover how to make a release of one or multiple libraries in the monorepo.

![release-process.png](./images/release-process.png)

It is recommended to always run a beta release before an official one

## Project Configurations

You can find more information about the publish executor and the release executor here: [packages/nx-plugin/README.md](../../packages/nx-plugin/README.md)

## CI

We recommend to execute a release in the pipeline only to avoid unconsistent state in git tags, npm registry, changelog, ...

The list of jobs are automatically created by scanning the monorepo and discovering all release projects/targets.

![release-ci.png](./images/release-ci.png)

Each release is a manual execution. You can override the `VERSION_BUMP` by using job parameter:

![release-bump-param.png](./images/release-bump-param.png)