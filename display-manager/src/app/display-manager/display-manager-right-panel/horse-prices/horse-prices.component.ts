import { AfterContentChecked, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormArray, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { Constants } from '../constants/constants';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';
import { ManualFormService } from '../services/manualFormService/manual-form.service';

@Component({
  selector: 'app-horse-prices',
  templateUrl: './horse-prices.component.html',
  styleUrls: ['./horse-prices.component.scss']
})
export class HorsePricesComponent implements OnInit, AfterContentChecked {
  RacingEvent!: UntypedFormGroup;
  manualConstants = Constants;
  oddssp: boolean = false;
  emptyArray: string[] = [];
  display_Rows: number = this.manualConstants.default_total_horse_rowsCount;
  runnersLength: number;
  hamburgerPath: string;
  addIconPath: string;
  resetIconPath: string;
  vectorIconPath: string;
  @Input() selectedTabName: string | null;
  @Input() activeRows: number;
  @Input() activeFinishedArray: number[];
  @Input() runners: any;
  @Input() isSubmit : boolean;
  @Input() isResulted : boolean;
  @ViewChild('tableRefHorse', { static: true }) tableRefHorse: ElementRef;
  viewMode: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder, private matDialogue: MatDialog, private masterConfigService: MasterConfigurationService, private manualFormService: ManualFormService, private cdr: ChangeDetectorRef) {
    this.createRacingForm(); // init form data
  }

  ngOnInit() {
    this.masterConfigService.manualIconPaths$.subscribe((manualIconPaths: any[]) => {
      if (manualIconPaths && manualIconPaths.length > 0) {
        this.hamburgerPath = manualIconPaths.filter(ele => ele.name == 'hamburgerIcon')[0].path;
        this.addIconPath = manualIconPaths.filter(ele => ele.name == 'plusGreenCircle')[0].path;
        this.resetIconPath = manualIconPaths.filter(ele => ele.name == 'resetIcon')[0].path;
        this.vectorIconPath = manualIconPaths.filter(ele => ele.name == 'VectorIcon')[0].path;
      }
    });
    if (this.runners && this.runners.length > 0) {
      this.runners = this.runners.filter((horse: any) => {
        return horse.horseName !== this.manualConstants.unnamed_2nd_favourite && horse.horseName !== this.manualConstants.unnamed_favourite;
      });

      for (let i = 0; i < this.runners.length - 1; i++) {
        if (this.runnersArray.length <= this.runners.length - 1) {
          this.runnersArray.push(this.addRow());
        }
      }

      for (let i = 0; i < this.runners.length; i++) {
        this.runnersArray?.controls[i] ? this.runnersArray?.controls[i]?.patchValue(this.runners[i]) : this.runnersArray?.controls.push(this.runners[i]);
      }
      if(this.runnersArray?.controls[0].value?.isStartPrice) {
        this.onChangeStartPricePayout(this.manualConstants.sp);
      }
    }
    else {
      this.sampleData(); // setting up the question array data into form.
    }
    this.emptyArrayFormation();
    this.runnersLength = this.runnersArray?.controls?.filter(run => !run.value?.isNonRunner).length;
    this.cdr.detectChanges();
  }

  ngOnChanges() {
    this.runnersLength = this.runnersArray?.controls?.filter(run => !run.value?.isNonRunner).length;
    if (this.selectedTabName == this.manualConstants.result) {
      this.runnersArray?.controls?.forEach((runner, index) => {
        this.runnersArray?.controls[index]?.patchValue({ 'price_odds_sp': runner?.value?.price_odds_sp, 'result_odds_sp': runner?.value?.result_odds_sp, 'odds_sp_value': runner?.value?.isNonRunner ? this.manualConstants.non_runner : this.oddssp ? this.manualConstants.sp : this.runnersArray?.controls[index]?.value?.result_odds_sp })
      })
      this.mapFinishedSelectionRunner();
    }
    else {
      this.runnersArray.controls.forEach((runner, index) => {
        this.runnersArray?.controls[index]?.patchValue({ 'price_odds_sp': runner?.value?.price_odds_sp, 'result_odds_sp': runner?.value?.result_odds_sp, 'odds_sp_value': runner?.value?.isNonRunner ? this.manualConstants.non_runner : this.oddssp ? this.manualConstants.sp : this.runnersArray?.controls[index]?.value?.price_odds_sp })
      })
    }
  }

  mapFinishedSelectionRunner() {
    this.runnersArray?.controls?.forEach((runner, index) => {
      if((!runner.value?.finished || !(runner.value?.finished <= this.activeRows)) || index >= this.activeRows) {
        this.runnersArray?.controls[index]?.patchValue({ 'finished': index + 1 });
      }
    })
  }

  sortEvents(event: any) {
    moveItemInArray(this.runnersArray?.controls, event.previousIndex - 1, event.currentIndex - 1);
    if (this.selectedTabName == this.manualConstants.result) {
      this.mapFinishedSelectionRunner();
    }
    this.sortArray();
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
      horseNumber: new UntypedFormControl(undefined, { validators: [Validators.required] }),
      horseName: new UntypedFormControl(undefined, { validators: [Validators.required] }),
      jockeyName: new UntypedFormControl(null),
      price_odds_sp: new UntypedFormControl(null),
      odds_sp: [this.oddssp ? this.manualConstants.sp : null],
      odds_sp_value: new UntypedFormControl(null),
      result_odds_sp: new UntypedFormControl(null),
      isStartPrice: new UntypedFormControl(false),
      isNonRunner: new UntypedFormControl(false),
      isFavourite: new UntypedFormControl(false)
    });
  }

  sampleData() {
    for (let i = 0; i < 8; i++) {
      this.runnersArray.push(this.addRow());
    }
    this.emptyArrayFormation();
  }

  changeRunner(event: any, index: number) {
    this.runnersArray.controls[index].patchValue({
      'odds_sp_value': event.checked ? this.manualConstants.non_runner : (this.oddssp ? this.manualConstants.sp : (this.selectedTabName == this.manualConstants.showprice ? this.runnersArray?.controls[index]?.value?.price_odds_sp : this.runnersArray?.controls[index]?.value?.result_odds_sp))
    });
    this.sortArray();
  }

  sortArray() {
    this.runnersLength = this.runnersArray?.controls.filter(run => !run.value?.isNonRunner).length;
    this.runnersArray?.controls.sort((a, b) => {
      return <any>(a.value?.isNonRunner) - <any>(b.value?.isNonRunner);
    });
  }

  addRow() {
    return this.formBuilder.group({
      finished: [null],
      horseNumber: [undefined],
      horseName: [undefined],
      jockeyName: [null],
      price_odds_sp: [this.oddssp ? this.manualConstants.sp : null],
      odds_sp_value: [this.oddssp ? this.manualConstants.sp : null],
      result_odds_sp: [this.oddssp ? this.manualConstants.sp : null],
      odds_sp: [this.oddssp ? this.manualConstants.sp : null],
      isStartPrice: [this.oddssp ? true : false],
      isNonRunner: [false],
      isFavourite: [false]
    });
  }

  addNewRow() {
    if (this.runnersArray && this.runnersArray?.length < this.manualConstants.max_horse_rowsCount) {
      this.runnersArray.push(this.addRow());
      this.emptyArrayFormation();
    }
    else {
      this.matDialogue.open(DialogueComponent, { data: { message: this.manualConstants.dialogue_message_maximum_rows_reached } });
    }
    this.sortArray();
  }

  deleteRow(indexNumber: number) {
    this.runnersArray.removeAt(indexNumber);
    this.emptyArrayFormation();
    this.sortArray();
    if (indexNumber < this.activeRows && this.selectedTabName == this.manualConstants.result) {
      this.runnersArray?.controls.forEach((runner, index) => {
        if (index < this.activeRows) {
          this.runnersArray?.controls[index]?.value?.finished <= this.activeRows ? null : this.runnersArray?.controls[index]?.patchValue({ 'finished': index + 1 });
        }
      })
    }
    this.runnersArray.markAsDirty();
  }

  onChangeStartPricePayout(currentlabel: string) {
    if (currentlabel == this.manualConstants.sp) {
      this.oddssp = true;
      this.runnersArray?.controls.forEach((runner, index) => {
        this.runnersArray?.controls[index]?.patchValue({
          'isStartPrice': true, 'price_odds_sp': runner?.value?.price_odds_sp, 'result_odds_sp': runner?.value?.result_odds_sp,
          'odds_sp_value': runner?.value?.isNonRunner ? this.manualConstants.non_runner : this.manualConstants.sp
        });
      })
    }
    else {
      this.oddssp = false;
      this.runnersArray?.controls.forEach((runner, index) => {
        this.runnersArray?.controls[index]?.patchValue({
          'isStartPrice': false, 'price_odds_sp': runner?.value?.price_odds_sp, 'result_odds_sp': runner?.value?.result_odds_sp,
          'odds_sp_value': runner?.value?.isNonRunner ? this.manualConstants.non_runner : (this.selectedTabName == this.manualConstants.showprice ? this.runnersArray?.controls[index]?.value?.price_odds_sp : this.runnersArray?.controls[index]?.value?.result_odds_sp)
        });
      })
    }
    this.runnersArray.markAsDirty();
  }

  emptyArrayFormation() {
    if (this.display_Rows - this.runnersArray?.length > 0) {
      this.emptyArray.length = this.display_Rows - this.runnersArray?.length;
    }
    else {
      this.emptyArray.length = 0;
    }
  }

  checkSelectionDuplicate(selection: number) {
    if (this.runnersArray?.controls && this.runnersArray?.controls.filter(ele => ele.value?.horseNumber == this.runnersArray.controls[selection]?.value?.horseNumber).length > 1) {
      this.matDialogue.open(DialogueComponent, { data: { message: this.manualConstants.dialogue_duplicate_selection_number } });
      this.runnersArray?.controls[selection]?.patchValue({ 'horseNumber': null });
    }
    else if (this.runnersArray?.controls[selection]?.value?.horseNumber == 0 || this.runnersArray?.controls[selection]?.value?.horseNumber > this.manualConstants.max_horse_rowsCount) {
      this.matDialogue.open(DialogueComponent, { data: { message: this.manualConstants.dialogue_inbetween_selection_number } });
      this.runnersArray?.controls[selection]?.patchValue({ 'horseNumber': null });
    }
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
