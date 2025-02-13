import { Component, Input, OnInit } from '@angular/core';
import { MasterConfigurationService } from './services/master-configuration.service';
import { MasterLayoutTabs } from '../profiles/models/master-tabs';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { RealTimeUpdatesLoggerService } from 'src/app/common/services/real-time-updates/real-time-updates-logger.service';
import { RealTimeUpdatesHelperService } from 'src/app/common/services/real-time-updates/real-time-updates-helper.service';
import { SignalRConfigItem, SignalRService } from 'src/app/common/services/signalR-service/signal-r.service';
import { RealTimeUpdatesV2Service } from 'src/app/common/services/real-time-updates/real-time-updates-v2.service';
import { UserActions } from 'src/app/common/services/real-time-updates/models/real-time-logger.model';

@Component({
  selector: 'app-master-layout',
  templateUrl: './master-layout.component.html',
  styleUrls: ['./master-layout.component.scss']
})
export class MasterLayoutComponent implements OnInit {

  @Input() childTabs: MasterLayoutTabs[] = [];
  activeProfileValue: string;

  constructor(private masterConfigService: MasterConfigurationService,
    private realTimeUpdatesV2Service: RealTimeUpdatesV2Service,
    private signalRService: SignalRService,
    private realTimeUpdatesLoggerService: RealTimeUpdatesLoggerService,
    private realTimeUpdatesHelperService: RealTimeUpdatesHelperService,
  ) {
  }

  ngOnInit(): void {
    this.masterConfigService.currentProfileVal$.subscribe(
      (value) => { this.activeProfileValue = value; }
    );
  }

  selectedTabValue(event: MatTabChangeEvent) {
    let labelName = event.tab.textLabel;
    this.signalRService.signalRConfig$.subscribe((signalRconfig: SignalRConfigItem) => {
      if (signalRconfig.isRealTimeUpdatesEnabled) {
        console.log(`shouldUpdateTabsWithRealTimeData : ${this.realTimeUpdatesV2Service.shouldUpdateTabsWithRealTimeData}`);
        this.realTimeUpdatesV2Service.activeTabName = labelName;

        const logInfo = {
          userAction: UserActions.SwitchTab,
          currentTab: labelName,
          shouldUpdateTabsWithRealTimeData: this.realTimeUpdatesV2Service.shouldUpdateTabsWithRealTimeData,
          isProfileDropdownTouched: this.realTimeUpdatesHelperService.isProfileDropdownTouched$.value,
          isMasterScreensTouched: this.realTimeUpdatesHelperService.isMasterScreensTouched$.value,
        }
        this.realTimeUpdatesLoggerService.saveLog(logInfo);

        if (this.realTimeUpdatesV2Service.shouldUpdateTabsWithRealTimeData) {
          this.realTimeUpdatesV2Service.processRealTimeMasterData(UserActions.SwitchTab);
        }
      }
    });
  }

}
