import { Event } from '../../../display-manager-left-panel/tree-view/models/event.model';

export class ScreenRuleRequest {
    public label: string;
    public path: string;
    public targetItemID?: string;
    public targetItemName?: string;
    public racingEvent?: Event;
    public isPromotionTreeNode?: boolean;
    public isCarouselTreeNode?: boolean;
    public carouselDuration?: number;
    public ruleId?: string;
    public isDeleted?: boolean;
    public isChannelTreeNode?: boolean;
    public isSkyChannelTreeNode?: boolean;
    public isMultiEventTreeNode?: boolean;
    public decoderID?: string;
    public screenNumber?: string;
    public targetLink?: string;
    public displayOrder?: number;
    public isQuadUpdating?: boolean;
    public assetType?: string;
    public deleteAllRulesFromDraggedScreen?: boolean;
    public isDisabled?: boolean;
    public dragAndDropTime?: string;
    public isMisc?: boolean;
    public contentItemId?: string;
    public isManualTreeNode?: boolean;
    public contentMediaType?: string;
    public contentProvider?: string;
    public enableAudio?: string;
    public audioOutputDevice?: string;
    constructor({
        label,
        path,
        targetItemID,
        targetItemName,
        racingEvent,
        isPromotionTreeNode,
        isCarouselTreeNode,
        carouselDuration,
        ruleId,
        isDeleted,
        isChannelTreeNode,
        isSkyChannelTreeNode,
        decoderID,
        screenNumber,
        isMultiEventTreeNode,
        targetLink,
        isQuadUpdating,
        assetType,
        deleteAllRulesFromDraggedScreen,
        isDisabled,
        dragAndDropTime,
        isMisc,
        contentItemId,
        isManualTreeNode,
        contentMediaType,
        contentProvider,
        enableAudio,
        audioOutputDevice
    }: {
        label: string,
        path: string,
        targetItemID?: string,
        targetItemName?: string,
        racingEvent?: Event,
        isPromotionTreeNode?: boolean,
        isChannelTreeNode?: boolean,
        isCarouselTreeNode?: boolean,
        carouselDuration?: number
        ruleId?: string,
        isDeleted?: boolean,
        isSkyChannelTreeNode?: boolean,
        decoderID?: string,
        screenNumber?: string,
        isMultiEventTreeNode?: boolean,
        targetLink?: string,
        isQuadUpdating?: boolean,
        assetType?: string,
        deleteAllRulesFromDraggedScreen?: boolean,
        isDisabled?: boolean
        dragAndDropTime?: string,
        isMisc?: boolean,
        contentItemId?: string,
        isManualTreeNode?: boolean,
        contentMediaType?: string,
        contentProvider?: string,
        enableAudio?: string,
        audioOutputDevice?: string
    }) {
        this.label = label;
        this.path = path;
        this.targetItemID = targetItemID;
        this.targetItemName = targetItemName;
        this.racingEvent = racingEvent;
        this.isPromotionTreeNode = isPromotionTreeNode;
        this.isChannelTreeNode = isChannelTreeNode;
        this.isCarouselTreeNode = isCarouselTreeNode;
        this.carouselDuration = carouselDuration;
        this.ruleId = ruleId;
        this.isDeleted = isDeleted;
        this.isSkyChannelTreeNode = isSkyChannelTreeNode;
        this.decoderID = decoderID;
        this.screenNumber = screenNumber;
        this.isMultiEventTreeNode = isMultiEventTreeNode;
        this.targetLink = targetLink;
        this.isQuadUpdating = isQuadUpdating;
        this.assetType = assetType;
        this.deleteAllRulesFromDraggedScreen = deleteAllRulesFromDraggedScreen;
        this.isDisabled = isDisabled;
        this.dragAndDropTime = dragAndDropTime;
        this.isMisc = isMisc;
        this.contentItemId = contentItemId;
        this.isManualTreeNode = isManualTreeNode;
        this.contentMediaType = contentMediaType;
        this.contentProvider = contentProvider;
        this.enableAudio = enableAudio;
        this.audioOutputDevice = audioOutputDevice;
    }
}
