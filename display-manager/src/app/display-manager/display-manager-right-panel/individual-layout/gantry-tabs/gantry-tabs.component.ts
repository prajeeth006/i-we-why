import { Component, inject, signal, effect, WritableSignal } from '@angular/core';
import { NgClass } from '@angular/common';
import { IndividualConfigurationService } from '../services/individual-configuration.service';
import { SequencencingHelperService } from 'src/app/display-manager/services/sequencencing-helper/sequencencing-helper.service';
import { GantryLayout } from '../models/individual-gantry-screens.model';

@Component({
  selector: 'app-gantry-tabs',
  templateUrl: './gantry-tabs.component.html',
  styleUrls: ['./gantry-tabs.component.scss'],
  standalone: true,
  imports: [NgClass]
})
export class GantryTabsComponent {
  private individualConfigService = inject(IndividualConfigurationService);
  sequencencingHelper = inject(SequencencingHelperService);
  currentProfile: string;
  gantryShops: Array<string> = [];
  gantryLayouts: Array<GantryLayout> = [];
  currentLayoutType: string = "";

  constructor() {
    effect(() => {
      this.gantryShops = this.individualConfigService._individualGantryLayoutTypes();
    })
    effect(() => {
      this.gantryLayouts = this.individualConfigService._gantryLayouts();
    })
    
    effect(() => {
      this.currentLayoutType = this.individualConfigService._currentLayoutType();
    })
  }

  /**
   * @description to select and switch between gantry layout types
   * @param gantryType
   * @param index
   */
  selectGantryType(gantryType: string) {
    this.individualConfigService._currentLayoutType.set(gantryType);
  }
}
