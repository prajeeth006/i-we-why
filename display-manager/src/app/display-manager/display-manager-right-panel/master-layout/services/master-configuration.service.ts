import { Injectable } from '@angular/core';
import { AssetType, GantryType, Profile, ProfileScreen } from '../../profiles/models/profile';
import { SortedColumns, SortedRows, SortedScreens } from '../../profiles/models/sorted-screens';
import { ApiService } from 'src/app/common/api.service';
import { HttpParams } from '@angular/common/http';
import { ConfigItem, LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { MasterLayoutTabs } from '../../profiles/models/master-tabs';
import { Footer } from '../../profiles/models/footer-content';
import { ScreenRuleRequest } from '../../display-manager-screens/models/display-screen-rule.model';
import { ProfileConstants } from '../../profiles/constants/profile-constants';
import { CustomHttpParamEncoder } from 'src/app/helpers/CustomHttpParamEncoder';
import { AssetDesignService } from '../../services/AssetDesignService/asset-design.service';
import { DroppedItem } from '../../display-manager-screens/models/display-screen.model';
import { MenuItem } from '../../dynamic-screens/screen-context-menu/screen-context-menu.model';
import { ContextMenu } from 'src/app/common/models/ContextMenu';
import { PrepareScreenRuleRequest } from 'src/app/helpers/prepare-screen-rule-request';
import { RealTimeUpdatesHelperService } from 'src/app/common/services/real-time-updates/real-time-updates-helper.service';
import { RealTimeUpdatesLoggerService } from 'src/app/common/services/real-time-updates/real-time-updates-logger.service';

@Injectable({
  providedIn: 'root'
})


export class MasterConfigurationService {

  constructor(private apiService: ApiService,
    private realTimeUpdatesHelperService: RealTimeUpdatesHelperService,
    private realTimeUpdatesLoggerService: RealTimeUpdatesLoggerService,
    private labelSelectorService: LabelSelectorService,
    private assetDesignService: AssetDesignService,
  ) {
    this.labelSelectorService.currentLabel$.subscribe((label: string) => {
      this.currentLabel = label;
      this.currentProfileVal$.next('');
      this.listOfGantryTypesChanges$.next([]);
      this.listOfPofilesChanges$.next([]);
      this.getRightSidePanelScreenTabsData();
      this.labelSelectorService.configItemValues$.subscribe((masterLayoutTabs: ConfigItem) => {
        if (masterLayoutTabs.IsMasterEnabled) {
          this.getListOfProfiles();
          this.getCurrentProfile();
          this.getMasterConfigFooterData();
          this.getListOfGantryTypes();
        }
      });

      this.getManualConstantPaths();
    })
  }

  sortedMasterGantryScreensData: SortedScreens;
  currentProfileVal$: BehaviorSubject<string> = new BehaviorSubject('');
  masterScreensData$: BehaviorSubject<Profile[]> = new BehaviorSubject<Profile[]>([]);
  gantryScreenData$: BehaviorSubject<Profile[]> = new BehaviorSubject<Profile[]>([]);
  basePath: string;
  currentLabel: string;
  masterLayoutTabs: MasterLayoutTabs[] = [];
  masterLayoutTabs$: BehaviorSubject<MasterLayoutTabs[]> = new BehaviorSubject<MasterLayoutTabs[]>([]);
  listOfPofilesChanges$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  manualIconPaths$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  listOfGantryTypesChanges$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  footerDataContent$: BehaviorSubject<Footer[]> = new BehaviorSubject<Footer[]>([]);
  onSaveChanges$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  onResetChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  onActivateProfileChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  toggleRightPanelDisableChanges$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  getRightSidePanelScreenTabsData() {
    let params = new HttpParams().append('currentLabel', this.currentLabel);
    this.apiService.get<MasterLayoutTabs[]>('/sitecore/api/displayManager/getRightPanelScreenTabs', params).subscribe((data: MasterLayoutTabs[]) => {
      this.masterLayoutTabs$.next(data);
    });
  }

  getListOfProfiles() {
    let params = new HttpParams().append('currentLabel', this.currentLabel);
    this.apiService.get<string[]>('/sitecore/api/displayManager/getListOfProfiles', params).subscribe((listOfProfiles: string[]) => {
      this.listOfPofilesChanges$.next(listOfProfiles);
    });
  }

  getManualConstantPaths() {
    let params = new HttpParams().append('currentLabel', this.currentLabel);
    this.apiService.get<string[]>('/sitecore/api/displayManager/getManualIcons', params).subscribe((manualIconsPaths: any[]) => {
      this.manualIconPaths$.next(manualIconsPaths);
    });
  }

  getCurrentProfile() {
    let params = new HttpParams().append('currentLabel', this.currentLabel);
    this.apiService.get<string>('/sitecore/api/displayManager/getCurrentProfiles', params).subscribe((data: string) => {
      this.currentProfileVal$.next(data);
      this.toggleRightPanelDisableChanges$.next(false);
    });
  }

  getListOfGantryTypes() {
    let params = new HttpParams().append('currentLabel', this.currentLabel);
    this.apiService.get<string[]>('/sitecore/api/displayManager/getListOfGantryTypes', params).subscribe((gantryTypes: string[]) => {
      this.listOfGantryTypesChanges$.next(gantryTypes);
    });
  }

  getMasterConfigFooterData() {
    let params = new HttpParams().append('currentLabel', this.currentLabel);
    this.apiService.get<Footer[]>('/sitecore/api/displayManager/getMasterConfigFooterData', params).subscribe((footerData: Footer[]) => {
      this.footerDataContent$.next(footerData);
    });
  }

  loadMasterScreensData(profileValue: string, gantryTypename: string, isMaster: boolean = true) {
    let params = new HttpParams({ encoder: new CustomHttpParamEncoder() }).append('currentLabel', this.currentLabel).append('profileName', profileValue).append('gantryTypename', gantryTypename);
    this.apiService.get<Profile[]>('/sitecore/api/displayManager/getProfiles', params).subscribe((screenData: Profile[]) => {
      if (isMaster) {
        console.log("getProfiles: Master -> Config");
        this.masterScreensData$.next(screenData);
      }
      else {
        console.log("getProfiles: Master -> Gantry");
        this.gantryScreenData$.next(screenData);
      }
      this.toggleRightPanelDisableChanges$.next(false);
    });
  }

  saveScreenRules(screenRuleRequests: Array<ScreenRuleRequest>) {
    return this.apiService.post('/sitecore/api/displayManager/profileRule/createRules', screenRuleRequests);
  }

  activateProfile(profileName: string) {
    let params = new HttpParams()
      .append('currentLabel', this.currentLabel)
      .append('profileName', profileName);

    return this.apiService.post('/sitecore/api/displayManager/activateProfiles', {}, params);
  }

  loadMasterGantryData(assetTypes: AssetType[]): SortedScreens {
    var screens: ProfileScreen[] = [];
    assetTypes?.forEach(x => { screens = screens.concat(x.Screens)?.filter(x => !x.IsDisabled) });
    var maxRows = Math.max(...screens.map(x => x.ScreenCoordinate.Row));
    var maxCols = Math.max(...screens.map(x => x.ScreenCoordinate.Column));

    this.sortedMasterGantryScreensData = new SortedScreens();
    this.sortedMasterGantryScreensData.maxColumn = maxCols;
    this.sortedMasterGantryScreensData.maxRow = maxRows;
    this.sortedMasterGantryScreensData.rows = [];

    let finalRows: Array<SortedRows> = [];

    for (let rows: number = 1; rows <= maxRows; rows++) {
      let rowData = new SortedRows();
      rowData.row = rows;
      rowData.columns = [];
      for (let column = 1; column <= maxCols; column++) {
        var columnsData = new SortedColumns();
        columnsData.column = column;
        columnsData.screens = screens?.filter(x => x.ScreenCoordinate?.Row == rows && x.ScreenCoordinate?.Column == column)?.sort((x, y) => x?.ScreenCoordinate?.SortOrder - y?.ScreenCoordinate?.SortOrder)
        rowData.columns.push(columnsData);
      }

      //Remove only Last empty blocks if its exceed the first two rows max items.
      if (finalRows.length == 2) {
        let finalExtraColumns = -1;
        finalRows.forEach(row => {
          row.columns.reverse();
          let breakSplicing = false;
          let extraColumns = 0;
          [...row.columns].forEach((obj) => {
            if (!breakSplicing && obj.screens.length == 0) {
              extraColumns++;
            } else {
              breakSplicing = true;
            }
          });
          row.columns.reverse();
          if (finalExtraColumns == -1 || extraColumns < finalExtraColumns) {
            finalExtraColumns = extraColumns;
          }
        });

        finalRows.forEach(row => {
          row.columns.reverse();
          Array.from(Array(finalExtraColumns)).forEach(() => {
            row.columns.splice(0, 1);
          })
          row.columns.reverse();
        })

      }

      if (finalRows.length >= 2) {
        //Remove only Last empty blocks after the line break
        rowData.columns.reverse();
        let breakSplicing = false;
        [...rowData.columns].forEach((obj) => {
          if (!breakSplicing && obj.screens.length == 0) {
            rowData.columns.splice(0, 1);
          } else {
            breakSplicing = true;
          }
        });
        rowData.columns.reverse();
      }

      finalRows.push(rowData);

    }
    this.sortedMasterGantryScreensData.rows = finalRows;
    return this.sortedMasterGantryScreensData;
  }

  enableActivateProfile(screenData?: GantryType, selectedProfileValue?: string) {
    let isActivateProfile: boolean = false;
    let screens: ProfileScreen[] = [];
    let activeScreens: ProfileScreen[] = [];
    let inActiveScreens: ProfileScreen[] = [];
    let currentProfileValue = this.currentProfileVal$.value;
    let footerData = this.footerDataContent$.value;
    footerData.forEach(x => x.isEnable = false);

    screenData?.AssetTypes?.forEach(x => screens.push(...x.Screens));
    activeScreens = screens.filter(x => !x.IsDisabled);
    inActiveScreens = screens.filter(x => !activeScreens.includes(x));

    if (selectedProfileValue == currentProfileValue) {
      footerData.forEach(x => {
        if (x.title == ProfileConstants.activate) {
          x.isEnable = false;
        }
      })
    }
    else {
      isActivateProfile = activeScreens.every(x => {
        if (x?.IsContentSaved && x?.NowPlaying?.ScreenRuleRequest == null) {
          return true;
        }
        return false;
      })
    }
    if (isActivateProfile) {
      footerData.forEach(x => {
        if (x.title == ProfileConstants.activate) {
          x.isEnable = true;
        }
      })
    }
  }

  enableSaveReset(gantryType: GantryType) {
    let isActiveScreensFilled: boolean = false;
    var footerData = this.footerDataContent$.value;
    footerData.forEach(x => x.isEnable = false);
    var screens: ProfileScreen[] = [];
    let activeScreens: ProfileScreen[] = [];
    let inActiveScreens: ProfileScreen[] = [];
    gantryType?.AssetTypes?.forEach(x => screens.push(...x.Screens));
    activeScreens = screens.filter(x => !x.IsDisabled);
    inActiveScreens = screens.filter(x => !activeScreens.includes(x));
    isActiveScreensFilled = activeScreens.every(x => {
      if (x?.NowPlaying != null) {
        return true;
      }
      return false;
    })

    if (isActiveScreensFilled) {
      footerData.forEach(footerBtn => {
        if (footerBtn.title === ProfileConstants.reset || footerBtn.title === ProfileConstants.save) {
          footerBtn.isEnable = true;
        }
      })
    }

    this.realTimeUpdatesHelperService.isMasterScreensTouched$.next(true);
    const logInfo = {
      isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
      isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value,
    }
    this.realTimeUpdatesLoggerService.saveLog(logInfo);
  }

  disableResetAndSaveChangesBtns(footerData: Footer[]) {
    footerData.forEach(footerBtn => { if (footerBtn.title === ProfileConstants.save || footerBtn.title === ProfileConstants.reset) { footerBtn.isEnable = false; } })
    this.footerDataContent$.next(footerData);
  }

  removeAndShiftAssetsLeft(assetScreens: ProfileScreen[], currentActiveScreen: ProfileScreen): ProfileScreen[] {
    for (let i = assetScreens.findIndex(x => x.ScreenNumber == currentActiveScreen.ScreenNumber);
      i < assetScreens.length; i++) {
      if (!!assetScreens[i]) {
        assetScreens[i].screenDisplayAssetType = '';
        if (i == assetScreens.length - 1 && assetScreens[i] != null) {
          assetScreens[i].isLeftShiftAssetScreenEmpty = true;
          assetScreens[i]!.NowPlaying = null;
          this.assetDesignService.getAssetImage(assetScreens[i], null);
          return assetScreens;
        }
        else {
          if (assetScreens[i + 1]?.NowPlaying == null) {
            assetScreens[i].isLeftShiftAssetScreenEmpty = true;
            assetScreens[i].NowPlaying = null;
            this.assetDesignService.getAssetImage(assetScreens[i], null);
          }
          else {
            assetScreens[i].NowPlaying = {
              Asset: assetScreens[i + 1]?.NowPlaying?.Asset,
              Name: assetScreens[i + 1]?.NowPlaying?.Name as string,
              ScreenRuleRequest: PrepareScreenRuleRequest.createRuleRequest(this.labelSelectorService.getCurrentLabel(), assetScreens[i]?.ScreenPath, assetScreens[i + 1]?.NowPlaying?.Asset as DroppedItem,
                assetScreens[i]?.DisplayScreen?.DecoderID, assetScreens[i]?.IsDisabled)
            }

            assetScreens[i].screenDisplayAssetType = assetScreens[i + 1].screenDisplayAssetType;

            this.assetDesignService.getAssetImage(assetScreens[i], assetScreens[i]?.NowPlaying?.Asset as DroppedItem);

          }
        }
      }
    }
    return assetScreens;
  }

  changeContextMenuOptionForLeftShitAsset(contextMenuItems: MenuItem[], currentActiveScreen: ProfileScreen, assetScreens: ProfileScreen[])
    : MenuItem[] {
    let rightScreensFromHighlightedOne: ProfileScreen[] = [];
    let index = assetScreens.findIndex(x => x.ScreenNumber == currentActiveScreen.ScreenNumber);
    assetScreens.forEach((screen, i) => {
      if (i > index) {
        rightScreensFromHighlightedOne.push(screen);
      }
    });
    let isLeftShiftAssetDisabled = rightScreensFromHighlightedOne.every(
      x => { return (x.NowPlaying == null) });

    if (isLeftShiftAssetDisabled) {
      contextMenuItems = contextMenuItems.filter(x => x.id != ContextMenu.removeAndShiftAssetsLeft);
    }
    else {
      contextMenuItems.find(x => {
        if (x.id === ContextMenu.removeAndShiftAssetsLeft) {
          if (currentActiveScreen.NowPlaying == null) {
            x.itemName = "Shift Assets Left";
          }
        }
      })
    }

    return contextMenuItems;
  }

  getAllCurrentActiveScreens(currentActiveScreen: ProfileScreen, screenData: GantryType): ProfileScreen[] {
    let assetScreens: ProfileScreen[] = [];
    if (!!currentActiveScreen) {
      screenData?.AssetTypes.forEach(x => {
        if (x.TypeName.toLocaleLowerCase().trim() === currentActiveScreen.AssetType.toLocaleLowerCase().trim()) {
          assetScreens.push(...x.Screens);
        }
      });
    }
    return assetScreens;
  }

  getUrl(url: string, ruleId: string | undefined): Observable<string> {
    return this.apiService.get(url + ruleId);
  }

  getPreviewUrl(label: string, ruleId: string | undefined): Observable<string> {
    return this.apiService.get("/sitecore/api/displayManager/preview/screePreview?currentLabel=" + label + "&displayRuleItemId=" + ruleId);
  }
  
  checkAllScreensHaveAssets(): boolean {
    const profiles = this.masterScreensData$.value;
    if (!profiles || profiles.length === 0) {
      return false; 
    }
    
    const allScreens = profiles.reduce((screens, profile) => {
      const profileScreens = (profile.GantryTypes || []).reduce((gantryScreens, gantryType) => {
        const gantryTypeScreens = (gantryType.AssetTypes || []).reduce((assetScreens, assetType) => {
          return assetScreens.concat(assetType.Screens || []);
        }, [] as ProfileScreen[]);
        return gantryScreens.concat(gantryTypeScreens);
      }, [] as ProfileScreen[]);
      return screens.concat(profileScreens);
    }, [] as ProfileScreen[]);

    return allScreens.every(screen => {
      if (screen.IsDisabled) {
        return true; 
      }
      return screen.NowPlaying !== null && screen.NowPlaying !== undefined;
    });
  }

}
