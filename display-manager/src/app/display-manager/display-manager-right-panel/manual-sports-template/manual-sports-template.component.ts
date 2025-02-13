import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, UntypedFormControl, UntypedFormArray, FormGroupDirective } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { Constants } from '../constants/constants';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';

@Component({
  selector: 'app-manual-sports-template',
  templateUrl: './manual-sports-template.component.html',
  styleUrls: ['./manual-sports-template.component.scss']
})
export class ManualSportsTemplateComponent implements OnInit {
  @Input() formGroupName: string;
  @Input() runners: any;
  @Input() isSubmit : boolean = false;
  RacingEvent!: UntypedFormGroup;
  manualConstants = Constants;
  isDraw: boolean = false;
  emptyArray: string[] = [];
  display_Rows: number = 11;
  runnersLength: number;
  hamburgerPath: string;
  addIconPath: string;
  selectionNamesRowCount: number = 8;
  maxNewRows: number = 50;
  @Input() menuName: string | null;
  @ViewChild('tableref', {  static: true  }) tableref: ElementRef ;
  constructor(private formBuilder: UntypedFormBuilder, private matDialogue: MatDialog, private rootFormGroup: FormGroupDirective,
    private masterConfigService: MasterConfigurationService) {
  this.createRacingForm(); // init form data  
  }

  ngOnInit() {
    if (this.menuName == this.manualConstants.manual_sports_outright) {
      this.selectionNamesRowCount = 6;
      this.maxNewRows =39;
     }
    this.RacingEvent = this.rootFormGroup.control.get(this.formGroupName) as UntypedFormGroup;    
    this.masterConfigService.manualIconPaths$.subscribe((manualIconPaths: any[]) => {
      if (manualIconPaths && manualIconPaths.length > 0) {
        this.hamburgerPath = manualIconPaths.filter(ele => ele.name == 'hamburgerIcon')[0].path;
        this.addIconPath = manualIconPaths.filter(ele => ele.name == 'plusGreenCircle')[0].path;
      }
    });
    if (this.runners && this.runners.length > 0) {
      if(this.menuName == this.manualConstants.manual_sports_outright) {
        this.selectionNamesRowCount =  this.runners.length;
      }      
      for(let i=0; i< this.runners.length; i++) {
        for (let i = 0; i < this.runners.length-1; i++) {
          this.runnersArray.push(this.addRow());
        }
        this.runnersArray.controls[i].patchValue(this.runners[i]);
      }
    }
    else if(this.runnersArray.controls?.length>0) {
      if(this.menuName == this.manualConstants.manual_sports_outright) {
        this.selectionNamesRowCount =  this.runnersArray.controls.length;
      } 
    }
    else {
      this.sampleData(); // setting up the question array data into form.
    }
    this.emptyArrayFormation();
  }

  sortEvents(event: any) {
    moveItemInArray(this.runnersArray.controls, event.previousIndex, event.currentIndex);
    this.sortArray();
  }

  createRacingForm() {
    this.RacingEvent = this.formBuilder.group({
      firstOdds: null,
      firstPlayer: null,
      draw: null,
      isDraw: false,
      secondPlayer: null,
      secondOdds: null,
      Runners: this.formBuilder.array([this.initRunners()]),
    });
  }

  //getter function ease up to get the form controls
  get runnersArray() {
    return this.RacingEvent.get('Runners') as UntypedFormArray;
  }

  initRunners() {
    return this.formBuilder.group({
      selectionName: new UntypedFormControl(null),
      time: new UntypedFormControl(null),
      firstOdds: new UntypedFormControl(null),
      firstPlayer: new UntypedFormControl(null),
      draw: new UntypedFormControl(null),
      secondPlayer: new UntypedFormControl(null),
      secondOdds: new UntypedFormControl(null),
      odds: new UntypedFormControl(null)
    });
  }

  sampleData() {
    for (let i = 0; i < this.selectionNamesRowCount; i++) {
      this.runnersArray.push(this.addRow());
    }
    this.emptyArrayFormation();
  }

  sortArray() {
    this.runnersLength = this.runnersArray.controls.filter(run => !run.value.isNonRunner).length;
    this.runnersArray.controls.sort((a, b) => {
      return <any>(a.value.isNonRunner) - <any>(b.value.isNonRunner);
    });
  }

  addRow() {
    return this.formBuilder.group({
      selectionName: [null],
      time: [null],
      firstOdds: [null],
      firstPlayer: [null],
      draw: [null],
      secondPlayer: [null],
      secondOdds: [null],
      odds: [null]
    });
  }

  addNewRow() {
    if (this.runnersArray && this.runnersArray.length <= this.maxNewRows) {
      this.runnersArray.push(this.addRow());
      this.emptyArrayFormation();
    }
    else {
      this.matDialogue.open(DialogueComponent, { data: { message: this.manualConstants.dialogue_message_maximum_rows_reached } });
    }
    this.sortArray();
  }
  payoutChange(index: number) {
    let newOddsSartPrice: string = this.runnersArray.controls[index].value.odds;
    let breakchk: boolean = false;
    for (let i = 0; i < newOddsSartPrice.length; i++) {
      if ((i == 0 && newOddsSartPrice[i] == '/') || (isNaN(Number(newOddsSartPrice[i])) && newOddsSartPrice[i] != '/') || (newOddsSartPrice.split('/').length > 2) || (i == newOddsSartPrice.length - 1 && newOddsSartPrice[i] == '/')||newOddsSartPrice[i] == ' ') {
        breakchk = true;
      }
    }

    if (breakchk) {
      this.matDialogue.open(DialogueComponent, { data: { message: this.manualConstants.dialogue_error_odds_sp } });
      this.runnersArray.controls[index].patchValue({ 'odds': null });
    }
  }

  deleteRow(indexNumber: number) {
    this.runnersArray.removeAt(indexNumber);
    this.emptyArrayFormation();
    this.sortArray();
    this.runnersArray.markAsDirty();
  }

  emptyArrayFormation() {
    if (this.display_Rows - this.runnersArray.length > 0) {
      this.emptyArray.length = this.display_Rows - this.runnersArray.length;
    }
    else {
      this.emptyArray.length = 0;
    }
  }

}
