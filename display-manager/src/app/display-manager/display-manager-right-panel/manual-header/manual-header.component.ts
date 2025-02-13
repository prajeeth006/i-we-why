import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { ScMultiEventItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { MultiEventComponent } from '../multi-event/multi-event.component';
import { MatDialog } from '@angular/material/dialog';
import { Constants } from '../constants/constants';
import { RightPanelTabControlService } from '../services/tab-control.service';
import { ActionDialogComponent } from 'src/app/common/action-dialog/action-dialog.component';
@Component({
  selector: 'app-manual-header',
  templateUrl: './manual-header.component.html',
  styleUrls: ['./manual-header.component.scss']
})
export class ManualHeaderComponent implements OnInit {
  @Input() formGroupName: string;
  @Input() selectedTabName: string | null;
  form!: UntypedFormGroup;
  @Input() categories: string[];
  @Input() countries: string[];
  @Input() isSubmit: boolean;
  @Input() isSaved: boolean;
  marketTemplates: ScMultiEventItem[] = [];
  @Input() MultiEventComponentApi: MultiEventComponent;
  @Output() onChangeCategory: EventEmitter<string> = new EventEmitter();
  @Output() updateActiveCountry: EventEmitter<string> = new EventEmitter();
  @Input() activeCategory: string;
  @Input() activeCountry: string;
  @Input() tabIndex: number;
  categoryName: string;
  manualConstants = Constants;
  isPanelOpened: boolean;
  constructor(private rootFormGroup: FormGroupDirective, public dialog: MatDialog, public rightPanelTabControlService: RightPanelTabControlService) { }

  ngOnChanges(changes: SimpleChanges) {

    if ("formGroupName" in changes) {
      this.form = this.rootFormGroup.control.get(changes.formGroupName.currentValue) as UntypedFormGroup;
    }

    if ("activeCountry" in changes) {
      if (!!changes.activeCountry.currentValue) {
        this.form = this.rootFormGroup.control.get(this.formGroupName) as UntypedFormGroup;
        this.updateHeaderFields();
      }
    }
  }

  updateHeaderFields() {
    if (!!this.activeCategory) {
      this.onCategoryChange('Default', this.activeCategory);
      if (this.activeCategory === this.manualConstants.event_types.greyhounds) {
        this.onCountryChange('Default', this.activeCountry);
      }
    }
  }

  ngOnInit(): void {
    this.onCategoryChange('Default', this.activeCategory);
  }

  isNumberKey(evt: any) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;

    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  panelOpened(isPanelOpened: boolean) {
    this.isPanelOpened = isPanelOpened;
  }

  onCountryChange(type: string, value: string) {
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
          data: { ...changeTemplateDialogData, value: this.form.value.country, change: false },
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data) {
            this.updateActiveCountry.emit(this.form.value.country);
          }
          else {
            this.form.controls.country.setValue(this.activeCountry);
          }
        });
      } else {
        this.form.controls.country.setValue(value);
      }
      const obj = { 'category': this.form.value.category, 'country': value };
      this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'] = obj;
    }
  }

  onCategoryChange(type: string, value: string) {
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
          data: { ...changeTemplateDialogData, value: this.form.value.category, change: false },
        });
        dialogRef.afterClosed().subscribe((data) => {
          if (data) {
            this.categoryName = this.form.value.category;
            this.onChangeCategory.emit(this.form.value.category);
          }
          else {
            this.categoryName = this.activeCategory;
            this.form.controls.category.setValue(this.activeCategory);
          }
        });
      } else {
        this.categoryName = value;
        this.form.controls.category.setValue(value);
        if (value === this.manualConstants.event_types.horseRacing) {
          const obj = { 'category': value };
          this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'] = obj;
        }
      }
    }
  }

  maxAllowedHours() {
    if (Number(this.form.controls.timehrs.value) > 23) {
      this.form.controls.timehrs.setValue(null);
    }
  }

  maxAllowedMins() {
    if (Number(this.form.controls.timemins.value) > 59) {
      this.form.controls.timemins.setValue(null);
    }
  }

}
