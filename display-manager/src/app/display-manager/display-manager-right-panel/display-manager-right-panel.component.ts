import { Component } from '@angular/core';
import { MasterConfigurationService } from './master-layout/services/master-configuration.service';

@Component({
  selector: 'display-manager-right-panel',
  templateUrl: './display-manager-right-panel.component.html',
  styleUrls: ['./display-manager-right-panel.component.scss']
})

export class DisplayManagerRightPanelComponent {
  toggle = this.masterConfigService.toggleRightPanelDisableChanges$.subscribe(toggleresult => {
    this.setToggle(toggleresult)
  });
  toggleRightPanelDisable: boolean = false;
  constructor(private masterConfigService: MasterConfigurationService) {
  }

  setToggle(toggleresult: boolean) {
    this.toggleRightPanelDisable = toggleresult;
  }
  
}
