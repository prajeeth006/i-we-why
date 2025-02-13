import * as fs from 'node:fs';
import * as path from 'node:path';
import { Config } from 'style-dictionary/types';

import createConfigs from './generate-configs.feature.js';
import { runDeprecationFeature } from './run-deprecation.feature.js';
import { runStyleDictionary } from './run-style-dictionary.feature.js';
import { SIZES_INFO, SIZES_INFO_COPY, SIZES_INFO_UNIT } from './sizes-info.js';

type OptionsInterface = {
    /** The path to the folder where exported and converted (W3C token draft) tokens are stored */
    tokenStoragePath: string;
    /** The path to the folder where the css is stored */
    outputPath: string;
    /** Whether error should be ignored or thrown */
    error: 'throw' | 'ignore';
    /** Whether a specific config should be generated only */
    buildName?: string;
    /*The Prefix in case it is executed over webhook*/
    tokenPathPrefix?: string;
};

export async function runGeneration(options: OptionsInterface) {
    let configs = await createConfigs(options.tokenStoragePath, options.tokenPathPrefix ?? '');
    const semanticFiles = configs
        .flatMap(
            (config: Config) =>
                config.platforms?.['css'].files?.map(
                    (x) => `@import "${options.outputPath}/${config.platforms?.['css'].buildPath}${x.destination}";`,
                ) ?? ([] satisfies string[]),
        )
        .filter((x) => x.includes('semantic.css'));
    if (options.buildName) {
        configs = configs.filter((x) => x.platforms?.['css'].buildPath?.includes(options.buildName ?? ''));
    }

    let changed = true;
    let a = Object.keys(SIZES_INFO).length;
    let b = Object.keys(SIZES_INFO_COPY).length;
    let c = Object.keys(SIZES_INFO_UNIT).length;
    while (changed) {
        await runStyleDictionary(configs, options.outputPath, options.error).finally(() => {
            runDeprecationFeature(options.outputPath);
        });
        const a1 = Object.keys(SIZES_INFO).length;
        const b1 = Object.keys(SIZES_INFO_COPY).length;
        const c1 = Object.keys(SIZES_INFO_UNIT).length;

        if (a1 === a && b1 === b && c1 === c) {
            changed = false;
        } else {
            a = a1;
            b = b1;
            c = c1;
        }
    }

    const allThemesPath = path.join(options.outputPath, 'all-themes.css');
    if (semanticFiles.length > 0) {
        fs.writeFileSync(
            allThemesPath,
            `${semanticFiles.map((x) => (options.tokenPathPrefix === undefined ? x : x.replace(options.tokenPathPrefix, ''))).join('\n')}\n`,
        );
    } else {
        if (fs.existsSync(allThemesPath)) {
            fs.rmSync(allThemesPath);
        }
    }
}
