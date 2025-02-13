import { SequencePresetData } from "./sequence-preset"
import { AssetDesign } from "../../profiles/models/profile";
import { IndividualScreenAsset } from "./individual-asset.model";

export class GantryLayout {
    GantryType: GantryType
    Sequences: SequencePresetData[]
}

export class GantryType {
    Name: string
    Title: any
    GantryTypeName: string
    IndividualScreens: IndividualScreens | null
    SortedGantryScreenData: SortedScreensData
    SortedPeripheralScreenData: SortedScreensData
    HaveTouched: boolean
    ReadOnlyView: boolean
    IsDirty: boolean
    ActiveSlide: number = 0
}

export class IndividualScreens {
    GantryScreens: ScreenData[][]
    PeripheralScreens: ScreenData[][]
}

export class ScreenData {
    ScreenNumber: number
    Column: number
    HaveLayOutOption: boolean
    ScreenType: string
    MappingPath: string
    PreviewScreenType: string
    ScreenDetails: ScreenDetails
    Size: string
}

export class ScreenDetails {
    Single: ScreenInfo[]
    Duo1: ScreenInfo[]
    Trio1: ScreenInfo[]
    Trio2: ScreenInfo[]
    Quad: ScreenInfo[]
}

export class ScreenInfo {
    ScreenPath: string | null;
    Row: number
    Column: number
    Size: string
    ViewId: number
    DisplayName: string
    NowPlaying: IndividualScreenAsset | undefined | null
    SequenceId: string
    DecoderId: string

    AssetDesign: AssetDesign //To be used to show in Live Now and Changes Tab. 
    NewAssetToSave: AssetToSave | null | undefined  //Have priority to show in Changes Tab only if this is not null

    IsTouched?: boolean
    HasPreview?: boolean
    IsSkyTv?: boolean
    IsTv?: boolean
    CanDraggable?: boolean
    CanDroppable?: boolean
    IsPartOfSequence?: boolean
    SortOrder: number
    IsHalf: boolean
    SkipCloning: boolean
}

export class AssetToSave {
    AssetToSave: IndividualScreenAsset
    AssetDesign?: AssetDesign
    SequenceId?: string
}

// view model classes to arrange screens
export class SortedScreensData {
    maxRows: number
    maxColumns: number
    rows: Array<SortedRowScreensData>
}

export class SortedRowScreensData {
    row:number;
    columns: Array<SortedColumnScreenData>
}

export class SortedColumnScreenData {
    column : number;
    screens: ScreenData[];
    haveLayoutChangeOption: boolean;
    hasSubScreens: boolean;
}

export class SaveGantryAsset {
    gantryType: string;
    screenLayout: string;
    mappingPath: string;
    screenAssets: SaveAsset[];
}

export class SaveAsset {
    screenPath: string;
    screenAsset: IndividualScreenAsset;
}

export const ScreenTypes = {
    Single : "SINGLE",
    Duo1 : "DUO1",
    Trio1 : "TRIO1",
    Trio2 : "TRIO2",
    QUAD : "QUAD",
}