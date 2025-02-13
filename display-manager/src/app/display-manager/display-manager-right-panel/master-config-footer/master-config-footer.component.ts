import { Component, Input, OnInit } from '@angular/core';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';
import { ProfileConstants } from '../profiles/constants/profile-constants';
import { Footer } from '../profiles/models/footer-content';
import { RealTimeUpdatesHelperService } from 'src/app/common/services/real-time-updates/real-time-updates-helper.service';

@Component({
  selector: 'app-master-config-footer',
  templateUrl: './master-config-footer.component.html',
  styleUrls: ['./master-config-footer.component.scss']
})
export class MasterConfigFooterComponent implements OnInit {
  constructor(private masterConfigService: MasterConfigurationService,
    private realTimeUpdatesHelperService: RealTimeUpdatesHelperService
  ) { }

  @Input() footerData: Footer[];
  isEnable: boolean;


  ngOnInit(): void {
  }

  onFooterClick(footer: Footer) {
    this.realTimeUpdatesHelperService.resetMasterLayoutTouchedStatus();
    if (footer?.title === ProfileConstants.save) {
      this.masterConfigService.onSaveChanges$.next(ProfileConstants.saveInProgress);
      this.masterConfigService.toggleRightPanelDisableChanges$.next(true);
    }
    if (footer?.title === ProfileConstants.reset) {
      this.masterConfigService.onResetChanges$.next(true);
    }
    if (footer?.title === ProfileConstants.activate) {
      this.masterConfigService.onActivateProfileChanges$.next(true);
      this.masterConfigService.toggleRightPanelDisableChanges$.next(true);
    }
  }
}
