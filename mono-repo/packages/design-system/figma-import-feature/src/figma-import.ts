import { FigmaExtractorSchema, getFigmaClient, getFiles } from '@design-system/figma-shared-feature';

import { runCodeSyntaxForFile } from './lib/design-system-figma-import-feature';

export async function figmaImport(options: FigmaExtractorSchema) {
    const figmaApiToken = process.env['FIGMA_API_TOKEN'] ?? '';
    if (!figmaApiToken || figmaApiToken === '') {
        throw new Error(`A figma token is required for extracting the figma variables.`);
    }

    const figmaClient = getFigmaClient(figmaApiToken);

    let files = getFiles(options);

    const promises = files.map(async (fileKey: { fileKey: string; originalFileKey?: string }) => {
        await runCodeSyntaxForFile(fileKey.fileKey, figmaClient);
    });
    await Promise.all(promises);
}
