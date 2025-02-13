import { Component, OnInit } from '@angular/core';
import { DesignConfiguration } from 'src/app/common/models/design-configuration.model';
import { DesignConfigurationService } from 'src/app/common/services/design-configuration/design-configuration.service';

@Component({
  selector: 'gn-horse-racing-navigator',
  templateUrl: './horse-racing-navigator.component.html',
  styleUrls: ['./horse-racing-navigator.component.scss']
})
export class HorseRacingNavigatorComponent implements OnInit {
  isNewDesignEnabled = false;

  constructor(
    private designConfigService: DesignConfigurationService,
  ) {
  }

  ngOnInit(): void {
    this.designConfigService.designConfiguration$.subscribe((designconfig: DesignConfiguration) => {
      this.isNewDesignEnabled = designconfig.isNewDesignEnabled;
    });;
  }
}
