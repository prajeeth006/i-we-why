import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as _ from 'lodash';

import { config } from '../config';
import { XML } from './xml';

export abstract class File {
    public path: string;
    private _content: any;

    get content(): any {
        if (!this._content) {
            this.read();
        }

        return this._content;
    }

    set content(value: any) {
        this._content = value;
    }

    constructor(relativePath: string) {
        this.path = path.join(config.baseDir, relativePath);
    }

    createBackup() {
        this.content;

        this.withBakPath(() => this.save());
    }

    restoreBackup() {
        this.withBakPath(() => {
            this.read();
            this.delete();
        });

        this.save();
    }

    protected serialize() {
        return this.content;
    }

    protected deserialize(content: string): any {
        return content;
    }

    save() {
        fs.writeFileSync(this.path, this.serialize());
    }

    protected read() {
        const content = _.trimStart(fs.readFileSync(this.path, 'utf8')); // Trim to remove BOM
        this._content = this.deserialize(content);
    }

    delete() {
        fs.unlinkSync(this.path);
    }

    private withBakPath(fn: () => void) {
        const originalPath = this.path;
        this.path = this.path + '.bak';

        fn();

        this.path = originalPath;
    }
}

export abstract class JsonFile extends File {
    constructor(path: string) {
        super(path);
    }

    protected serialize() {
        return JSON.stringify(this.content, null, 2) + os.EOL;
    }

    protected deserialize(content: string) {
        return JSON.parse(content);
    }
}

export class XmlFile extends File {
    constructor(path: string) {
        super(path);
    }

    protected serialize() {
        return XML.stringify(this.content);
    }
}
