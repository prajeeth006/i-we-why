import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { IMultiEventTabs } from '../multi-event/model/IMultiEventTabs';
import { Constants } from '../constants/constants';
import { UntypedFormGroup } from '@angular/forms';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { LabelSelectorService } from '../../display-manager-header/label-selector/label-selector.service';

@Injectable({
  providedIn: 'root'
})
export class RightPanelTabControlService {

  multieventTabsSubject = new Subject<IMultiEventTabs[]>();
  multieventTabs$ = this.multieventTabsSubject.asObservable();
  selectedTabSubject = new Subject<boolean>();
  selectedTab$ = this.selectedTabSubject.asObservable();
  multieventTabs: IMultiEventTabs[] = [];
  multiEventForm: UntypedFormGroup;
  isSequencingEnabled: boolean = false;
  constructor(private matDialogue: MatDialog,private labelSelectorService: LabelSelectorService
  ) {
    this.multieventTabs$.subscribe((tabs: IMultiEventTabs[]) => {
      this.multieventTabs = tabs;
    })

    this.labelSelectorService.sequencingEnabled$.subscribe(
      (visible: boolean) => {
        this.isSequencingEnabled = visible;
      },
    );
  }
  removalProgress = new BehaviorSubject<boolean>(false);

  get removalOfTab(): Observable<boolean> {
    return this.removalProgress.asObservable();
  }

  onNewSportclick(eventType: string, tabNameFetched?: string, eventFormDataFetched?: any) {
    if (this.multieventTabs?.length <= (this.isSequencingEnabled ? 8 :19)) {
      let tabname = tabNameFetched ? tabNameFetched : Constants.untitled_text;
      let eventFormData = eventFormDataFetched ? eventFormDataFetched : {};
      if (!this.multieventTabs) {
        this.multieventTabs = [];
      }
      eventFormData.tabName = tabname;
      this.multieventTabs.push({ eventType: eventType, tabName: tabname, eventFormData: eventFormData, defaultFormData: eventFormDataFetched, savedData: eventFormDataFetched });
      this.multieventTabsSubject.next(this.multieventTabs);
      this.selectedTabSubject.next(true);
    }
    else {
      this.matDialogue.open(DialogueComponent, { data: { message: Constants.dialogue_maximum_tabs_reached } });
    }

  }

  closeTab(tabIndex: number) {
    this.multieventTabs.splice(tabIndex, 1);
    this.selectedTabSubject.next(true);
  }

  clearTabs() {
    this.multieventTabsSubject.next([]);
  }

  changeTabName(tabIndex: number, tabName: string, eventType: string) {
    this.multieventTabs[tabIndex]['eventType'] = eventType;
    this.multieventTabs[tabIndex]['tabName'] = tabName;
    this.multieventTabsSubject.next(this.multieventTabs);
  }

  closeLinkedTab(treeNode: MainTreeNode) {
    if (this.multieventTabs.length > 0 && this.multieventTabs.filter(tabData => tabData?.savedData?.id == treeNode?.nodeProperties?.id).length > 0) {
      let removalIndexTabs: number[] = [];
      this.multieventTabs.forEach((tabData, tabIndex) => {
        if (tabData?.savedData?.id.toLowerCase().replace(/[{}]/g, "").trim() == treeNode?.nodeProperties?.id?.toLowerCase().replace(/[{}]/g, "").trim()) {
          removalIndexTabs.push(tabIndex);
        }
      })
      for (let tabIndex = removalIndexTabs.length - 1; tabIndex >= 0; tabIndex--) {
        this.multieventTabs.splice(removalIndexTabs[tabIndex], 1);
        if (tabIndex == 0) {
          this.removalProgress.next(true);
        }
      }
    }
    else {
      this.removalProgress.next(true);
    }
  }

}
