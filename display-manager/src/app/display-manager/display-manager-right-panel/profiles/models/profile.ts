import { ScreenRuleRequest } from "../../display-manager-screens/models/display-screen-rule.model";
import { DroppedItem } from "../../display-manager-screens/models/display-screen.model";

export class Profile {
  Name: string;
  GantryTypes: Array<GantryType>;
}

export class GantryType {
  Name: string;
  AssetTypes: Array<AssetType>;
}

export class AssetType {
  Name: string;
  TypeName: string;
  Screens: Array<ProfileScreen>;
  AssetDesign: AssetDesign
}

export class AssetDesign {
  ScreenBackgroundColor: string;
  ScreenBorderColor: string;
  AssetColor: string | undefined;
  Image: string;
  TextColor: string | undefined;
}

export class ProfileScreen {

  Name: string;
  ScreenNumber: string;

  SortOrder: number;

  ScreenPath: string;

  IsDisabled?: boolean;

  IsSingleView?: boolean;

  IsHalfView?: boolean;

  IsMinAssetScreen?: boolean;

  IsTertiaryView?: boolean;

  DisableDraggable?: boolean;

  IsQuadView?: boolean;
  ScreenCoordinate: ScreenCoordinate;

  NowPlaying: PresentAsset | null;

  DisplayScreen: DisplayScreen;

  ScreenDesign: AssetDesign;
  IsContentSaved: boolean;

  AssetType: string;
  isDraggedScreenEmpty: boolean = false;
  isLeftShiftAssetScreenEmpty: boolean = false;
  screenDisplayAssetType: string | undefined;
}

export class ScreenCoordinate {
  Name: string;
  SortOrder: number;
  Row: number;
  Column: number;
  IsQuad: boolean;
  IsHalf: boolean;
}


export class DisplayScreen {
  screenName: string;

  screenNo: number;
  Size: string;
  IsTVChannel: boolean;
  DecoderID: string;
  IsSkyTv: boolean;
  IsTv: boolean;
  HasCarousel: boolean;
  HasPreview: boolean;
  HasShiftAsset: boolean;
  HasShiftAssetLastItem: boolean;
}

export class PresentAsset {
  Asset?: DroppedItem;
  Name?: string;
  ScreenRuleRequest?: ScreenRuleRequest;
}
