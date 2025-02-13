import StyleDictionary from 'style-dictionary';

import filters from './filters/index.js';
import formats from './formats/index.js';
import parsers from './parsers/index.js';
import transforms from './transforms/index.js';

export function registerExtensions() {
    transforms.forEach((transform) => {
        StyleDictionary.registerTransform(transform);
    });
    parsers.forEach((parser) => {
        StyleDictionary.registerParser(parser);
    });
    formats.forEach((format) => {
        StyleDictionary.registerFormat(format);
    });
    filters.forEach((filter) => {
        StyleDictionary.registerFilter(filter);
    });
}
