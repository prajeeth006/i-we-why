import { Settings } from "../../../../common/models/key-value-config";

export interface ExcludeConfig {
    Settings: Settings;
}

export interface ConfigItem {
    EventFeedRacingContentApi: string;
    ExcludedPaths: string;
    DeletePaths: string;
    EditPaths: string;
    OverridePaths: string;
    OverrideMarkets: string;
    EventFeedApi: string;
    SnapshotTimeOut: number;
}

export enum ExcludingTypes{
    Category = 'Category',
    Type = 'Type',
    Event = 'Event',
    Class = 'Class'
}

export interface CookieData{
    Type?: string;
    Event?: string;
    Category?: string;
    Class?: string;
}