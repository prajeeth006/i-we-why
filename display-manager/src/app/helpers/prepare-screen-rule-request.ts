import { ScreenRuleRequest } from "../display-manager/display-manager-right-panel/display-manager-screens/models/display-screen-rule.model";


export class PrepareScreenRuleRequest {
  static createRuleRequest(label: string, path: string, droppedItem: any, decoderID: string, isDisabled?: boolean): ScreenRuleRequest {
    let screenRuleRequest;
    if (droppedItem?.event) {
      screenRuleRequest = new ScreenRuleRequest({
        label: label, path: path,
        targetItemID: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.id : droppedItem?.id,
        targetLink: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.targetLink : droppedItem?.targetLink,
        targetItemName: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.name : droppedItem?.name,
        racingEvent: droppedItem?.event,
        isCarouselTreeNode: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.isCarousleNode : droppedItem?.isCarousleNode,
        isMultiEventTreeNode: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.isMultiEventTreeNode : droppedItem?.isMultiEventTreeNode,
        ruleId: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.ruleId : droppedItem?.ruleId,
        assetType: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.assetType : droppedItem?.assetType,
        isDisabled: isDisabled,
        contentMediaType: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.contentMediaType : droppedItem?.contentMediaType,
        contentProvider: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.contentProvider : droppedItem?.contentProvider,
        enableAudio: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.enableAudio : droppedItem?.enableAudio,
        audioOutputDevice: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.audioOutputDevice : droppedItem?.audioOutputDevice,
      });

    } else {
      screenRuleRequest = new ScreenRuleRequest({
        label: label, path: path,
        targetItemID: droppedItem?.nodeProperties?.isManualTreeNode == true ? droppedItem?.nodeProperties?.targetId : droppedItem?.nodeProperties?.id,
        targetItemName: droppedItem?.nodeProperties?.name,
        isPromotionTreeNode: droppedItem?.nodeProperties?.isPromotionTreeNode,
        isCarouselTreeNode: droppedItem?.nodeProperties?.isCarousleNode,
        isChannelTreeNode: droppedItem?.nodeProperties?.isChannelTreeNode,
        isSkyChannelTreeNode: droppedItem?.nodeProperties?.isSkyChannelTreeNode,
        isMultiEventTreeNode: droppedItem?.nodeProperties?.isMultiEventTreeNode,
        decoderID: decoderID,
        targetLink: droppedItem?.nodeProperties?.targetLink,
        ruleId: droppedItem?.nodeProperties?.ruleId,
        assetType: droppedItem?.nodeProperties?.assetType,
        isDisabled: isDisabled,
        isMisc: droppedItem?.nodeProperties?.isMisc,
        contentItemId: droppedItem?.nodeProperties?.isManualTreeNode == true ? droppedItem?.nodeProperties?.id : '',
        isManualTreeNode: droppedItem?.nodeProperties?.isManualTreeNode,
        contentMediaType: droppedItem?.nodeProperties?.contentMediaType,
        contentProvider: droppedItem?.nodeProperties?.contentProvider,
        enableAudio: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.enableAudio : droppedItem?.enableAudio,
        audioOutputDevice: !!droppedItem?.nodeProperties ? droppedItem?.nodeProperties?.audioOutputDevice : droppedItem?.audioOutputDevice,
      });
    }
    return screenRuleRequest;
  }
}
