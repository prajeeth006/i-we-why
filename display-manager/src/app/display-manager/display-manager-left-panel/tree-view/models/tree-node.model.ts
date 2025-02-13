import { Guid } from "guid-typescript";

export class TreeNode {
    nodeProperties: NodeProperties;
    nodeOptions: NodeOptions;
    constructor(
        nodeProperties: NodeProperties, nodeOptions: NodeOptions
    ) {
        this.nodeProperties = {
            ...new NodeProperties(), ...nodeProperties
        };
        this.nodeOptions = nodeOptions;

        this.nodeProperties.nodeId = nodeProperties?.nodeId ?? Guid.create().toString();

    }
}

export class NodeProperties {
    id?: string;
    name?: string;
    level: number = 0;
    isFolder?: boolean;
    expandable?: boolean;
    isPromotionTreeNode?: boolean = false;
    isRacingTreeNode?: boolean = false;
    isSportsTreeNode?: boolean = false;
    isLoading?: boolean = false;
    nodeId?: string;
    isChannelTreeNode?: boolean = false;
    isCarousleNode?: boolean = false;
    isSkyChannelTreeNode?: boolean = false;
    isMultiEventTreeNode?: boolean = false;
    targetLink?: string;
    isVisible?: boolean = false;
    assetType?: string;
    assetTypeAliasName?: string;
    eventList?: string;
    eventMarketPairs?: string;
    isMisc?: boolean = false;
    targetId?: string;
    isManualTreeNode?: boolean = false;
    contentMediaType?: string;
    tradingPartitionId?: number;
    isAutoExpand?: boolean;
    contentProvider?: string;
    enableAudio?: string;
    audioOutputDevice?: string;
}

export class NodeOptions {
    needExcludeIcon?: boolean = false;
    needDeleteIcon?: boolean = false;
    needEditIcon?: boolean = false;
    needOverrideIcon?: boolean = false;
    isExcluded?: boolean = false;
}