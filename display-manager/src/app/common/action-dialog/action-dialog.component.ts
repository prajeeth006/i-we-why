import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { DeletenodeService } from 'src/app/display-manager/display-manager-left-panel/tree-view/components/deletenode/services/deletenode.service';
import { TreeViewService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/tree-view.service';
import { CommonService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/common-service/common.service';
import { RightPanelTabControlService } from 'src/app/display-manager/display-manager-right-panel/services/tab-control.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { DialogueComponent } from '../dialogue/dialogue.component';
import { MultieventService } from 'src/app/display-manager/display-manager-right-panel/multi-event/services/multievent.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule],
  templateUrl: './action-dialog.component.html',
  styleUrl: './action-dialog.component.scss'
})
export class ActionDialogComponent implements OnInit, OnDestroy {
  manualConstants = Constants;
  isDeleteMode: boolean = false;
  isSaveMode: boolean = false;

  dialogErrorDataSubscription: Subscription | undefined;
  isSaved: boolean = false;  
  isValidName: boolean = true;
  name: string = '';
  nameError: boolean = false;
  nameValidPattern = new RegExp("^[a-zA-Z0-9-_ ]+$");
  parentNode: MainTreeNode;  
  treeNode: MainTreeNode;

  constructor(
    private _deletenodeService: DeletenodeService,
    public treeViewService: TreeViewService,
    public commonService: CommonService,
    private matDialogue: MatDialog,
    private tabControlService: RightPanelTabControlService,    
    private labelSelectorService: LabelSelectorService,
    public dialogRef: MatDialogRef<ActionDialogComponent>,
    private multieventService: MultieventService,
    @Inject(MAT_DIALOG_DATA) public data: any) {    
      this.treeNode = data.node;
      this.isDeleteMode = data.isDeleteMode || false;
      this.isSaveMode = data.isSaveMode || false;
      if (this.isSaveMode) {
        this.name = data.name || '';
      }
    }
  ngOnInit(): void {
    this.data.change = true;        
  }

  cancel() {
    this.dialogRef.close(false);
  }

  confirmAction() {
    if (this.isDeleteMode) {
      this.delete();
    } else if (this.isSaveMode) {
      this.save();
    } else {
      this.dialogRef.close(true);
    }
  }

  save() {
    if (this.nameValidPattern.test(this.name)) {
      this.isValidName = true;
      this.multieventService.dialogTrackerData.next({ name: this.name, tabIndex: this.data.tabIndex });
      this.dialogErrorDataSubscription = this.multieventService.dialogErrorData.subscribe(data => {
        if (data) {
          this.nameError = true;
        } else {
          this.dialogRef.close(true);
        }
      });
    } else {
      this.isValidName = false;
    }
  }

  onNameChange() {
    this.nameError = false;
    if (this.name?.indexOf(' ') === 0 || this.name?.lastIndexOf(' ') === this.name?.length - 1) {
      this.isValidName = false;
    } else {
      this.isValidName = this.nameValidPattern.test(this.name);
      if (this.isValidName) {
        this.multieventService?.dialogErrorData?.next(false);
      }
    }
  }

  delete() {
    let referenceValues: string[] = [];
    this._deletenodeService.deleteAsset(this.treeNode, this.labelSelectorService.getCurrentLabel() ).subscribe((response) => {
      if (!response.isDeleted) {
        if (response.references.length > 0) {
          for (let i = 0; i < response.references.length; i++) {
            if (referenceValues.indexOf('<br/>' + response.references[i]) == -1) {
              referenceValues[i] = '<br/>' + response.references[i];
            }
          }
        }
        this.matDialogue.open(DialogueComponent, { data: { message: '<b>' + Constants.delete_item + '</b>' + referenceValues.toString() } });
        this.dialogRef.close(false);
      } else {
        this.tabControlService.closeLinkedTab(this.treeNode);
        this.tabControlService.removalOfTab.subscribe((removalProgress: boolean) => {
          if(removalProgress) {
            this.dialogRef.close(true);
          }
        });            
      }
    }, error => {
      console.error(error);
      this.dialogRef.close(false);
    });
  }
  ngOnDestroy(): void {
    this.dialogErrorDataSubscription?.unsubscribe();
  }
}
