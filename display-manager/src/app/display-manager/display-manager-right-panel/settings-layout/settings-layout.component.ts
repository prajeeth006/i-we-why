import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterLayoutTabs } from '../profiles/models/master-tabs';
import { PresetSequenceSettingsComponent } from './preset-sequence-settings/preset-sequence-settings.component';
import { SettingsHeaderComponent } from './settings-header/settings-header.component';
import { ScreenSettingsComponent } from './screen-settings/screen-settings.component';

@Component({
  selector: 'settings-layout',
  templateUrl: './settings-layout.component.html',
  styleUrls: ['./settings-layout.component.scss'],
  standalone: true,
  imports: [CommonModule, PresetSequenceSettingsComponent, SettingsHeaderComponent, ScreenSettingsComponent]
})
export class SettingsLayoutComponent implements OnInit {
  @Input() childTabs: MasterLayoutTabs[] = [];
  settingsNames: any = {};
  activeTabName: string;
  settingsInfo: MasterLayoutTabs = {} as MasterLayoutTabs;
  isTabSelected: boolean = false;
constructor(){}
  ngOnInit(): void {
    this.isTabSelected = false;
    this.childTabs.forEach(tab => {
      this.settingsNames[tab?.name?.split(" ")?.join('')?.toLowerCase()] = tab?.name;
    });
  }

  settingsChange(settingsData: MasterLayoutTabs): void {
    // Update settings info with selected tab data
      this.settingsInfo = settingsData;
    // Enable relevant feature based on the tab name
    this.activeTabName = settingsData?.name;
    this.isTabSelected = true;
  }

  backToSettings() {
    this.isTabSelected = false;
  }
}