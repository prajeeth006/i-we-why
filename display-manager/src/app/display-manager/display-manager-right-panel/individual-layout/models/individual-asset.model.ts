import { SplitScreen } from "src/app/display-manager/display-manager-left-panel/tree-view/models/event.model"
import { Event } from '../../../display-manager-left-panel/tree-view/models/event.model';

export interface IndividualScreenAsset {
    RuleId?: string,

    Name: string,
    AssetType: string,
    ContentMediaType?: string,
    ContentProvider?: string,
    Target?: string,
    
    RacingEvent?: Event,
    RacingAssetType?: string,
    SplitScreen?: SplitScreen,
    IsVirtual?: boolean,

    TypeId?: number,

    EventMarketPair?: string,
    TradingPartitionId?: number,
    EnableAudio?: boolean,
    AudioOutputDevice?: string
    
    DecoderId?: string

    ContentItemId?: string
  }