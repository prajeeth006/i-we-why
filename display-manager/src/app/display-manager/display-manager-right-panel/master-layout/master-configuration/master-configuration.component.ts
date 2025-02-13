import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { GantryType, ProfileScreen } from '../../profiles/models/profile';
import { MasterConfigurationService } from '../services/master-configuration.service';
import { Footer } from '../../profiles/models/footer-content';
import { ProfileConstants } from '../../profiles/constants/profile-constants';
import { ScreenRuleRequest } from '../../display-manager-screens/models/display-screen-rule.model';
import { BOMUtilities } from 'src/app/helpers/bom-utilities';
import { MatMenuTrigger } from '@angular/material/menu';
import { MenuItem } from '../../dynamic-screens/screen-context-menu/screen-context-menu.model';
import { ContextMenu } from 'src/app/common/models/ContextMenu';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { AssetTypes } from 'src/app/common/models/AssetTypes';
import { MatDialog } from '@angular/material/dialog';
import { CarouselService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/carousel-service/carousel.service';
import { CarouselComponent } from 'src/app/display-manager/display-manager-left-panel/carousel/carousel.component';
import { RealTimeUpdatesHelperService } from 'src/app/common/services/real-time-updates/real-time-updates-helper.service';
import { UserActions, UserTypes } from 'src/app/common/services/real-time-updates/models/real-time-logger.model';
import { RealTimeUpdatesLoggerService } from 'src/app/common/services/real-time-updates/real-time-updates-logger.service';
import { JsonUtilities } from 'src/app/helpers/json-utilities';
import { TreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/tree-node.model';
import { MainTreeNode } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/main-tree-node.model';
import { SignalRConfigItem, SignalRService } from 'src/app/common/services/signalR-service/signal-r.service';
import { RealTimeUpdatesV2Service } from 'src/app/common/services/real-time-updates/real-time-updates-v2.service';
import { ScContextService } from 'src/app/sitecore/sc-context-service/sc-context.service';

@Component({
  selector: 'app-master-configuration',
  templateUrl: './master-configuration.component.html',
  styleUrls: ['./master-configuration.component.scss']
})
export class MasterConfigurationComponent implements OnInit {
  screenData: GantryType | undefined;
  selectedProfileValue: string;
  contextMenuOptions = ContextMenu;
  signalRconfig: SignalRConfigItem;

  @ViewChild(MatMenuTrigger)
  matMenuTrigger: MatMenuTrigger;

  contextMenuPosition = BOMUtilities.getMousePosition();
  contextMenuItems: MenuItem[] = [];
  currentActiveScreen: ProfileScreen;
  isActiveScreensReset = false;

  listOfProfiles: string[];
  footerData: Footer[] = [];
  activeProfile: string;

  listOfPofilesChanges: any;
  currentProfileVal: any;
  masterScreensData: any;
  footerDataContent: any;
  onSaveChanges: any;
  onResetChanges: any;
  onActivateProfileChanges: any;
  currentLabel: string;

  constructor(private masterConfigService: MasterConfigurationService,
    private realTimeUpdatesHelperService: RealTimeUpdatesHelperService,
    private renderer: Renderer2,
    public labelSelectorService: LabelSelectorService,
    public dialog: MatDialog,
    public carouselService: CarouselService,
    private realTimeUpdatesV2Service: RealTimeUpdatesV2Service,
    private signalRService: SignalRService,
    private realTimeUpdatesLoggerService: RealTimeUpdatesLoggerService,
  ) {
    this.renderer.listen('window', 'click', (e: Event) => {
      this.isActiveScreensReset = true;
      this.matMenuTrigger.closeMenu();
    });

    this.signalRService.signalRConfig$.subscribe((signalRconfig: SignalRConfigItem) => {
      this.signalRconfig = signalRconfig;
      if (signalRconfig.isRealTimeUpdatesEnabled) {
        this.realTimeUpdatesV2Service.getRealTimeUpdatesWithSignalR();
      }
    });
  }

  ngOnInit(): void {

    this.listOfPofilesChanges = this.masterConfigService.listOfPofilesChanges$.subscribe((listOfProfiles: string[]) => {
      this.listOfProfiles = listOfProfiles;
    });

    this.currentProfileVal = this.masterConfigService.currentProfileVal$.subscribe((value) => {
      this.activeProfile = value;
      this.selectedProfileValue = this.activeProfile ? this.activeProfile : this.listOfProfiles![0];
      if (this.selectedProfileValue) {
        this.loadMasterConfigData();
      }
    });

    this.masterScreensData = this.masterConfigService.masterScreensData$.subscribe((data) => {
      if (!!data?.find(x => x?.Name == this.selectedProfileValue)) {
        this.screenData = data?.find(x => x?.Name == this.selectedProfileValue)?.GantryTypes?.find(y => y?.Name == ProfileConstants.master);
        this.masterConfigService.enableActivateProfile(this.screenData, this.selectedProfileValue);
      }
    });

    this.footerDataContent = this.masterConfigService.footerDataContent$.subscribe((footerData: Footer[]) => {
      this.footerData = footerData;
      if (this.signalRconfig.isRealTimeUpdatesEnabled) {
        this.realTimeUpdatesV2Service.footerData = this.footerData;
      }
    });

    this.onSaveChanges = this.masterConfigService.onSaveChanges$.subscribe((isSave) => {
      switch (isSave) {
        case ProfileConstants.saveInProgress:
          console.log("Save Changes : In Progress");
          const logInfo = {
            userType: UserTypes.Publisher,
            userAction: UserActions.SaveChanges,
            state: "In Progress"
          }
          this.realTimeUpdatesLoggerService.saveLog(logInfo);
          this.onSave();
          break;
        case ProfileConstants.saveCompleted:
          console.log("Save Changes : Completed");
          const logInfo1 = {
            userType: UserTypes.Publisher,
            userAction: UserActions.SaveChanges,
            state: "Completed",
            isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
            isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value
          }
          this.realTimeUpdatesLoggerService.saveLog(logInfo1);
          break;
      }
    });

    this.onResetChanges = this.masterConfigService.onResetChanges$.subscribe((isReset) => {
      if (isReset) {
        console.log("Reset Master Config screens");
        const logInfo = {
          userType: UserTypes.Default,
          userAction: UserActions.ResetChanges,
          isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
          isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value
        }
        this.realTimeUpdatesLoggerService.saveLog(logInfo);
        this.onReset();
      }
    });

    this.onActivateProfileChanges = this.masterConfigService.onActivateProfileChanges$.subscribe((isActivate) => {
      if (isActivate) {
        console.log("Activating Selected Profile");
        const logInfo = {
          userType: UserTypes.Publisher,
          userAction: UserActions.ActivateProfile,
          isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
          isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value
        }
        this.realTimeUpdatesLoggerService.saveLog(logInfo);
        this.onActivateProfile();
      }
    });

  }

  selectProfile(selectedProfile: string) {
    this.selectedProfileValue = selectedProfile;
    this.realTimeUpdatesHelperService.isProfileDropdownTouched$.next(true);
    const logInfo = {
      userType: UserTypes.Default,
      userAction: UserActions.ProfileChange,
      currentProfile: selectedProfile,
      isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
      isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value
    }
    this.realTimeUpdatesLoggerService.saveLog(logInfo);
    this.loadMasterConfigData();
  }

  loadMasterConfigData() {
    console.log(ProfileConstants.master, '->', "Config", '->', this.selectedProfileValue);
    this.realTimeUpdatesHelperService.userSelectedProfile$.next(this.selectedProfileValue);
    this.masterConfigService.loadMasterScreensData(this.selectedProfileValue, ProfileConstants.master)
  }

  onSave() {
    let profileScreens: Array<ProfileScreen> = [];
    this.footerData.forEach(x => { if (x.title === ProfileConstants.save || x.title === ProfileConstants.reset) { x.isEnable = false; } })
    this.masterConfigService.footerDataContent$.next(this.footerData);


    this.screenData?.AssetTypes?.map(assetType => {
      if (assetType.Screens && assetType.Screens.length) {
        profileScreens = [...profileScreens, ...assetType.Screens];
      }
      return assetType;
    });

    this.masterConfigService.saveScreenRules(
      profileScreens.map((profileScreen) => {
        if ((profileScreen.isDraggedScreenEmpty && profileScreen?.NowPlaying == null) ||
          (profileScreen.isLeftShiftAssetScreenEmpty && profileScreen?.NowPlaying == null)) {
          profileScreen.NowPlaying = {
            ScreenRuleRequest: new ScreenRuleRequest({
              label: this.masterConfigService.currentLabel,
              path: profileScreen?.ScreenPath,
              deleteAllRulesFromDraggedScreen: true
            })
          }
        }
        if (profileScreen?.NowPlaying?.ScreenRuleRequest)
          profileScreen.NowPlaying.ScreenRuleRequest.dragAndDropTime = (new Date()).toISOString()
        return profileScreen?.NowPlaying?.ScreenRuleRequest;
      })?.filter(x => x != undefined) as Array<ScreenRuleRequest>)
      .subscribe(() => {
        this.masterConfigService.onSaveChanges$.next(ProfileConstants.saveCompleted);
        this.loadMasterConfigData();
      });

  }

  onReset() {
    this.masterConfigService.disableResetAndSaveChangesBtns(this.footerData);
    this.masterConfigService.onResetChanges$.next(false);
    this.loadMasterConfigData();
  }

  onActivateProfile() {
    this.footerData.forEach(x => { if (x.title === ProfileConstants.activate) { x.isEnable = false } });
    this.masterConfigService.footerDataContent$.next(this.footerData);
    this.masterConfigService.onActivateProfileChanges$.next(false);
    this.masterConfigService.activateProfile(this.selectedProfileValue).subscribe(() => {
      this.masterConfigService.getCurrentProfile();
    });
  }

  onRightClickOpenMenu(contextMenuData: any) {
    this.contextMenuPosition = contextMenuData.contextMenuPosition;
    this.contextMenuItems = contextMenuData.contextMenuItems;
    this.currentActiveScreen = contextMenuData.profileScreen;
    this.contextMenuItems = this.ChangeContextMenuItemOptionForLeftShitAsset(this.contextMenuItems, this.currentActiveScreen);
    this.openScreenContextMenu();
  }

  openScreenContextMenu() {
    this.matMenuTrigger.closeMenu();
    this.isActiveScreensReset = false;
    setTimeout(() => {
      this.matMenuTrigger.openMenu();
    }, 100);
  }

  scrollHandler(event: Event) {
    this.isActiveScreensReset = true;
    this.matMenuTrigger.closeMenu();
  }

  // Will trigger when user select option
  onClickMenuOption(event: any) {
    if (!!event && !!event?.target?.parentElement) {
      if (event?.target?.parentElement?.id == ContextMenu.preview) {
        if (!!this.currentActiveScreen?.NowPlaying?.Asset?.ruleId) {
          let ruleId = this.currentActiveScreen?.NowPlaying?.Asset?.ruleId

          if (this.labelSelectorService.configItemValues.IsNewRuleProcessFlow) {

            this.masterConfigService.getPreviewUrl(this.masterConfigService.currentLabel, ruleId).subscribe((url: string) => {
              if (url)
                BOMUtilities.openInNewTab(url);
            }, (err: string) => {
              console.error(err);
            })

          } else {

            let gantryUrl = this.labelSelectorService.getLabelUrls(this.masterConfigService.currentLabel) + 'getGantryUrlBasedOnDisplayRuleId?displayRuleItemId=';
            this.masterConfigService.getUrl(gantryUrl, ruleId).subscribe((url: string) => {
              if (url)
                BOMUtilities.openInNewTab(url);
            }, (err: string) => {
              console.error(err);
            });

          }

        }

      } else if (event?.target?.parentElement?.id == ContextMenu.createCarousel) {
        this.addEditCarousel();
      } else if (event?.target?.parentElement?.id == ContextMenu.editCarousel) {
        let id;
        let assetType: any;
        if (!!this.currentActiveScreen?.NowPlaying?.Asset) { assetType = this.currentActiveScreen?.NowPlaying?.Asset }
        if (this.currentActiveScreen?.NowPlaying?.ScreenRuleRequest) {
          if (this.currentActiveScreen?.NowPlaying?.ScreenRuleRequest?.assetType == AssetTypes.Carousel) {
            id = this.currentActiveScreen?.NowPlaying?.Asset;
          }
        } else if (assetType?.assetType == AssetTypes.Carousel) {
          id = this.currentActiveScreen?.NowPlaying?.Asset;
        }
        this.addEditCarousel(id);
      }
      if (event?.target?.parentElement?.id == ContextMenu.removeAndShiftAssetsLeft) {
        this.RemoveAndShiftAssetsLeft();
      }
    }
  }


  addEditCarousel(id?: TreeNode) {

    this.carouselService.setScreenForCarousel(this.currentActiveScreen);
    this.dialog.open(CarouselComponent, {
      id: 'create-new-carousel',
      hasBackdrop: true,
      data: id ? id : undefined,
      width: '820px',
      height: '820px',
      backdropClass: 'scope-to-right-pannel',
    });

    this.carouselService.setCarouselPopupOpen();
  }

  /**
   * @description helps to remove existing asset and shift all the assets from left for any event
   * @cause_of_Invoke if clicked on `Remove content & shift assets left` in context menu of screen
   * @return void
   */
  RemoveAndShiftAssetsLeft() {
    let assetScreens: ProfileScreen[] = [];
    if (!!this.currentActiveScreen) {
      assetScreens = this.masterConfigService.getAllCurrentActiveScreens(this.currentActiveScreen, this.screenData!);
      assetScreens = this.masterConfigService.removeAndShiftAssetsLeft(assetScreens, this.currentActiveScreen);
      this.screenData?.AssetTypes.forEach(x => {
        if (x.TypeName.toLocaleLowerCase().trim() === this.currentActiveScreen.AssetType.toLocaleLowerCase().trim()) {
          x.Screens = assetScreens;
        }
      });

      const logInfo = {
        userAction: UserActions.RemoveContentAndShiftAssetsLeft,
        assetType: this.currentActiveScreen.AssetType.toLocaleLowerCase().trim(),
        screenData: this.screenData
      }
      this.realTimeUpdatesLoggerService.saveLog(logInfo);
      this.masterConfigService.enableSaveReset(this.screenData!);
    }
  }

  ChangeContextMenuItemOptionForLeftShitAsset(menuItems: MenuItem[], activeScreen: ProfileScreen): MenuItem[] {
    let assetScreens: ProfileScreen[] = [];
    assetScreens = this.masterConfigService.getAllCurrentActiveScreens(this.currentActiveScreen, this.screenData!);
    return this.masterConfigService.changeContextMenuOptionForLeftShitAsset(menuItems, this.currentActiveScreen, assetScreens);
  }

  ngOnDestroy() {
    this.listOfPofilesChanges.unsubscribe();
    this.currentProfileVal.unsubscribe();
    this.masterScreensData.unsubscribe();
    this.footerDataContent.unsubscribe();
    this.onSaveChanges.unsubscribe();
    this.onResetChanges.unsubscribe();
    this.onActivateProfileChanges.unsubscribe();

  }
}
