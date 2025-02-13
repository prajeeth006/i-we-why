import * as fs from 'node:fs';
import * as path from 'node:path';
import StyleDictionary from 'style-dictionary';
import { Config } from 'style-dictionary/types';

import { registerExtensions } from './extensions/index.js';

registerExtensions();

/**
 * This function is based on nx
 * see https://github.com/nrwl/nx/blob/17.1.x/packages/nx/src/utils/path.ts
 * @param fragments the path fragments
 */
function joinPathFragments(...fragments: string[]): string {
    return path
        .join(...fragments)
        .replace(/^[A-Z]:/, '')
        .split('\\')
        .join('/');
}

/**
 * This function is based on nxkit/style-dictionary
 * see https://github.com/nxkit/nxkit/blob/3.0.2/packages/style-dictionary/src/executors/build/lib/normalize-config.ts
 * @param config
 * @param outputPath
 */
function normalizeConfig(config: Config, outputPath: string): Config {
    return {
        ...config,
        platforms: Object.fromEntries(
            Object.entries(config.platforms ?? {}).map(([name, platform]) => [
                name,
                {
                    ...platform,
                    buildPath: joinPathFragments(outputPath, platform.buildPath ?? ''),
                },
            ]),
        ),
    };
}

export function deleteOutputDir(outputPath: string) {
    fs.rmSync(outputPath, { recursive: true, force: true });
}

export async function runStyleDictionary(configs: Config[], outputPath: string, error: 'throw' | 'ignore') {
    // Delete output path
    deleteOutputDir(outputPath);

    const errorMessages: string[] = [];

    // Build all configs
    const promises = configs.map(async (config) => {
        const normalizedConfig = normalizeConfig(config, outputPath);
        const sd = new StyleDictionary(normalizedConfig);
        await sd.hasInitialized;

        try {
            await sd.buildAllPlatforms();
        } catch (error_: any) {
            // eslint-disable-next-line no-console
            console.log((config.source ?? []).join('\n'));
            // eslint-disable-next-line no-console
            console.error(error_.message);
            errorMessages.push(error_.message);
        }
    });

    // Wait until each is finished
    await Promise.all(promises);

    if (errorMessages.length > 0) {
        if (error === 'throw') {
            throw new Error(`Build failure in style dictionary: ${errorMessages.join('\n')}`);
        }
        // eslint-disable-next-line no-console
        console.warn('Error found but ignored');
    }

    return;
}
