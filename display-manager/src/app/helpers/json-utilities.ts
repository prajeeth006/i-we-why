export class JsonUtilities {
    static deepCopy(inputObject: any) {
        if (typeof inputObject !== 'object' || inputObject === null) {
            return inputObject;
        }

        try {
            return JSON.parse(JSON.stringify(inputObject));
        } catch (error: any) {
            console.error('Error while performing deep copy:', error.message);
            return null;
        }
    }

    static isEmptyObject(obj: any): boolean {
        return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
    }
}