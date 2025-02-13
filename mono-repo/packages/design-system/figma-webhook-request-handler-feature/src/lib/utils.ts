import { IFigmaClient } from '@design-system/figma-data-access';
import * as fs from 'fs';

export const BRANCH_PREFIX: string = 'f/design-system/figma';

export type FileInfo = {
    isMainFile: boolean;
    mainFile: string;
    originalFile: string;
    branchFile?: string;
    name: string;
    gitlabBranchName: string;
    fileExists: boolean;
};

/**
 * This function extracts metadata for the file_key provided by the payload.
 * It's main aim is to know the branching structure of figma and the current status of the branch
 * @param file_key the file key in figma
 * @param figmaClient the client to interact with fimga
 */
export async function getFileInfo(file_key: string, figmaClient: IFigmaClient): Promise<FileInfo> {
    let fileKey = file_key;
    let branchKey: string | undefined;
    let fileAndBranchKey: string = fileKey;
    let fileExists = true;

    // Fetch file data (only one level so that we do not fetch full file with all components) including the branching information
    const fileData = await figmaClient.getFile(
        { file_key },
        {
            depth: 1,
            branch_data: true,
        },
    );

    // It is a branch
    if (fileData.mainFileKey != null) {
        fileKey = fileData.mainFileKey;
        branchKey = file_key;

        // We have to ensure the file still exists, so we check whether the branch is provided by the main file
        const fileDataMain = await figmaClient.getFile(
            { file_key: fileKey },
            {
                depth: 1,
                branch_data: true,
            },
        );

        if (fileDataMain.branches == null) {
            fileExists = false;
        } else {
            const branch = fileDataMain.branches.find((branch) => branch.key === branchKey);

            if (branch == null) {
                fileExists = false;
            }
            fileAndBranchKey = `${fileKey}-${branchKey}`;
        }
    }

    return {
        isMainFile: fileData.mainFileKey == null,
        originalFile: file_key,
        mainFile: fileKey,
        branchFile: branchKey,
        name: fileAndBranchKey,
        gitlabBranchName: `${BRANCH_PREFIX}/${fileAndBranchKey}`,
        fileExists: fileExists,
    };
}

/**
 * This function returns all files in a directory and all subdirectories recursively
 * @param dir the directory to search in
 * @param files not required, internal helper to collect files
 */
export function getFilesRecursiveFromDirectory(dir: string, files: string[] = []): string[] {
    // Get an array of all files and directories in the provided directory using fs.readdirSync
    const fileList = fs.readdirSync(dir);
    // Create the full path of the file/directory by concatenating the passed directory and file/directory name
    for (const file of fileList) {
        const name = `${dir}/${file}`;
        // Check if the current file/directory is a directory using fs.statSync
        if (fs.statSync(name).isDirectory()) {
            // If it is a directory, recursively call the getFiles function with the directory path and the files array
            getFilesRecursiveFromDirectory(name, files);
        } else {
            // If it is a file, push the full path to the files array
            files.push(name);
        }
    }
    return files;
}
