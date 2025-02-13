import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { Constants } from '../constants/constants';
import { MultiEventComponent } from '../multi-event/multi-event.component';
import { MatDialog } from '@angular/material/dialog';
import { RightPanelTabControlService } from '../services/tab-control.service';
import { ActionDialogComponent } from 'src/app/common/action-dialog/action-dialog.component';
@Component({
  selector: 'app-manual-sports-template-header',
  templateUrl: './manual-sports-template-header.component.html',
  styleUrls: ['./manual-sports-template-header.component.scss']
})
export class ManualSportsTemplateHeaderComponent implements OnInit {
  @Input() formGroupName: string;
  form!: UntypedFormGroup;
  @Input() menuName: string | null;
  manualConstants = Constants;
  @Input() isSubmit : boolean = false;
  @Input() isSaved : boolean = false;
  @Input() sportsList: string[];
  @Output() onChangeSport: EventEmitter<string> = new EventEmitter();
  @Input() activeSport: string;
  @Input() tabIndex: number;
  sportName: string;
  constructor(private rootFormGroup: FormGroupDirective, public dialog: MatDialog, public rightPanelTabControlService: RightPanelTabControlService) { }

  ngOnInit(): void {
    this.form = this.rootFormGroup.control.get(this.formGroupName) as UntypedFormGroup;
    if(this.isSaved) {
      this.form.get('sportName')?.disable();
    }
    if(!this.form?.controls?.sportName?.value) {
      this.onSportChange('Default', 'Default');
    }
    else {
      this.activeSport = this.form.controls.sportName.value;
      this.onSportChange('Default', this.form.controls.sportName.value);
    }
  }

  onSportChange(type: string, value: string) {
    const changeTemplateDialogData = {
      dialog_title: this.manualConstants.change_template,
      dialog_msg: this.manualConstants.change_template_save_msg,      
      dialog_btn_cancel: this.manualConstants.btn_cancel,
      dialog_btn_submit: this.manualConstants.btn_change
    }; 
    if (value) {
      if (type != 'Default') {
        const dialogRef = this.dialog.open(ActionDialogComponent, {
          id: 'change-modal',
          hasBackdrop: true,
          width: '40%',
          panelClass: 'modern-dialog',
          data: { ...changeTemplateDialogData, value: this.form.value.sportName, change: false },
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data) {
            this.sportName = this.form.value.sportName;
            this.onChangeSport.emit(this.form.value.sportName);
          }
          else {
            this.sportName = this.activeSport ? this.activeSport : ((this.sportsList && this.sportsList.filter(sport=> sport.toLowerCase() === this.manualConstants.default_manual_outright.toLowerCase())[0]) ? this.sportsList.filter(sport=> sport.toLowerCase() === this.manualConstants.default_manual_outright.toLowerCase())[0] : this.sportsList[0]);
            this.activeSport = this.sportName;
            this.form.controls.sportName.setValue(this.activeSport);
          }
        });
      } else {
        this.sportName = this.activeSport ? this.activeSport : ((this.sportsList && this.sportsList.filter(sport=> sport.toLowerCase() === this.manualConstants.default_manual_outright.toLowerCase())[0]) ? this.sportsList.filter(sport=> sport.toLowerCase() === this.manualConstants.default_manual_outright.toLowerCase())[0] : this.sportsList[0]);
        this.activeSport = this.sportName;
        this.form.controls.sportName.setValue(this.sportName);
          const obj = { 'sportName': this.sportName };
          this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'] = obj;
      }
    }
  }

}
