import { IFigmaClient } from '@design-system/figma-data-access';
import { getPathAndDataFromDrafts, handleExtractWithDeprecationToken, loadExistingTokenFromMemory } from '@design-system/figma-export-feature';
import { TokenPathName, TokenPathType, getFigmaFiles, getTokenPaths } from '@design-system/token-path-config-utils';
import { runGeneration } from '@design-system/tokens-to-css-feature';
import { W3CTokenDocument } from '@design-system/w3c-token-standard-utils';
import { Gitlab } from '@gitbeaker/rest';
import * as fs from 'fs/promises';
import log4js from 'log4js';

import { GitlabOptions } from '../gitlab/gitlab-options.types';
import { createComment, createCommit, createOrUpdateMr, getAllFiles, getAllFilesWithoutContent, setPipelineStatus } from '../gitlab/helper.utils';
import { BRANCH_PREFIX, getFilesRecursiveFromDirectory } from '../utils';

/**
 * This function is used to export the tokens/variables from figma and create them as a branch in gitlab
 *
 * @param appName
 * @param tokenPathConfig
 * @param figmaClient
 * @param gitlabApi
 * @param gitlabOptions
 */
async function handleFigmaTokenSync(
    appName: TokenPathName,
    tokenPathConfig: TokenPathType,
    figmaClient: IFigmaClient,
    gitlabApi: InstanceType<typeof Gitlab<false>>,
    gitlabOptions: GitlabOptions,
) {
    const logger = log4js.getLogger();
    // Download files from main git
    const mainFiles = (await getAllFiles(tokenPathConfig.jsonTokensPath, gitlabApi, gitlabOptions.projectId)).map((x) => ({
        file_path: x.file_path,
        content: Buffer.from(x.content, 'base64').toString('utf-8'),
    }));
    const data = await Promise.all(
        mainFiles.map(async (file) => loadExistingTokenFromMemory(tokenPathConfig.jsonTokensPath, file.file_path, file.content)),
    );
    const filePathToContent = Object.fromEntries(mainFiles.map((x) => [x.file_path, x.content]));

    const transformed = data.reduce(
        (all, curr) => ({
            ...all,
            [curr.name]: curr.content,
        }),
        {} as Record<string, W3CTokenDocument>,
    );

    // We get all files to ensure there are no rebasing or other issues
    const figmaFiles = getFigmaFiles(appName).map((x) => ({ fileKey: x.fileKey }));

    // We scan for deprecations, as we compare with main branch and add deprecations to everything, so no file can be deleted
    let w3cDrafts: Record<string, W3CTokenDocument> = {};
    let errorMessage: string | undefined;
    try {
        w3cDrafts = await handleExtractWithDeprecationToken(figmaFiles, figmaClient, transformed, { deprecateFileOnly: true });
    } catch (e) {
        if (e instanceof Error) {
            errorMessage = e.message;
        }
    }
    const filesAndData = getPathAndDataFromDrafts(w3cDrafts, tokenPathConfig.jsonTokensPath);

    const commitableFiles = filesAndData.filter((x) => x.data !== filePathToContent[x.path]);

    logger.info(`Create commit with ${commitableFiles.length} files`);

    // Commit token changes
    const commitId = await createCommit(
        appName,
        gitlabApi,
        gitlabOptions.projectId,
        `${BRANCH_PREFIX}/mr-main-${appName}`,
        commitableFiles,
        'changed Figma tokens',
        true,
    );
    if (errorMessage) {
        await createComment(gitlabApi, gitlabOptions.projectId, commitId, errorMessage);
        await setPipelineStatus(gitlabApi, gitlabOptions.projectId, commitId, 'failed', errorMessage);
        return false;
    }

    // After we created the commit (the first time we would not have a commit to check), we can check whether we have files that should be deleted in the target branch,
    // so there are any files that have been added by a previous commit but are not part of the main or the current file
    // Note with the change to overwrite branch, this should not be triggered
    const branchFiles = await getAllFilesWithoutContent(
        tokenPathConfig.jsonTokensPath,
        gitlabApi,
        gitlabOptions.projectId,
        `${BRANCH_PREFIX}/mr-main-${appName}`,
    );
    const writeFiles = filesAndData.map((f) => f.path);

    const relevantFiles = branchFiles.filter((filePath) => writeFiles.indexOf(filePath) < 0);

    // Trigger delete in case something has to be deleted
    if (relevantFiles.length > 0) {
        const deleteData: { data: string | null; path: string }[] = [];
        relevantFiles.forEach((filePath) => {
            deleteData.push({
                data: null,
                path: filePath,
            });
        });

        logger.info(`Create delete commit with ${commitableFiles.length} files`);
        // Commit deletion
        await createCommit(appName, gitlabApi, gitlabOptions.projectId, `${BRANCH_PREFIX}/mr-main-${appName}`, deleteData, 'deleted Figma tokens');
    }

    return true;
}

/**
 * This function downloads the token files from git, run css generation and uploads the generated css to git again
 *
 * @param appName
 * @param tokenPathConfig
 * @param gitlabApi
 * @param gitlabOptions
 */
async function handleCssSync(
    appName: TokenPathName,
    tokenPathConfig: TokenPathType,
    gitlabApi: InstanceType<typeof Gitlab<false>>,
    gitlabOptions: GitlabOptions,
) {
    const logger = log4js.getLogger();

    const workingDir = new Date().getTime();

    // Download tokens from branch (latest version with all changes)
    logger.info('Download branch data');
    const dsPath = getTokenPaths(TokenPathName.DesignSystem).jsonTokensPath;
    const branchFiles = [
        ...(await getAllFiles(tokenPathConfig.jsonTokensPath, gitlabApi, gitlabOptions.projectId, `${BRANCH_PREFIX}/mr-main-${appName}`)),
        // Add DS tokens (semantic and reference) for running css generation if file is not a ds file
        ...(dsPath === tokenPathConfig.jsonTokensPath
            ? []
            : await getAllFiles(
                  getTokenPaths(TokenPathName.DesignSystem).jsonTokensPath,
                  gitlabApi,
                  gitlabOptions.projectId,
                  `${BRANCH_PREFIX}/mr-main-${appName}`,
              )),
    ];

    await Promise.all(
        branchFiles.map(async (file) => {
            const filePath = `tmp/${workingDir}/${BRANCH_PREFIX}/mr-main-${appName}/${file.file_path}`;
            const folderPath = filePath.substring(0, filePath.lastIndexOf('/'));
            await fs.mkdir(folderPath, { recursive: true });
            await fs.writeFile(filePath, Buffer.from(file.content, 'base64').toString('utf-8'));
        }),
    );

    // Run style dictionary
    logger.info('Create CSS');

    let errorMessage: string | undefined;
    let logMessage = '';
    try {
        // We rewrite console.log to collect output messages from style dictionary to provide infos in git as comment in case of error
        // eslint-disable-next-line no-console
        const origLog = console.log;
        // eslint-disable-next-line no-console
        console.log = function (...args) {
            origLog.call(this, ...args);
            logMessage += args[0];
        };
        await runGeneration({
            tokenStoragePath: `tmp/${workingDir}/${BRANCH_PREFIX}/mr-main-${appName}/${tokenPathConfig.jsonTokensPath}`,
            outputPath: `tmp/${workingDir}/${BRANCH_PREFIX}/mr-main-${appName}/${tokenPathConfig.cssTokensPath}`,
            error: 'throw',
            tokenPathPrefix: `tmp/${workingDir}/${BRANCH_PREFIX}/mr-main-${appName}/`,
        });
        // eslint-disable-next-line no-console
        console.log = origLog;
    } catch (e) {
        if (e instanceof Error) {
            errorMessage = `${e.message}\`\`\`${logMessage}\`\`\``;
        }
    }

    // Download css files to check for deleted files
    const cssFiles = await getAllFilesWithoutContent(
        tokenPathConfig.cssTokensPath,
        gitlabApi,
        gitlabOptions.projectId,
        `${BRANCH_PREFIX}/mr-main-${appName}`,
    );

    // Read all generated files with data for commit
    const filesAndData2: { data: string | null; path: string }[] = await Promise.all(
        getFilesRecursiveFromDirectory(`tmp/${workingDir}/${BRANCH_PREFIX}/mr-main-${appName}/${tokenPathConfig.cssTokensPath}`).map(
            async (filePath) => ({
                data: await fs.readFile(filePath, 'utf-8'),
                path: filePath.substring(`tmp/${workingDir}/${BRANCH_PREFIX}/mr-main-${appName}/`.length),
            }),
        ),
    );

    // All files that do not exist, but have existed beforehand are added as null, so that they are deleted.
    cssFiles.forEach((filePath) => {
        if (filesAndData2.filter((x) => x.path === filePath).length === 0) {
            filesAndData2.push({
                data: null,
                path: filePath,
            });
        }
    });

    // Delete folder
    logger.info('Clean up local');
    await fs.rm(`tmp/${workingDir}`, { recursive: true, force: true });

    // Commit css changes
    logger.info('Commit CSS');
    const commitId = await createCommit(
        appName,
        gitlabApi,
        gitlabOptions.projectId,
        `${BRANCH_PREFIX}/mr-main-${appName}`,
        filesAndData2,
        'css updated',
    );
    if (errorMessage) {
        await createComment(gitlabApi, gitlabOptions.projectId, commitId, errorMessage);
        await setPipelineStatus(gitlabApi, gitlabOptions.projectId, commitId, 'failed', 'The (S)CSS could not be generated successfully');
    } else {
        await createComment(gitlabApi, gitlabOptions.projectId, commitId, 'Webhook executed without errors');
        await setPipelineStatus(gitlabApi, gitlabOptions.projectId, commitId, 'success', 'Webhook executed without errors');
    }
}

/**
 * This method handles the Figma webhook event of a library publish
 * @param figmaClient the figma client to sent requests to figma
 * @param appName the app to get tokens for
 * @param gitlabOptions the options to send requests to gitlab
 */
export async function handleLibraryPublish(figmaClient: IFigmaClient, appName: TokenPathName, gitlabOptions: GitlabOptions) {
    const logger = log4js.getLogger();

    const tokenPathConfig = getTokenPaths(appName);

    if (!tokenPathConfig) {
        logger.warn(`Token path ignored, unknown app name: ${appName}`);
        return;
    }

    const gitlabApi = new Gitlab({
        host: gitlabOptions.host,
        token: gitlabOptions.token,
    });

    const figmaTokenRunSuccess = await handleFigmaTokenSync(appName, tokenPathConfig, figmaClient, gitlabApi, gitlabOptions);

    if (figmaTokenRunSuccess) {
        await handleCssSync(appName, tokenPathConfig, gitlabApi, gitlabOptions);
    }

    // Create MR
    await createOrUpdateMr(appName, gitlabApi, gitlabOptions.projectId, `${BRANCH_PREFIX}/mr-main-${appName}`, tokenPathConfig.reviewerIds);
}
