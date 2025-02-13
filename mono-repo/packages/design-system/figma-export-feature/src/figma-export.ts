import { FigmaExtractorSchema, getFigmaClient, getFiles } from '@design-system/figma-shared-feature';
import { W3CTokenDocument } from '@design-system/w3c-token-standard-utils';

import { deleteTokens, handleExtract, handleExtractWithDeprecation, storeTokens } from './lib';

export async function figmaExport(options: FigmaExtractorSchema) {
    const figmaApiToken = process.env['FIGMA_API_TOKEN'] ?? '';
    if (!figmaApiToken || figmaApiToken === '') {
        throw new Error(`A figma token is required for extracting the figma variables.`);
    }
    const TOKEN_STORAGE_PATH = options.tokenStoragePath;

    const figmaClient = getFigmaClient(figmaApiToken);

    let files = getFiles(options);

    let branchOnly = false;
    if (options.fileKey) {
        branchOnly = true;
    }

    const w3cDrafts: Record<string, W3CTokenDocument> = await (options.checkDeprecated
        ? handleExtractWithDeprecation(files, figmaClient, TOKEN_STORAGE_PATH, { deprecateFileOnly: branchOnly })
        : handleExtract(files, figmaClient));

    // In case we download all files, we cannot provide an empty array for the check
    // as we want to delete all tokens that are not provided by fileKeys anymore
    deleteTokens(branchOnly ? files.map((f) => f.originalFileKey ?? f.fileKey) : null, w3cDrafts, TOKEN_STORAGE_PATH);

    // Store the new tokens
    storeTokens(w3cDrafts, TOKEN_STORAGE_PATH);
}
