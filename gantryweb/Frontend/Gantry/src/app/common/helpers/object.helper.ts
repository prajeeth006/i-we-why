
export class ObjectHelper {
    static isObjectEmpty(_object: any) {
        return JSON.stringify(_object) === '{}';
    }
}