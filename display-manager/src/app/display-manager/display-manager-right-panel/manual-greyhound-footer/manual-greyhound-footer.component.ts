import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { Event } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/event.model';
import { Constants } from '../constants/constants';
import { MAT_SELECT_CONFIG } from '@angular/material/select';

@Component({
  selector: 'app-manual-greyhound-footer',
  templateUrl: './manual-greyhound-footer.component.html',
  styleUrls: ['./manual-greyhound-footer.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'greyhounds-custom-cdk-overlay-pane' },
    },
  ],
})
export class ManualGreyhoundFooterComponent implements OnInit {
  @Input() formGroupName: string;
  form!: UntypedFormGroup;
  manualConstants = Constants;
  @Input() selectedTabName: string | null;
  @Input() categories: Event[];
  @Input() isSubmit: boolean;
  multiEventForm: UntypedFormGroup;
  eachWayList: string[] = this.manualConstants.grayhounds_eachway_array;
  constructor(private rootFormGroup: FormGroupDirective) { }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as UntypedFormGroup;
  }

}
