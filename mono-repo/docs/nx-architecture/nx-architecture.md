# Nx Architecture

This documentation will cover the different aspect of the Nx architecture for that monorepo.

## Workspace Layout

The workspace layout is the main structure of your repository. You

You can specify the structure of the Nx projects in the [`nx.json`](../../nx.json):

```json
    "workspaceLayout": {
        "appsDir": "packages",
        "libsDir": "packages",
        "projectNameAndRootFormat": "as-provided"
    },
```

We use by default the `as-provided` options when generating new projects ([Nx Doc](https://nx.dev/deprecated/as-provided-vs-derived#generate-paths-and-names))

### /packages

As you can see in the configuration, we are using only one folder to regroup all Frontend Nx Projects: `packages`. This is folder will contain Applications and Libraries. Each project will be grouped per `Team/Product` domain. All shared Nx projects will be at the root level.

```
├── packages
│   ├── nx-plugin --> shared custom executor/generator
│   ├── dev-kit --> shared common configurations
│   ├── design-system --> domain/group
│   │   ├── figma-data-access --> data-access library
│   │   ├── nx-plugin --> specific custom executor/generator
│   │   └── ui --> Angular library
│   ├── themepark --> domain/group
│   │   ├── app --> application
│   │   ├── nx-plugin --> specific custom executor/generator
│   │   ├── themes --> Themes libraries
│   │   └── themes-data-utils --> Utils library
│   └── vanilla --> domain/group
│       ├── lib --> Angular library
│       └── nx-plugin --> specific custom executor/generator
└── nx.json
```

### /backend

Not directly related to the Nx configurations, we also specified a `backend` folder for all .net code. The backend project are also grouped per `Team/Product` domain.

```sh
├── backend
│   ├── nx-plugin --> specific custom executor/generator
│   ├── vanilla --> domain/group
│   └── virtualsports --> domain/group
└── Frontend.sln --> global solution
```

### /tools

We also have a `tools` folder that contains some scripts useful for the CI and the maintenance of the monorepo.

```sh
├── tools
│   ├── apis
│   └── ci
│       ├── affected --> pipeline configuration
│       ├── certificate --> Nx Cloud configuration
│       ├── common --> pipeline templates
│       ├── deploy --> job configuration
│       ├── quality --> pipeline configuration
│       ├── release --> pipeline configuration
│       ├── scripts --> shared scripts by pipelines
│       ├── workspace-validation --> pipeline configuration
└── tsconfig.json
```

## Nx Projects Naming Conventions

To be able to categorize the Nx projects and stay consistent within the monorepo, it is important to follow a naming convention.

That convention will be specified both on the folder structure and then reflected in the Nx project names.

Projects name and path should follow the following convention `*-{SUFFIX}` where SUFFIX can be one of the following type:

- **app** eg: `themepark-app`
- **utils**, eg: `themes-data-utils`
- **kit**, eg: `dev-kit`
- **nx-plugin**, eg: `themepark-nx-plugin`
- **theme**, eg: `themepark-betboo-theme`
- **lib**, eg: `vanilla-lib`
- **feature**, eg: `vanilla-account-menu-feature`
- **ui**, eg: `vanilla-account-menu-ui`
- **data-access**, eg: `vanilla-account-data-access`
- **storybook**, eg: `design-system-storybook`

The name is defined in the `project.json` file at the project root.
The path is computed from the workspace root to the `project.json` file.

## Nx Boundaries

As described in the [Nx documentation](https://nx.dev/recipes/enforce-module-boundaries), we can specify boundaries to keep the Nx projects isolated.

We specified 2 dimension:

The `project.json` file should contain a `tags` property with the following tags convention:

- `type:<type>` where `<type>` can be one of the naming convention above.
- `scope:<scope>` where `<scope>` is the domain name.

Here is a correct example:

```json
{
  "tags": ["scope:vanilla", "type:app"]
}
```


> **Note**: An exception is made for the `ci:long-tasks` tag that is used to identify projects containing long tasks and optimize parallelization in the CI.
