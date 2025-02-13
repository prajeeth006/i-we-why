import {
  AfterContentChecked,
  Component,
  ElementRef,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { RightPanelTabControlService } from 'src/app/display-manager/display-manager-right-panel/services/tab-control.service';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';
import { MasterLayoutTabs, TabColours } from '../profiles/models/master-tabs';
import { IMultiEventTabs } from '../multi-event/model/IMultiEventTabs';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Constants } from '../constants/constants';
import { SitecoreImageService } from 'src/app/display-manager/display-manager-left-panel/services/sitecore-image/sitecore-image.service';
import { MasterToggleStateService } from '../../display-manager-header/master-toggle/master-toggle-state.service';
import { SequencencingHelperService } from 'src/app/display-manager/services/sequencencing-helper/sequencencing-helper.service';
@Component({
  selector: 'display-manager-tabs',
  templateUrl: './display-manager-tabs.component.html',
  styleUrls: ['./display-manager-tabs.component.scss'],
})
export class DisplayManagerTabsComponent
  implements OnInit, AfterContentChecked
{
  @ViewChildren('tabRight') tabRightElements!: QueryList<ElementRef>;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  multieventTabs$ = this.rightPanelTabControlService.multieventTabs$;
  selectedTab$ = this.rightPanelTabControlService.selectedTab$;
  parentTabs: MasterLayoutTabs[] = [];
  parentRightTabs: MasterLayoutTabs[] = [];
  childNodeDefaultIconPath: string | undefined;
  masterToggleActive: boolean = false;
  isSequencingEnabled: boolean = false;
  tabNames: string[] = [];
  tabDotColours: TabColours = {} as TabColours;
  tabWidths: number[] = []; // Array to store the width of each tab
  tabSelectedinSetting: boolean = false;
  isSettingsTab: boolean;
  constructor(
    public rightPanelTabControlService: RightPanelTabControlService,
    private labelSelectorService: LabelSelectorService,
    private sitecoreImageService: SitecoreImageService,
    private masterConfigService: MasterConfigurationService,
    private masterToggleStateService: MasterToggleStateService,
    private renderer: Renderer2,
    private sequencencingHelper: SequencencingHelperService
  ) {
    this.labelSelectorService.currentLabel$.subscribe(
      (currentLabel: string) => {
        this.rightPanelTabControlService.clearTabs();
      },
    );
    this.labelSelectorService.sequencingEnabled$.subscribe(
      (visible: boolean) => {
        this.isSequencingEnabled = visible;
      },
    );
    this.labelSelectorService.switchingTabs$.subscribe((tabs) => {
      this.tabNames = tabs;
    });
    this.labelSelectorService.tabDotColors$.subscribe((colors: TabColours) => {
      this.tabDotColours = colors;
    });
    this.masterToggleStateService.sequencingToggle$.subscribe((value) => {
        this.masterToggleActive = value;
      });
    
  }

  get sequenceJourneyStatus(): boolean {
    return this.sequencencingHelper.sequenceJourneyStatus();
  }

  multieventTabs: IMultiEventTabs[] = [];
  selectedTab = new UntypedFormControl(0);

  ngOnInit(): void {
    this.sitecoreImageService.mediaAssets$.subscribe((mediaAssets) => {
      this.childNodeDefaultIconPath = mediaAssets?.ChildNodeDefaultIcon;
    });

    this.multieventTabs$.subscribe((tabs: IMultiEventTabs[]) => {
      this.multieventTabs = tabs;
    });
    this.masterConfigService.masterLayoutTabs$.subscribe((parentTabs) => {
      if (this.isSequencingEnabled) {
        parentTabs = parentTabs
          .filter((tab) => !tab.hidden)
          .map((tab) => ({
            ...tab,
            childTabs: tab?.childTabs?.filter((children) => !children.hidden),
          }));        
        this.parentTabs = parentTabs.filter((tab) => !tab.alignRight);
        this.parentRightTabs = parentTabs.filter((tab) => tab.alignRight);
      } else {
        this.parentTabs = parentTabs
          .filter((info) => !info.hidden)
          .map((tab) => ({
            ...tab,
            childTabs: tab?.childTabs?.filter((children) => !children.hidden),
          }));
      }
    });
    this.selectedTab$.subscribe((selected: boolean) => {
      if (selected) {
        this.selectedTab.setValue(
          this.multieventTabs.length + this.parentTabs.length - 1,
        );
        setTimeout(() => {
          this.tabGroup.selectedIndex = this.selectedTab.value; // Manually set the tab index
        });
      }
    });
    this.selectedTab.valueChanges.subscribe((newValue) => {
      this.isSettingsTab = false; // Remove the child component
      if (this.isSettingsTabSelected()) {
          this.isSettingsTab = true; // Recreate the child component
      }
    });
  }

  ngAfterContentChecked() {
    if (this.tabRightElements && this.tabRightElements.length > 0) {
      this.tabRightElements.forEach((tabRight: ElementRef) => {
        const tabRightElement = tabRight.nativeElement;
        if (tabRightElement.classList.contains('label-align-right')) {
          const parentElement = tabRightElement.closest('.mat-mdc-tab');
          if (parentElement) {
            (parentElement as HTMLElement).classList.add('tab-align-end');
          }
        }
      });
    }
  }

  closeTab(tabIndex: number) {
    if(this.selectedTab.value - this.parentTabs.length === tabIndex && this.isSequencingEnabled) {
      this.setTabWidth(this.selectedTab.value);
    } 
    if (this.selectedTab.value > tabIndex) {
      this.rightPanelTabControlService.closeTab(tabIndex);
    } else {
      this.rightPanelTabControlService.closeTab(tabIndex);
    }
  }

  getAllListTabs(index: number) {
    let tabsList = [];
    for (var i = 0; i < this.multieventTabs.length; i++) {
      if (i != index) {
        tabsList.push('list-' + i);
      }
    }
    return tabsList;
  }

  drop(event: CdkDragDrop<string[]>) {
    let previousIndex: number = parseInt(
      event.previousContainer.id.replace('list-', ''),
    );
    let currentIndex: number = parseInt(
      event.container.id.replace('list-', ''),
    );
    if (
      previousIndex != undefined &&
      currentIndex != undefined &&
      previousIndex != currentIndex
    ) {
      let previosRefObject = JSON.parse(
        JSON.stringify(this.multieventTabs[previousIndex]),
      );
      this.multieventTabs[previousIndex] = JSON.parse(
        JSON.stringify(this.multieventTabs[currentIndex]),
      );
      this.multieventTabs[currentIndex] = JSON.parse(
        JSON.stringify(previosRefObject),
      );
      this.selectedTab.setValue(this.parentTabs.length + currentIndex);
    }
  }

  tabShrink(tab: string) {
    if (tab && tab.length > 16) {
      return tab.substring(0, 13).concat('...');
    } else {
      return tab;
    }
  }

  tabOrder(tabName: string, index: number) {
    if(this.selectedTab.value - this.parentTabs.length === index && this.isSequencingEnabled) {
      this.setTabWidth(this.selectedTab.value);
    }
    if (this.selectedTab.value > index) {
      this.selectedTab.setValue(
        this.selectedTab.value > 0 ? this.selectedTab.value : 0,
      );
    }
    if (tabName == Constants.untitled_text) {
      if (index > 0) {
        return tabName + index + '*';
      } else {
        return tabName + '*';
      }
    } else {
      return tabName;
    }
  }

  setTabWidth(tabIndex: number): void {    
    let desireMaxWidth = 1042 - ((this.multieventTabs.length-1) * 115);     
    desireMaxWidth = desireMaxWidth - 56;

    const tabElements = document.querySelectorAll('.right-side-panel-tabs .mat-mdc-tab');
    tabElements.forEach((tabElement, index) => {
          
      const tabIcon = tabElement.querySelector('.main-tab-text-sub');
      if (tabIcon) {
        if (index === tabIndex && tabIcon.classList.contains('active')) {          
          this.renderer.setStyle(tabIcon, 'max-width', `${desireMaxWidth}px`);          
        } else {          
          this.renderer.removeStyle(tabIcon, 'max-width');
        }
      }
    });
  }
  
  getBackgroundColor(tabName: string | undefined) {
    if (
      this.masterToggleActive &&
      tabName?.toLowerCase() === this.tabNames[0]?.toLowerCase()
    ) {
      return this.tabDotColours.green ?? 'green';
    } else if (
      !this.masterToggleActive &&
      tabName?.toLowerCase() === this.tabNames[1]?.toLowerCase()
    ) {
      return this.tabDotColours.green ?? 'green';
    } else {
      return this.tabDotColours.red ?? 'red';
    }
  }

  isTabVisible(tab: MasterLayoutTabs): boolean {
    return (
      this.isSequencingEnabled &&
      this.tabNames?.includes(tab.name.toLowerCase())
    );
  }

  isSettingsTabSelected(): boolean {
    const finalArray = [
      ...this.parentTabs.map(tab => tab.name),
      ...this.multieventTabs.map(tab => tab.tabName),
      ...[...this.parentRightTabs].reverse().map(({ name }) => name)
    ];
    const settingsTabIndex = finalArray.findIndex(tab => tab.toLowerCase() === 'settings');
    return this.selectedTab.value === settingsTabIndex;
  }
}
