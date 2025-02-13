export interface SitecoreItemRoot {
    Item: Item;
}

export interface Item {
    Name: string;
    Key: string;
    Template: string;
    TemplateId: string;
    Id: string;
    ParentId: string;
    Version: number;
    Language: string;
    Path: string;
    CacheDuration: any;
    ValidTo: any;
    Fields: Field[];
    Items: any[];
    Warnings: any;
}

export interface Field {
    Key: string;
    FieldType: string;
    Content: string;
}
