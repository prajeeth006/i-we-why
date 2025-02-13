import { MainTreeNode } from "src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model";
export interface DroppedItem extends MainTreeNode {
    isMultiView?: boolean;
    targetItemId?: string;
    displayOrder?: number;
    ruleId?: string;
}