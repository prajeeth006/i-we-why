import { MainTreeNode } from "./main-tree-node.model";
import { TreeNode } from "./tree-node.model";

export class TreeBreadCrumb {
    constructor(
        public data?:MainTreeNode,
        public child?:TreeBreadCrumb,
        public parent?:TreeBreadCrumb,
    ) {}
}
