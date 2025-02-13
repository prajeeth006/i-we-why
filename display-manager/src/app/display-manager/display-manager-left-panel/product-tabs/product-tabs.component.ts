import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { LabelSelectorService } from '../../display-manager-header/label-selector/label-selector.service';
import { ScItemService } from 'src/app/sitecore/sc-item-service/sc-item.service';
import { Image } from 'src/app/sitecore/sc-models/sc-image.model';
import { ScItem } from 'src/app/sitecore/sc-models/sc-item.model';

import { ProductTabs } from './product-tab-names';
import { CarouselService } from '../tree-view/services/carousel-service/carousel.service';
import { ProductTabService } from './services/product-tab.service';
import { TabChangeValues } from '../generic-tab-service/model/tabChangeValues.model';
import { AssignImageFromSitecoreService } from 'src/app/common/assign-images/assign-image-from-sitecore.service';
import { Constants } from 'src/app/display-manager/display-manager-right-panel/constants/constants';

export interface GantryTab extends ScItem {
  Title: string;
  Image: any;
  imageUrl: string;
}
export interface Heirarchies {
  DisplayName: string;
  HasChildren: boolean;
  ItemID: string;
  ItemIcon: string;
  ItemName: string;
  ItemPath: string;
  isLibraryFlag: boolean;
}

@Component({
  selector: 'product-tabs',
  templateUrl: './product-tabs.component.html',
  styleUrls: ['./product-tabs.component.scss']
})
export class ProductTabsComponent implements OnInit {
  currentLabel: string;
  tabNamesEnum = ProductTabs;
  gantryTabs: GantryTab[];
  selectedTabIndex = new UntypedFormControl(0);
  selectedTabName: string;
  selectedManualTabName: string;
  Image: Image;
  currentTab: string;
  isCarouselPopupOpened$ = this.carouselService.isCarouselPopupOpened$;
  isCarouselPopUp: boolean = false;
  manualConstants = Constants;
  heirarchies: any;
  currentItemData: Heirarchies;
  manualTabs: Heirarchies[] = [];
  activeLink: string;

  constructor(
    public labelSelectorService: LabelSelectorService,
    private scItemService: ScItemService,
    public carouselService: CarouselService,
    public productTabService: ProductTabService,
    private assignImageService: AssignImageFromSitecoreService
  ) { }

  ngOnInit(): void {
    this.labelSelectorService.currentLabel$.pipe(
      tap((currentLabel: string) => {
        this.currentLabel = currentLabel.toLowerCase()
      }),
      switchMap(() => this.loadHeirarchyFolder())
    ).subscribe((tabsItem: ScItem) => this.loadHeirarchies(tabsItem?.ItemID));

    this.changeTabOnPopupState();
    this.productTabService.activeTab$.subscribe(activeTab => {
      this.selectedTabIndex = new UntypedFormControl(this.gantryTabs?.findIndex(x => x.Title?.toLowerCase().trim() === activeTab?.toLowerCase().trim()));
    })
  }

  loadHeirarchyFolder() {
    let queryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelLeftPanelPath + '/ContentOptions');
    return this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams);
  }

  private loadTabsFolder(path: string): Observable<ScItem> {
    let queryParams = new HttpParams().append('path', this.labelSelectorService.currentLabelBasePath + '/Tabs');
    return this.scItemService.getDataFromMasterDB<ScItem>('/sitecore/api/ssc/item', queryParams);
  }

  private loadHeirarchies(tabsFolderId: string) {
    this.heirarchies = [];

    if (tabsFolderId) {
      this.scItemService.getDataFromMasterDB<Heirarchies[]>('/sitecore/api/ssc/item/' + tabsFolderId + '/children').subscribe((heirarchies: Heirarchies[]) => {
        if (!!heirarchies?.length) {
          //https://stackoverflow.com/questions/51342582/mat-tab-material-angular6-selectedindex-doesnt-work-with-ngfor
          setTimeout(() => {
            this.selectedTabIndex = new UntypedFormControl(0);
            this.carouselService.setCarouselTabInActive();
            if (heirarchies && heirarchies.length > 0)
              this.currentTab = heirarchies[0]?.ItemName;
            this.changeTab(heirarchies[0]);
          }, 0)

          this.heirarchies = heirarchies;
        }
      });
    }
  }

  private loadTabs(tabsFolderId: string) {
    this.gantryTabs = [];

    if (tabsFolderId) {
      this.scItemService.getDataFromMasterDB<GantryTab[]>('/sitecore/api/ssc/item/' + tabsFolderId + '/children').subscribe((gantryTabs: GantryTab[]) => {
        if (!!gantryTabs?.length) {
          //https://stackoverflow.com/questions/51342582/mat-tab-material-angular6-selectedindex-doesnt-work-with-ngfor
          setTimeout(() => {
            this.selectedTabIndex = new UntypedFormControl(0);
            this.carouselService.setCarouselTabInActive();
            if (gantryTabs && gantryTabs.length > 0)
              this.currentTab = gantryTabs[0]?.Title;
          }, 0)

          // calling assignImage function to assign Imageurl from service
          gantryTabs.map((item) => {
            if (item.Image) {
              this.assignImageService.assignImage(item).subscribe((image: Image) => {
                item.imageUrl = image.ItemMedialUrl;
              });
            }
          });

          this.gantryTabs = gantryTabs;
        }
      });
    }
  }


  tabChanged($event: MatTabChangeEvent) {
    // Assigning the Observable with current and previous tab names for Error Handling
    this.SetTabNameOnTabChange($event);
    this.currentTab = $event?.tab?.textLabel;
    this.selectedTabIndex = new UntypedFormControl($event?.index);
    this.productTabService.setActiveTab($event?.tab?.textLabel);
    if (this.tabNamesEnum.carousel === $event?.tab?.textLabel) {
      this.carouselService.setCarouselTabActive();
    } else {
      this.carouselService.setCarouselTabInActive();
    }
  }

  private changeTabOnPopupState() {
    this.isCarouselPopupOpened$.subscribe((value: boolean) => {

      let tabIndex: number = this.gantryTabs?.findIndex(x => x.Title === this.tabNamesEnum.racing);
      if (value) {
        this.isCarouselPopUp = true;
        this.currentTab = this.tabNamesEnum.racing;
        this.carouselService.setCarouselTabInActive();
      } else {
        if (this.isCarouselPopUp) {
          tabIndex = this.gantryTabs?.findIndex(x => x.Title === this.tabNamesEnum.carousel);
        }
        this.isCarouselPopUp = false;

        if (this.currentTab === this.tabNamesEnum.carousel)
          this.carouselService.setCarouselTabActive();
      }

      if (!!tabIndex) {
        this.selectedTabIndex = new UntypedFormControl(tabIndex);
      }
    });
  }

  private SetTabNameOnTabChange($event: MatTabChangeEvent) {
    if ($event?.tab) {
      const tabChangeValues = new TabChangeValues();
      tabChangeValues.currentTab = $event.tab.textLabel;
      tabChangeValues.previousTab = this.currentTab;
      tabChangeValues.isCarouselPopUp = this.isCarouselPopUp;
      this.productTabService.setTabNameOnTabChange(tabChangeValues);
    }
  }

  changeTab(event: Heirarchies) {
    this.selectedTabName = event.ItemName;
    this.productTabService.setActiveLibraryOrManualTab(event.ItemName);
    this.currentTab = event.ItemName;
    event.isLibraryFlag = false;
    if (this.selectedTabName.toLowerCase() === this.manualConstants.library_tab.toLowerCase()) {
      this.labelSelectorService.currentLabel$.pipe(
        tap((currentLabel: string) => {
          this.currentLabel = currentLabel.toLowerCase()
        }),
        switchMap(() => this.loadTabsFolder(event.ItemPath))
      ).pipe(take(1)).subscribe((tabsItem: ScItem) => this.loadTabs(tabsItem?.ItemID));
      event.isLibraryFlag = true;
    }
    this.currentItemData = event;
  }

}
