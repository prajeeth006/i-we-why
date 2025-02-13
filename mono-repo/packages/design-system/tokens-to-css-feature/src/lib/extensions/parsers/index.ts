import { DesignTokens, Parser } from 'style-dictionary/types';

import { SIZES_INFO_COPY, SIZES_INFO_UNIT } from '../../sizes-info.js';

function convertSizeInfoCopy() {
    const searchObj: Record<string, any> = {};
    Object.values(SIZES_INFO_COPY).forEach((item) => {
        let el = searchObj;
        item.from.forEach((from) => {
            if (!(from in el)) {
                el[from] = {};
            }
            el = el[from];
        });
        el['to'] = item.to;
        el['hasReference'] = item.hasReference;
        el['toName'] = item.toName;
    });
    return searchObj;
}

function copyValues(obj: unknown, path: string[], searchObj: any): unknown {
    // If data is an array, call recursively
    if (Array.isArray(obj)) {
        return obj.map((item, index) => copyValues(item, [...path, `${index}`], searchObj[index]));
    }

    const sObj = searchObj ?? {};

    // Rename keys and return new object
    if (typeof obj === 'object' && obj != null) {
        const castedObj = obj as Record<string, unknown>;

        const transformedObject: Record<string, unknown> = {};
        Object.keys(castedObj).forEach((key) => {
            if (!(key in sObj)) {
                transformedObject[key] = castedObj[key];
                return;
            }
            const fullPath = [...path, key];
            transformedObject[key] = copyValues(castedObj[key], fullPath, sObj[key]);
            if ('to' in sObj[key]) {
                const convertObj = sObj[key];
                const newKey = convertObj['to'].at(-1);
                transformedObject[newKey] = copyValues(castedObj[key], fullPath, sObj[key]);
                if (sObj[key].hasReference) {
                    const subObject = transformedObject[newKey] as Record<string, unknown>;
                    let value = subObject['$value'] as string;
                    value = value.replace('}', `-${SIZES_INFO_UNIT[sObj[key]['toName']]}}`);
                    subObject['$value'] = value;
                }
            }
        });

        return transformedObject;
    }

    // If data is not an object or array, return as is
    return obj;
}

const w3cTokenStandardParser: Parser = {
    name: 'w3c-parser-custom',
    pattern: /tokens\.json$/,
    parser: ({ contents }) => {
        let obj = JSON.parse(contents);
        // Style dictionary requires a value, $value is not supported, so we have to transform them in the parser
        obj = copyValues(obj, [], convertSizeInfoCopy());
        return obj as DesignTokens;
    },
};

const parsers = [w3cTokenStandardParser];

export default parsers;
