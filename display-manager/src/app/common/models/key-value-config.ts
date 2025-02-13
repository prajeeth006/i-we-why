export interface Settings {
    bwinnamevalue: BwinNameValue;
}

export interface BwinNameValue {
    entry: Array<Entry>;
}

export interface Entry {
    key: Array<string>;
    value: string;
}