import { AfterContentChecked, Component, ElementRef, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Constants } from '../constants/constants';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { MatDialog } from '@angular/material/dialog';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';
import { ManualFormService } from '../services/manualFormService/manual-form.service';

@Component({
  selector: 'app-manual-greyhound-prices',
  templateUrl: './manual-greyhound-prices.component.html',
  styleUrls: ['./manual-greyhound-prices.component.scss']
})
export class ManualGreyhoundPricesComponent implements OnInit, AfterContentChecked {

  @Input() selectedTabName: string | null;
  @Input() activeCountry: string;
  @Input() activeRows: number;
  @Input() activeFinishedArray: number[];
  @Input() runners: any;
  @Input() isSubmit: boolean;
  @Input() isResulted : boolean;
  @ViewChild('tableRefHorse', { static: true }) tableRefHorse: ElementRef;
  RacingEvent!: UntypedFormGroup;
  manualConstants = Constants;
  oddssp: boolean = false;
  hamburgerPath: string;
  totalRows: number;
  viewMode: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder,
    private matDialogue: MatDialog,
    private masterConfigService: MasterConfigurationService,
    private manualFormService: ManualFormService) { }

  ngOnChanges(changes: SimpleChanges) {
    if ('activeCountry' in changes) {
      if (changes?.activeCountry?.previousValue !== changes?.activeCountry?.currentValue) {
        this.createRacingForm();
        this.sampleData();
      }
    }
    if (this.selectedTabName == this.manualConstants.result) {
      this.runnersArray?.controls?.forEach((runner, index) => {
        this.runnersArray?.controls[index]?.patchValue({ 'price_odds_sp': runner?.value?.price_odds_sp, 'result_odds_sp': runner?.value?.result_odds_sp, 'odds_sp_value': runner?.value?.isVacant ? " " : this.oddssp ? this.manualConstants.sp : this.runnersArray?.controls[index]?.value?.result_odds_sp })
      })
      this.mapFinishedSelectionRunner();
    } else {
      this.runnersArray?.controls.forEach((runner, index) => {
        this.runnersArray?.controls[index]?.patchValue({ 'price_odds_sp': runner?.value?.price_odds_sp, 'result_odds_sp': runner?.value?.result_odds_sp, 'odds_sp_value': runner?.value?.isVacant ? " " : this.oddssp ? this.manualConstants.sp : this.runnersArray?.controls[index]?.value?.price_odds_sp })
      })
    }
  }

  setIconPaths() {
    this.masterConfigService?.manualIconPaths$.subscribe((manualIconPaths: any[]) => {
      if (!!manualIconPaths && manualIconPaths?.length > 0) {
        manualIconPaths?.forEach(icon => {
          switch (icon.name) {
            case 'hamburgerIcon':
              this.hamburgerPath = icon.path;
              break;
          }
        })
      }
    });
  }

  ngOnInit(): void {
    this.setIconPaths();
    this.runners = this.runners?.splice(0, this.totalRows);
    if (this.runners && this.runners?.length > 0) {
      for (let i = 0; i < this.runners.length; i++) {
        this.runnersArray?.controls[i] ? this.runnersArray?.controls[i]?.patchValue(this.runners[i]) : this.runnersArray?.controls.push(this.runners[i]);
      }
      if (this.runnersArray?.controls[0].value?.isStartPrice) {
        this.onChangeStartPricePayout(this.manualConstants.sp);
      }
    }
  }

  mapFinishedSelectionRunner() {
    this.runnersArray?.controls.forEach((runner, index) => {
      if((!runner.value?.finished || !(runner.value?.finished <= this.activeRows)) || index >= this.activeRows) {
        this.runnersArray?.controls[index]?.patchValue({ 'finished': index + 1 });
      }
    })
  }

  sortEvents(event: any) {
    moveItemInArray(this.runnersArray?.controls, event.previousIndex, event.currentIndex);
    if (this.selectedTabName == this.manualConstants.result) {
      this.mapFinishedSelectionRunner();
    }
    this.runnersArray.markAsDirty();
  }

  onFinishedChange() {
    this.manualFormService.finishedSortArray(this.runnersArray);
  }

  createRacingForm() {
    this.RacingEvent = this.formBuilder.group({
      Runners: this.formBuilder.array([this.initRunners()]),
    });
  }

  //getter function ease up to get the form controls
  get runnersArray() {
    return this.RacingEvent.get('Runners') as UntypedFormArray;
  }

  initRunners() {
    return this.formBuilder.group({
      finished: new UntypedFormControl(null),
      trapNumber: new UntypedFormControl(undefined, { validators: [Validators.required] }),
      greyhoundName: new UntypedFormControl(undefined, { validators: [Validators.required] }),
      price_odds_sp: new UntypedFormControl(null),
      odds_sp: [this.oddssp ? this.manualConstants.sp : null],
      odds_sp_value: new UntypedFormControl(null),
      result_odds_sp: new UntypedFormControl(null),
      isStartPrice: new UntypedFormControl(false),
      isVacant: new UntypedFormControl(false),
      isReserved: new UntypedFormControl(false),
      isFavourite: new UntypedFormControl(false)
    });
  }

  sampleData() {
    this.totalRows = this.activeCountry === 'UK' ? this.manualConstants.rows_by_countries.UK : this.manualConstants.rows_by_countries.AUS;
    for (let i = 0; i < this.totalRows - 1; i++) {
      this.runnersArray.push(this.addRow());
    }
  }

  onChangeVacant(event: any, index: number) {
    const { isReserved } = this.runnersArray.controls[index].value
    if (isReserved) {
      this.runnersArray.controls[index].patchValue({ 'isReserved': false });
    }
    this.runnersArray.controls[index].patchValue({
      'odds_sp_value': event.checked ? ' ' : (this.oddssp ? this.manualConstants.sp : (this.selectedTabName == this.manualConstants.showprice ? this.runnersArray?.controls[index]?.value?.price_odds_sp : this.runnersArray?.controls[index]?.value?.result_odds_sp)),
      'isFavourite': false
    });
  }

  onChangeReserved(event: any, index: number) {
    const { isVacant } = this.runnersArray.controls[index].value
    if (isVacant) {
      this.runnersArray.controls[index].patchValue({ 'isVacant': false });
    }
    this.runnersArray.controls[index].patchValue({
      'odds_sp_value': this.oddssp ? this.manualConstants.sp : (this.selectedTabName == this.manualConstants.showprice ? this.runnersArray?.controls[index]?.value?.price_odds_sp : this.runnersArray?.controls[index]?.value?.result_odds_sp)
    });
  }

  addRow() {
    return this.formBuilder.group({
      finished: [null],
      trapNumber: [undefined],
      greyhoundName: [undefined],
      price_odds_sp: [this.oddssp ? this.manualConstants.sp : null],
      odds_sp_value: [this.oddssp ? this.manualConstants.sp : null],
      result_odds_sp: [this.oddssp ? this.manualConstants.sp : null],
      odds_sp: [this.oddssp ? this.manualConstants.sp : null],
      isStartPrice: [this.oddssp ? true : false],
      isVacant: [false],
      isReserved: [false],
      isFavourite: [false]
    });
  }


  onChangeStartPricePayout(currentlabel: string) {
    if (currentlabel == this.manualConstants.sp) {
      this.oddssp = true;
      this.runnersArray?.controls.forEach((runner, index) => {
        this.runnersArray?.controls[index]?.patchValue({
          'isStartPrice': true, 'price_odds_sp': runner?.value?.price_odds_sp, 'result_odds_sp': runner?.value?.result_odds_sp,
          'odds_sp_value': runner?.value?.isVacant ? ' ' : this.manualConstants.sp
        });
      })
    }
    else {
      this.oddssp = false;
      this.runnersArray?.controls.forEach((runner, index) => {
        this.runnersArray?.controls[index]?.patchValue({
          'isStartPrice': false, 'price_odds_sp': runner?.value?.price_odds_sp, 'result_odds_sp': runner?.value?.result_odds_sp,
          'odds_sp_value': runner?.value?.isVacant ? ' ' : (this.selectedTabName == this.manualConstants.showprice ? this.runnersArray?.controls[index]?.value?.price_odds_sp : this.runnersArray?.controls[index]?.value?.result_odds_sp)
        });
      })
    }
    this.runnersArray.markAsDirty();
  }

  checkSelectionDuplicate(selection: number) {
    if (!!this.runnersArray.controls && this.runnersArray.controls.filter(ele => ele.value.trapNumber == this.runnersArray.controls[selection].value.trapNumber).length > 1) {
      this.matDialogue.open(DialogueComponent, { data: { message: this.manualConstants.dialogue_duplicate_trap_number } });
      this.runnersArray.controls[selection].patchValue({ 'trapNumber': null });
    }
      this.runnersArray.markAsDirty();
  }

  payoutChange(index: number) {
    this.manualFormService.payoutChange(index, this.runnersArray);
  }

  payoutChangeResult(index: number) {
    this.manualFormService.payoutChangeResult(index, this.runnersArray);
  }

  ngAfterContentChecked(): void {
    if(this.selectedTabName == this.manualConstants.showprice && this.isResulted) {
      this.viewMode = true;
    } else {
      this.viewMode = false;
    }
}

}
