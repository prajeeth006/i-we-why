export class JsonStringifyHelper {
    // based on this answer: https://stackoverflow.com/questions/29085197/how-do-you-json-stringify-an-es6-map/56150320#56150320
    static replacer(key: any, value: any) {
        if (value instanceof Map) {
            const object: { [key: string]: any } = {};
            for (const [mapKey, mapValue] of value) {
                object[mapKey] = mapValue;
            }

            return object;
        } else {
            return value;
        }
    }

    // based on this answer: https://stackoverflow.com/a/60127331
    static replacerOriginal(key: any, value: any) {
        if (value instanceof Map) {
            return [...value.entries()];
        }
        return value;
    }
}
