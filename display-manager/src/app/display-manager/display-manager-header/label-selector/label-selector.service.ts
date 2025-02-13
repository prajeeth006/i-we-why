import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, of } from 'rxjs';
import * as xml2js from 'xml2js';
import { TreeBreadCrumbService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/tree-bread-crumb-services/tree-bread-crumb.service';
import { CommonService } from 'src/app/display-manager/display-manager-left-panel/tree-view/services/common-service/common.service';
import { FilterEvents } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filter-events.enum';
import { Settings } from 'src/app/common/models/key-value-config';
import { ApiService } from 'src/app/common/api.service';
import { RealTimeUpdatesHelperService } from 'src/app/common/services/real-time-updates/real-time-updates-helper.service';
import { RealTimeUpdatesLoggerService } from 'src/app/common/services/real-time-updates/real-time-updates-logger.service';
import { UserActions } from 'src/app/common/services/real-time-updates/models/real-time-logger.model';
import { map, tap } from 'rxjs/operators';
import { TabColours } from '../../display-manager-right-panel/profiles/models/master-tabs';
import { SequencencingHelperService } from '../../services/sequencencing-helper/sequencencing-helper.service';
import { MatDialog } from '@angular/material/dialog';

export interface GantryConfig {
  Settings: Settings;
}

export interface ConfigItem {
  basepath: string;
  labels: string;
  Coral: string;
  Ladbrokes: string;
  leftPanelPath: string;
  IsMasterEnabled: boolean;
  IsPreviewPostMetod: boolean;
  enableHttpInterceptor: boolean;
  isPreviewAssetRefactored: boolean;
  IsNewRuleProcessFlow: boolean;
  CoralCarouselPath: boolean;
  LadbrokesCarouselPath: boolean;
  sequencingEnabled: boolean;
  SwitchingTabs: string;
  TabDotColors: string;
  masterToIndividual_allAssigned: string;
  masterToIndividual_notAllAssigned: string;
  individualToMaster_allAssigned: string;
  individualToMaster_notAllAssigned: string;
  individual_screen_disruptedMsg: string;
  layout_confirmation_msg: string;
  layout_confirmation_sub_msg: string;
}

@Injectable({
  providedIn: 'root'
})
export class LabelSelectorService {
  private sequencencingHelperService = inject(SequencencingHelperService);

  private basePath: string;
  currentLabelBasePath: string;
  currentLabelLeftPanelPath: string;
  labelCssClass: string;
  currentLabelBasePath$: ReplaySubject<string> = new ReplaySubject<string>(1);
  configItemValues$: ReplaySubject<ConfigItem> = new ReplaySubject<ConfigItem>(1);
  labels$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  switchingTabs$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  tabDotColors$: BehaviorSubject<TabColours> = new BehaviorSubject<TabColours>({} as TabColours);
  currentLabel$: ReplaySubject<string> = new ReplaySubject<string>(1);
  configItemValues: ConfigItem;

  parseString: (str: xml2js.convertableToString, cb: any) => void;

  private sequencingEnabledSubject = new BehaviorSubject<boolean>(false);
  sequencingEnabled$ = this.sequencingEnabledSubject.asObservable();

  constructor(private apiService: ApiService,
    private realTimeUpdatesHelperService: RealTimeUpdatesHelperService,
    private realTimeUpdatesLoggerService: RealTimeUpdatesLoggerService,
    private treeBreadCrumbService: TreeBreadCrumbService,
    private commonService: CommonService,
    private dialog: MatDialog) {
    this.parseString = new xml2js.Parser({ ignoreAttrs: false, mergeAttrs: true, charkey: 'value' }).parseString;
  }

  loadLabels() {

    this.apiService.get<ConfigItem>('/sitecore/api/displayManager/getGantryConfiguration')
  .pipe(
    tap((configItem: ConfigItem | null | undefined) => {
      if (!configItem || Object.keys(configItem).length === 0) {
        console.error('Config item is null, empty, or undefined');
        return; // Exit early if configItem is not valid
      }

      // Set the values in the respective subjects
      this.configItemValues$.next(configItem);
      this.configItemValues = configItem;
      this.basePath = configItem.basepath || '';
      this.labels$.next(configItem.labels?.split('|') || []);
      this.switchingTabs$.next(configItem.SwitchingTabs?.split('|')?.map(tab => tab.toLowerCase()) || []);
      this.tabDotColors$.next(configItem.TabDotColors ? JSON.parse(configItem.TabDotColors) : {} as TabColours);
      this.updatesequencingEnabled(configItem.sequencingEnabled || false);

      // Handle current label logic
      const existingLabel = sessionStorage.getItem('selectedLabel');
      const currentLabel = existingLabel || (this.labels$.value.length > 0 ? this.labels$.value[0] : '');
      this.updateCurrentLabel(currentLabel, UserActions.PageLoad);
    })
  )
  .subscribe();
  }

  updateCurrentLabel(currentLabel: string, userAction: string = UserActions.ChangeLabel) {
    this.currentLabelBasePath = this.basePath + currentLabel;
    this.currentLabelLeftPanelPath = this.configItemValues.leftPanelPath + currentLabel;
    sessionStorage.setItem('selectedLabel', currentLabel);
    this.currentLabelBasePath$.next(this.currentLabelBasePath);
    this.labelCssClass = currentLabel + '-background-colour';
    this.currentLabel$.next(currentLabel);
    this.dialog.closeAll();

    // to clear breadcrumb data on switching labels(coral/ladbrokes)
    this.treeBreadCrumbService.breadCrumbData.next({});
    // to clear the selected Filter value for sports/racing
    this.commonService.filterRacingEventVal = FilterEvents.Next15;
    this.realTimeUpdatesHelperService.resetMasterLayoutTouchedStatus();
    if (userAction === UserActions.ChangeLabel) {
      const logInfo = {
        userAction: UserActions.ChangeLabel,
        currentLabel: currentLabel
      }
      this.realTimeUpdatesLoggerService.saveLog(logInfo);
    }

    // enable display manager left panel
    this.sequencencingHelperService._isLeftPannelInActive.set(false);
    // reset sequence Journey
    this.sequencencingHelperService.setSequenceJourneyStatus(false);
  }

  getCurrentLabel(): string {
    var existingLabel = sessionStorage.getItem('selectedLabel');
    return existingLabel ? existingLabel : this.labels$.value[0];
  }

  getLabelUrls(currentLable: string): any {
    if (currentLable?.toLowerCase() == 'ladbrokes')
      return this.configItemValues?.Ladbrokes;
    return this.configItemValues?.Coral;
  }

  getLabelCoralUrls(currentLable: string): any {
    if (this.configItemValues?.IsNewRuleProcessFlow == true) {
      if (currentLable?.toLowerCase() == 'ladbrokes')
        return this.configItemValues?.LadbrokesCarouselPath;
      return this.configItemValues?.CoralCarouselPath;
    } else {
      return this.currentLabelBasePath + '/Carousel'
    }
  }

  getIncludeRacingConfiguration(currentLabel?: string): Observable<string> {
    let params = new HttpParams().append('currentLabel', currentLabel ? currentLabel : "");
    return this.apiService.get<string>('/sitecore/api/displayManager/getIncludeRacingConfiguration', params)
  }

  updatesequencingEnabled(value: boolean) {
    this.sequencingEnabledSubject.next(value);
  }
}
