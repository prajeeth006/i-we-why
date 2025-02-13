import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { Event } from 'src/app/display-manager/display-manager-left-panel/tree-view/models/event.model';
import { Constants } from '../constants/constants';
import { MAT_SELECT_CONFIG } from '@angular/material/select';
import { Manualfooter } from './manualfooter';
@Component({
  selector: 'app-manual-footer',
  templateUrl: './manual-footer.component.html',
  styleUrls: ['./manual-footer.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_CONFIG,
      useValue: { overlayPanelClass: 'custom-cdk-overlay-pane' },
    },
  ],
})
export class ManualFooterComponent implements OnInit {
  @Input() formGroupName: string;
  form!: UntypedFormGroup;
  manualConstants = Constants;
  @Input() selectedTabName: string | null;
  @Input() categories: Event[];
  @Input() isSubmit : boolean;
  multiEventForm: UntypedFormGroup;
  eachWayList: string[] = this.manualConstants.eachway_array;
  model: Manualfooter;
  constructor(private rootFormGroup: FormGroupDirective) { }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as UntypedFormGroup;
  }

}
