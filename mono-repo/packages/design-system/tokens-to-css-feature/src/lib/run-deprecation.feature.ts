import * as fs from 'node:fs';
import * as path from 'node:path';

import { deprecatedMixins, deprecatedVariables } from './side-channel.js';

export function runDeprecationFeature(outputPath: string) {
    const uniqueVars = [...new Set(deprecatedVariables)];
    fs.writeFileSync(path.join(outputPath, 'deprecated.txt'), uniqueVars.sort().join('\n'));

    const uniqueMixins = [...new Set(deprecatedMixins)];
    fs.writeFileSync(path.join(outputPath, 'deprecated-mixins.txt'), uniqueMixins.sort().join('\n'));
}
