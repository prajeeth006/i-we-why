import { Injectable } from '@angular/core';
import { RealTimeUpdatesHelperService } from './real-time-updates-helper.service';
import { MatDialog } from '@angular/material/dialog';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { MasterConfigurationService } from 'src/app/display-manager/display-manager-right-panel/master-layout/services/master-configuration.service';
import { ApiService } from '../../api.service';
import { SignalRService } from '../signalR-service/signal-r.service';
import { map } from 'rxjs/operators';
import { Field, FormattedFields, SitecoreItemRoot, SitecoreItemRootFormatted } from '../signalR-service/signal-r.model';
import { MasterTabs } from '../../models/MasterTabs';
import { Footer } from 'src/app/display-manager/display-manager-right-panel/profiles/models/footer-content';
import { HttpParams } from '@angular/common/http';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { ProfileConstants } from 'src/app/display-manager/display-manager-right-panel/profiles/constants/profile-constants';
import { JsonUtilities } from 'src/app/helpers/json-utilities';
import { RealTimeActions, RealTimeEventKeys, UserActions, UserTypes } from './models/real-time-logger.model';
import { RealTimeUpdatesLoggerService } from './real-time-updates-logger.service';

@Injectable({
  providedIn: 'root'
})
export class RealTimeUpdatesV2Service {
  activeProfile: string;
  activeTabName: string = MasterTabs.Config;
  gantryType: string;
  hasRealTimeUpdates = false;
  hasLatestGantryData = false;
  hasLatestConfigData = false;
  shouldUpdateTabsWithRealTimeData = false;
  footerData: Footer[] = [];
  private isDialogOpen = false;
  previousTimeStamp: string = '';

  constructor(
    private realTimeUpdatesHelperService: RealTimeUpdatesHelperService,
    private masterConfigService: MasterConfigurationService,
    private signalRService: SignalRService,
    public dialog: MatDialog,
    private apiService: ApiService,
    private labelSelectorService: LabelSelectorService,
    private realTimeUpdatesLoggerService: RealTimeUpdatesLoggerService,
  ) { }

  /**
   * @description Initialized when Display Manager get Loaded [master-configuration.component.ts]
   * receives signalR message and process the message for realtime updates 
   */
  getRealTimeUpdatesWithSignalR() {
    this.signalRService.signalRMessage$
      .pipe(
        map((data: SitecoreItemRoot) => {
          let response = {} as SitecoreItemRootFormatted;
          if (!!data && !JsonUtilities.isEmptyObject(data)) {
            // Process only label specific incoming messages
            if (data?.Item?.Key?.toLowerCase().includes(RealTimeEventKeys.SaveComplete)) {
              this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
                if (data?.Item?.Path?.toLowerCase().includes(currentLabel?.toLowerCase())) {
                  response.Id = data?.Item?.Id;
                  response.Path = data?.Item?.Path;
                  response.Fields = {} as FormattedFields;
                  response.data = data;
                  data?.Item?.Fields?.forEach((field: Field) => response.Fields[field?.Key as keyof FormattedFields] = field?.Content);
                }
              })
            }
          }
          return response;
        })
      )
      .subscribe((sitecoreItemRoot: SitecoreItemRootFormatted) => {
        try {
          if (!JsonUtilities.isEmptyObject(sitecoreItemRoot)) {
            console.log("real time updates subscribed");
            this.processContentFromSignalR(sitecoreItemRoot);
          }
        } catch (e) {
          console.log(`Error in processing Content From SignalR ${e}`);
        }
      });
  }


  /**
   * @description to compare timestamps and give `true` if latest timestamp is most recent else `false`
   * Date.getTime() Returns the stored time value in milliseconds since midnight, January 1, 1970 UTC.
   * @param previous 
   * @param latest 
   * @returns true or false
   */
  isLatestTimeStamp(previous: string, latest: string): boolean {
    const previousTimeStamp = new Date(previous).getTime();
    const latestTimeStamp = new Date(latest).getTime();
    return latestTimeStamp > previousTimeStamp;
  }

  /**
   * @description Invoked when it has any Real-Time Updates.
   * @cause_of_Invoke When there is a save complete and has real time updates
   * @param sitecoreItemRoot 
   */
  processContentFromSignalR(sitecoreItemRoot: SitecoreItemRootFormatted) {
    this.hasRealTimeUpdates = false;
    if (!!this.previousTimeStamp) {
      if (!!sitecoreItemRoot?.Fields?.timestamp && this.isLatestTimeStamp(this.previousTimeStamp, sitecoreItemRoot?.Fields?.timestamp)) {
        this.hasRealTimeUpdates = true;

        const logInfo = {
          userType: UserTypes.Default,
          userAction: RealTimeActions.ProcessRealTimeUpdates,
          hasRealTimeUpdates: this.hasRealTimeUpdates,
          isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
          isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value,
          previousTimeStamp: this.previousTimeStamp,
          publisherInfo: {
            user: sitecoreItemRoot?.Fields?.username,
            timestamp: sitecoreItemRoot?.Fields?.timestamp,
          }
        }
        this.realTimeUpdatesLoggerService.saveLog(logInfo);

        this.previousTimeStamp = sitecoreItemRoot?.Fields?.timestamp;
      } else {
        const logInfo = {
          userType: UserTypes.Default,
          userAction: UserActions.None,
          info: "Not processing realtime time due to invalid real-time message",
          hasRealTimeUpdates: this.hasRealTimeUpdates,
          isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
          isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value,
          previousTimeStamp: this.previousTimeStamp,
          publisherInfo: sitecoreItemRoot.data
        }
        this.realTimeUpdatesLoggerService.saveLog(logInfo);
        return;
      }
    } else {
      this.hasRealTimeUpdates = true;

      const logInfo = {
        userType: UserTypes.Default,
        userAction: RealTimeActions.ProcessRealTimeUpdates,
        hasRealTimeUpdates: this.hasRealTimeUpdates,
        isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
        isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value,
        previousTimeStamp: this.previousTimeStamp,
        publisherInfo: {
          user: sitecoreItemRoot?.Fields?.username,
          timestamp: sitecoreItemRoot?.Fields?.timestamp,
        }
      }
      this.realTimeUpdatesLoggerService.saveLog(logInfo);

      this.previousTimeStamp = sitecoreItemRoot?.Fields?.timestamp;
    }

    if (this.hasRealTimeUpdates) {
      this.updateMasterTabsStatus(false);
      this.processRealTimeMasterData();
    } else {
      this.realTimeUpdatesHelperService.resetMasterLayoutTouchedStatus();
      const logInfo = {
        userType: UserTypes.Default,
        userAction: UserActions.None,
        isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
        isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value
      }
      this.realTimeUpdatesLoggerService.saveLog(logInfo);
    }
  }

  /**
   * @description update the status based on both tabs have the latest screens info or not.
   * @returns void
   */
  updateMasterTabsStatus(status: boolean) {
    this.hasLatestGantryData = status;
    this.hasLatestConfigData = status;
  }

  /**
   * @description update the status based on both tabs have the latest screens info or not.
   * @returns void
   */
  updateTabsStatusOnRealTimeUpdates(): void {
    this.shouldUpdateTabsWithRealTimeData = !(this.hasLatestGantryData && this.hasLatestConfigData);
  }

  /**
   * @description Invoked when it has any Real-Time Updates.
   * @cause_of_Invoke 
   * 1. while doing Drag & Drop (or) 
   * 2. Remove content & shift assets left (or) 
   * 3. Carousel Add or Edit (or)
   * 4. Switch between Tabs [Master] --> | Config | Gantry |
   */
  loadRealTimeMasterData(action: string) {
    const userSelectedProfile = this.realTimeUpdatesHelperService.userSelectedProfile$.value;
    switch (this.activeTabName) {
      case MasterTabs.Gantry:
        const logInfo = {
          userType: UserTypes.Subscriber,
          userAction: action,
          currentTab: MasterTabs.Gantry,
          hasLatestGantryData: this.hasLatestGantryData,
        }
        this.realTimeUpdatesLoggerService.saveLog(logInfo);
        this.handleRealTimeUpdatesAlert(action);
        console.log("hasLatestGantryData:", this.hasLatestGantryData);

        if (!this.hasLatestGantryData) {
          this.masterConfigService.loadMasterScreensData(userSelectedProfile, this.gantryType, false);
          this.hasLatestGantryData = true;
        }
        break;
      case MasterTabs.Config:
        const logInfo1 = {
          userType: UserTypes.Subscriber,
          userAction: action,
          currentTab: MasterTabs.Config,
          hasLatestConfigData: this.hasLatestConfigData,
        }
        this.realTimeUpdatesLoggerService.saveLog(logInfo1);
        this.handleRealTimeUpdatesAlert(action);
        console.log("hasLatestConfigData:", this.hasLatestConfigData);

        if (!this.hasLatestConfigData) {
          this.masterConfigService.loadMasterScreensData(userSelectedProfile, ProfileConstants.master);
          this.hasLatestConfigData = true;
        }
        break;
    }
    this.updateTabsStatusOnRealTimeUpdates();
    const logInfo = {
      userType: UserTypes.Subscriber,
      userAction: action,
      shouldUpdateTabsWithRealTimeData: this.shouldUpdateTabsWithRealTimeData
    }
    this.realTimeUpdatesLoggerService.saveLog(logInfo);
  }

  handleRealTimeUpdatesAlert(action: string) {
    const isMasterScreensTouched = this.realTimeUpdatesHelperService.isMasterScreensTouched$.value;
    const isProfileDropdownTouched = this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value;
    const isRealTimeUpdatesAlertRequired = (isProfileDropdownTouched || isMasterScreensTouched);

    isRealTimeUpdatesAlertRequired && this.masterConfigService.disableResetAndSaveChangesBtns(this.footerData);
    const logInfo = {
      userType: UserTypes.Subscriber,
      userAction: action,
      isRealTimeUpdatesAlertRequired
    }

    this.realTimeUpdatesLoggerService.saveLog(logInfo);

    console.log(`RealTimeUpdates Alert : ${isRealTimeUpdatesAlertRequired}`);
    isRealTimeUpdatesAlertRequired && this.showRealTimeUpdatesAlert();
  }

  /**
   * @describe Invoked when there is Profile Dropdown Changed (or) Master Config Screens Changed 
   * @returns void
   */
  showRealTimeUpdatesAlert() {
    if (this.isDialogOpen) {
      return;
    }
    this.isDialogOpen = true;
    let realTimeUpdatesMsg = 'Another User has updated screen assignments. Envision Display Manager has been updated to reflect this change.';

    const dialogRef = this.dialog.open(DialogueComponent, {
      id: 'realtime-updates',
      width: '40%',
      hasBackdrop: true,
      data: { title: 'Real Time Updates', message: realTimeUpdatesMsg }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen = false;
      this.realTimeUpdatesHelperService.resetMasterLayoutTouchedStatus();
      const logInfo = {
        userType: UserTypes.Subscriber,
        userAction: UserActions.None,
        isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
        isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value
      }
      this.realTimeUpdatesLoggerService.saveLog(logInfo);
    });
  }


  /**
   * @description Invoked when it has any Real-Time Updates (or) switch between Tabs [Master] --> | Config | Gantry |
   */
  processRealTimeMasterData(action: string = RealTimeActions.ProcessRealTimeUpdates) {
    this.activeProfile = this.masterConfigService.currentProfileVal$.value;
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      let params = new HttpParams().append('currentLabel', currentLabel);
      this.apiService.get<string>('/sitecore/api/displayManager/getCurrentProfiles', params).subscribe((recentActiveProfile: string) => {
        if (this.activeProfile !== recentActiveProfile) {
          this.activeProfile = recentActiveProfile;
          const logInfo = {
            userType: UserTypes.Subscriber,
            realTimeAction: RealTimeActions.ProfileDropdownUpdateFromRealTime,
            currentProfile: this.activeProfile,
          }
          this.realTimeUpdatesLoggerService.saveLog(logInfo);
          // Updating the active profile will invoke the loadMasterConfigData in [master-configuration.component.ts]
          this.masterConfigService.currentProfileVal$.next(this.activeProfile);
          this.updateMasterTabsStatus(true);
          this.updateTabsStatusOnRealTimeUpdates();
          this.handleRealTimeUpdatesAlert(action);
        } else {
          this.loadRealTimeMasterData(action);
        }
      });
    });
  }
}
