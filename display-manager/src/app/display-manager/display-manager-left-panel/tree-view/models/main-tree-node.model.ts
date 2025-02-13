import { NodeOptions, NodeProperties, TreeNode } from "./tree-node.model";
import { Event } from "./event.model"

export class MainTreeNode extends TreeNode {
    event?: Event;
    ruleId?: string;
    screenTempGuid?: string;
    constructor(
        nodeProperties: NodeProperties,
        nodeOptions: NodeOptions,
        event?: Event
    ) {
        super(
            nodeProperties, nodeOptions
        );

        this.event = event;
    }
}
