import { CollectionViewer, DataSource, SelectionChange } from "@angular/cdk/collections";
import { FlatTreeControl } from "@angular/cdk/tree";
import { merge, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { MainTreeNode } from "./models/main-tree-node.model";
import { CommonService } from "./services/common-service/common.service";
import { TreeViewService } from "./services/tree-view.service";

export class LeftPanelTreeDataSource implements DataSource<MainTreeNode>{

    constructor(private _treeControl: FlatTreeControl<MainTreeNode>,
                private commonService: CommonService,
                private treeViewService:TreeViewService) {

    }

    connect(collectionViewer: CollectionViewer): Observable<MainTreeNode[]> {
        this._treeControl.expansionModel.changed.subscribe((change: SelectionChange<MainTreeNode>) => {
          if (change.added || change.removed) {
            this.treeViewService.handleTreeControl(change);
          }
        });

        return merge(collectionViewer.viewChange, this.commonService.promotionCurrentTreeDataChange).pipe(map(() => this.commonService.promotionCurrentTreeData));
    }

    disconnect(collectionViewer: CollectionViewer): void {}

    /** Handle expand/collapse behaviors */
}