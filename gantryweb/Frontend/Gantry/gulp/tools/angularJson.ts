import { JsonFile } from './file';

export class AngularJson extends JsonFile {
    constructor() {
        super('angular.json');
    }
}

export const angularJson = new AngularJson();
