import { Guid } from "guid-typescript";
import { DroppedItem } from "../../display-manager-screens/models/display-screen.model";
import { ScreenRuleRequest } from "../../display-manager-screens/models/display-screen-rule.model";
import { MainTreeNode } from "src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model";

export class SequencePresetData {
  SequenceId: string;
  PresetId: string;
  SelectedScreens: SelectedScreen[];
  GantryType: string;
  UserSavedSequenceDateNTime: string

}
export class SelectedScreen {
  ScreenNumber: number;
  ViewId: number;
  ScreenType: string;
  Order: number

}

export class PresetAssetData {
  currentLabel: string = '';
  isCreatePresetEnabled: boolean = false;
  presetData :any = {};
}
