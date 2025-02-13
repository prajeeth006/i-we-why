import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MasterLayoutTabs } from '../../profiles/models/master-tabs';

@Component({
  selector: 'app-settings-header',
  standalone: true,
  imports: [NgIf, MatIconModule],
  templateUrl: './settings-header.component.html',
  styleUrl: './settings-header.component.scss'
})
export class SettingsHeaderComponent {
  @Input() settingsInfo: MasterLayoutTabs = {} as MasterLayoutTabs;
  @Output() back: EventEmitter<any> = new EventEmitter();

  goBack(event: any) {
    this.back.emit(null);
  }
}