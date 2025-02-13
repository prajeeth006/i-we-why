import { JsonFile } from './file';

export class PackageJson extends JsonFile {
    constructor(packageJsonFile: string) {
        super(packageJsonFile);
    }

    get version() { return this.content.version; }

    writeVersion(version: string) {
        this.content.version = version;

        this.save();
    }
}

export const packageJson = new PackageJson('package.json');
