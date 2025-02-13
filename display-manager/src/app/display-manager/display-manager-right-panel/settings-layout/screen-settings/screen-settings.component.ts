import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MasterLayoutTabs } from '../../profiles/models/master-tabs';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { SettingsLayoutService } from '../settings-layout.service';

@Component({
  selector: 'screen-settings',
  standalone: true,
  imports: [CommonModule, MatRadioModule, FormsModule],
  templateUrl: './screen-settings.component.html',
  styleUrls: ['./screen-settings.component.scss']
})
export class ScreenSettingsComponent {
  @Input() screenData: MasterLayoutTabs = {} as MasterLayoutTabs;
  screenSettingValue: string = '';
  oldScreenSettingValue: string = '';
  constructor(
    public labelSelectorService: LabelSelectorService,
    private settingLayoutService: SettingsLayoutService
  ) {
    this.settingLayoutService.screenSettingType$.subscribe((value) => {
      this.oldScreenSettingValue = value;
      this.screenSettingValue = value;
    });
    this.labelSelectorService.currentLabel$.subscribe((currentLabel: string) => {
      this.settingLayoutService.currentLabel = currentLabel;
      this.settingLayoutService.getscreenSettingType();
    });
  }

  save() {
    this.settingLayoutService.savescreenSettingType(this.oldScreenSettingValue, this.screenSettingValue);
  }

  cancel() {
    this.screenSettingValue = this.oldScreenSettingValue;
  }
}