export interface ScItem {
    ItemID: string;
    ItemName: string;
    Level: number;
    HasChildren: string;
    TemplateName: string;
    TargetLink: string;
    AssetType?: string;
    EventList?: string;
    TargetId?: string,
    TargetID?: string;
    __Updated?: any;
    ContentMediaType?: string;
    ContentProvider?: string;
    EnableAudio?: string;
    AudioOutputDevice?: string;
}

export interface ScMediaItem extends ScItem {
    ItemMedialUrl: string;
}

export interface ScMultiEventItem extends ScItem {
    MultieventTemplateName: string;
}
