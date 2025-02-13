import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { Filters } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/model/filters.model';
import { DialogTrackerData, MultieventService } from './services/multievent.service';
import { Event, RacingEvents } from '../../display-manager-left-panel/tree-view/models/event.model';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { ProductTabService } from 'src/app/display-manager/display-manager-left-panel/product-tabs/services/product-tab.service';
import { ProductTabs } from 'src/app/display-manager/display-manager-left-panel/product-tabs/product-tab-names';
import { ScMultiEventItem } from 'src/app/sitecore/sc-models/sc-item.model';
import { MatDialog } from '@angular/material/dialog';
import { RightPanelTabControlService } from '../services/tab-control.service';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { Constants } from '../constants/constants';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';
import { HorsePricesComponent } from '../horse-prices/horse-prices.component';
import { BaseTreeViewService } from 'src/app/display-manager/display-manager-left-panel/generic-tab-service/services/base-tree-view.service';
import { IMultiEventTabs, SelectedItem, ManualInitializingForm } from './model/IMultiEventTabs';
import { Observable } from 'rxjs';
import { ManualSportsTemplateComponent } from '../manual-sports-template/manual-sports-template.component';
import { ManualGreyhoundPricesComponent } from '../manual-greyhound-prices/manual-greyhound-prices.component';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { ArrayUtilities } from 'src/app/helpers/array-utilities';
import { BOMUtilities } from 'src/app/helpers/bom-utilities';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActionDialogComponent } from 'src/app/common/action-dialog/action-dialog.component';
@Component({
  selector: 'multi-event',
  templateUrl: './multi-event.component.html',
  styleUrls: ['./multi-event.component.scss']
})
export class MultiEventComponent implements OnInit {

  @Input() tabIndex: number;
  datePipe: DatePipe = new DatePipe('en-US');
  todayDate: string | null = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
  maxAllowDate: string | null = this.datePipe.transform(new Date(new Date().setDate(new Date().getDate() + 7)), 'yyyy-MM-dd');
  categories: Event[] = [];
  regions: Event[] = [];
  competitions: Event[] = [];
  @Input() eventType: string;
  filter: Filters = new Filters();
  manualConstants = Constants;
  tabNamesEnum = ProductTabs;
  marketTemplates: ScMultiEventItem[] = [];
  multiEventForm!: UntypedFormGroup;
  SelectedItemArray: SelectedItem[] = [];
  selectedTabName: string | null = null;
  currentLabel: string;
  @Output() selectedTabChange: EventEmitter<MatTabChangeEvent>
  events: Event[] = [];
  activeRowsArray: number[] = ArrayUtilities.getListOfRange(9);
  resetIconPath: string;
  activeRows: number = this.manualConstants.default_active_rows;
  activeFinishedArray: number[] = [];
  isManualSports: boolean = false;
  @ViewChild(HorsePricesComponent) childComponent: HorsePricesComponent;
  @ViewChild(ManualGreyhoundPricesComponent) manualGreyHoundsComponent: ManualGreyhoundPricesComponent;
  @ViewChild(ManualSportsTemplateComponent) childComponentoutright: ManualSportsTemplateComponent;
  @Input() eventFormData: any = {};
  isSaved: boolean = false;
  manualRacingList: string[] = [];
  manualOutrightSportsList: string[] = [];
  name: string;
  tabName: string;
  id: string;
  targetid: string;
  infoErrorIconPath: string;
  hamburgerPath: string;
  dialogRef: any;
  result_mappings: any;
  manualWidth: string = '850px';
  nonmanualWidth: string = '40%';
  manualHeight: string = '200px';
  nonmanualHeight: string = '200px';
  manualIconPaths: any;
  multieventTabs: IMultiEventTabs[] = [];
  gantryUrl: any;
  nameData: any;
  mainClassWrapper: string;
  multiEventForm$: Observable<UntypedFormGroup>;
  savedRecord: any; countries: string[];
  activeCategory: string = this.manualConstants.event_types.horseRacing;
  isManualGreyHounds: boolean = false;
  activeCountry: string = this.manualConstants.countries[0];
  isResulted: boolean = false;
  raceoffState: number = this.manualConstants.raceoff_stages.Untouched;
  invalidControlNames: string[] = [];
  firstInvalidControlNames: string;
  invalidFocusControlNames: string[] = [];
  counter: number = 0;
  validCounter: number;
  validControlNames: string[] = [];
  isSubmit: boolean = false;
  isValuePresent: boolean = true;
  focusFlag: boolean;
  isResetFlag: boolean = false;
  defaultNameForSave: string = '';
  isOverride: boolean = false;
  activeSport: string;

  constructor(public fb: UntypedFormBuilder,
    private multieventService: MultieventService,
    private labelSelectorService: LabelSelectorService,
    public productTabService: ProductTabService,
    public rightPanelTabControlService: RightPanelTabControlService,
    public dialog: MatDialog, private baseTreeViewService: BaseTreeViewService,
    private masterConfigService: MasterConfigurationService, private el: ElementRef) { }
  getParentAPI(): MultiEventComponentApi {
    return {
      callParentMethod: () => {
        this.saveMultiEvent()
      }
    }
  }

  ngOnInit(): void {
    this.getMainSectionSpecialClass(this.eventType);
    this.currentLabel = this.labelSelectorService.getCurrentLabel().toLowerCase();
    this.manualIconPaths = this.masterConfigService.manualIconPaths$.subscribe((manualIconPaths: any[]) => {
      if (manualIconPaths && manualIconPaths.length > 0) {
        this.hamburgerPath = manualIconPaths.filter(ele => ele.name == 'hamburgerIcon')[0].path;
        this.resetIconPath = manualIconPaths.filter(ele => ele.name == 'resetIcon')[0].path;
        this.infoErrorIconPath = manualIconPaths.filter(ele => ele.name == 'InfoErrorIcon')[0].path;
      }
    });
    if (this.eventType == this.manualConstants.manual_sports_multi_market || this.eventType == this.manualConstants.manual_sports_outright || this.eventType == this.manualConstants.manual_sports_coupon) {
      this.isManualSports = true;
    }
    else {
      this.isManualSports = false;
    }
    this.eventType == this.tabNamesEnum.sports ? this.loadSports() : (this.eventType == this.manualConstants.manual ? this.loadManualTemplates() : this.loadRacing());
    this.tabName = this.rightPanelTabControlService.multieventTabs[this.tabIndex]['tabName'];
    if (this.tabName != this.manualConstants.untitled_text) {
      this.isSaved = true;
      this.name = this.rightPanelTabControlService.multieventTabs[this.tabIndex]['savedData']?.tabName;
      this.targetid = this.rightPanelTabControlService.multieventTabs[this.tabIndex]['savedData']?.targetid;
      this.id = this.rightPanelTabControlService.multieventTabs[this.tabIndex]['savedData']?.id;
    }
    this.initializeMultieventForm();
    this.multiEventForm.valueChanges.subscribe((value) => {
      this.validCounter = 0;
      this.validControlNames = [];
      if (this.events && this.events.length > 0) {
        this.rightPanelTabControlService.multieventTabs[this.tabIndex]['eventFormData'][this.eventType == this.tabNamesEnum.sports ? 'sportsHeaderGroup' : 'racingHeaderGroup']['racingEvents'] = this.events;
      }
      this.rightPanelTabControlService.multieventTabs[this.tabIndex]['eventFormData'] = this.prepareFormData(this.multiEventForm.value);
      this.enbaleSaveResetButton(this.multiEventForm);
    });
    this.getValidControlNames(this.multiEventForm);
    this.enbaleSaveResetButton(this.multiEventForm);
    this.nameData = this.multieventService?.dialogTrackerData?.subscribe(data => {
      if (data && data?.tabIndex == this.tabIndex) {
        this.name = data.name;
        this.tabIndex = data?.tabIndex;
        this.result_mappings = this.manualConstants.manual_sports_racing_mappings[0];
        this.tabName = this.eventType === this.manualConstants.manual ? this.manualConstants.manual : this.result_mappings[this.eventType];
        if (!this.name) {
          this.saveMultiEvent();
        }
        else {
          this.save();
        }
      }
    });
    this.isResetFlag ? this.isResetFlag = false : this.switchToShowPriceTab();
    
    const newData: any = this.prepareFormData(this.multiEventForm.value);
    this.getDefaultNameForSave(newData);
  }

  ngAfterViewInit(): void {
    this.setRunnersForm();
  }

  enbaleSaveResetButton(control: AbstractControl) {
    let index = 0;
    this.isValuePresent = true;
    this.checkFormValues(control, '');
  }


  checkFormValues(
    control: AbstractControl,
    fieldName: string) {
    if (control instanceof UntypedFormGroup) {
      Object.keys(control.controls).forEach(controlName => {
        let formControl = control.get(controlName);
        if (formControl) {
          this.checkFormValues(formControl, controlName);
        }
      })
    }

    if (control instanceof UntypedFormArray) {
      control.controls.forEach((fControl: AbstractControl, index) => {
        this.checkFormValues(fControl, "Array");
      })
      const controlValue: string | null = control.value;
    }
    let controlValue: string | null = control.value;
    if (control.status == "VALID" && !!controlValue && controlValue != 'false' &&
      this.manualConstants.Invalid_fields_default.indexOf(fieldName) == -1 &&
      !Array.isArray(controlValue) && typeof (controlValue) != 'object') {
      if (this.isValuePresent) {
        this.isValuePresent = false
      }
    }
    if (this.multiEventForm.controls?.activerows?.dirty) {
      this.isValuePresent = false;
    }
    if(this.multiEventForm.controls?.runnersForm?.dirty) {
      if (this.isManualGreyHounds) {
        this.isValuePresent = false;
      }
      else if(this.activeCategory == this.manualConstants.default_Horse && this.selectedTabName == this.manualConstants.result) {
        this.isValuePresent = false;
      }
    }    
    return this.isValuePresent;
  }

  setRunnersForm() {
    if (this.eventType == this.manualConstants.manual) {
      if (this.isManualGreyHounds) {
        setTimeout(() => {
          this.multiEventForm.addControl('runnersForm', this.manualGreyHoundsComponent?.RacingEvent);
          this.multiEventForm.removeControl('Runners');
        }, 0)
      }
      else {
        setTimeout(() => {
          this.multiEventForm.addControl('runnersForm', this.childComponent?.RacingEvent);
          this.multiEventForm.removeControl('Runners');
        }, 0)
      }
    }
  }

  switchToShowPriceTab() {
    if (this.eventType == this.manualConstants.manual) {
      this.selectedTabName = this.manualConstants.showprice;
    }
  }

  updateActiveCategory(category: string) {
    this.switchToShowPriceTab();
    this.resetMultiEvent();
    this.activeCategory = category;
    this.activeCountry = this.manualConstants.countries[0];
    this.eventFormData = this.multieventService.resetRacingFormData(this.eventFormData, this.activeCategory, this.activeCountry);
    this.updateMultiEventFormData();
    this.setRunnersForm();
    if (!this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'].isSaved) {
      this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'] = this.prepareFormData(this.eventFormData);
    }
  }

  updateActiveSport(sport: string) {
    if(sport) {
      this.resetMultiEvent();    
      this.activeSport = sport;
      this.eventFormData = this.multieventService.resetManualSportFormData(this.eventFormData, this.activeSport);
      this.updateMultiEventFormData();
      if (!this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'].isSaved) {
        this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'] = this.prepareFormData(this.eventFormData);
      }
    }    
  }

  updateActiveCountry(country: string) {
    this.switchToShowPriceTab();
    this.resetMultiEvent();
    this.activeCountry = country;
    this.eventFormData = this.multieventService.resetRacingFormData(this.eventFormData, this.activeCategory, this.activeCountry);
    this.updateMultiEventFormData();
    this.setRunnersForm();
  }

  loadSports() {
    this.multieventService.loadSportCategories(this.labelSelectorService.getCurrentLabel(), new Filters()).subscribe((data: RacingEvents) => {
      this.categories = data?.content;
    })
  }

  loadRacing() {
    this.multieventService.loadRacingCategories(this.labelSelectorService.getCurrentLabel(), new Filters()).subscribe((data: RacingEvents) => {
      this.categories = data?.content;
    })
  }

  loadManualOutrightSportsList() {
    this.multieventService.loadManualOutrightSportsList(this.labelSelectorService.getCurrentLabel()).subscribe((data: string[]) => {
      this.manualOutrightSportsList = data;
    })
  }

  loadManualTemplates() {
    this.manualRacingList = this.manualConstants.manual_racings;
    this.countries = this.manualConstants.countries;
  }

  setActiveRowsArray() {
    if (this.isManualGreyHounds) {
      let rowsCount = this.activeCountry === this.manualConstants.countries[1] ? this.manualConstants.rows_by_countries.AUS : this.manualConstants.rows_by_countries.UK
      this.activeRowsArray = ArrayUtilities.getListOfRange(rowsCount);
    } else {
      if (this.eventType == this.manualConstants.manual_sports_outright) {
        this.activeRowsArray = ArrayUtilities.getListOfRange(this.manualConstants.default_outright_selectionsCount);
      } else {
        this.activeRowsArray = ArrayUtilities.getListOfRange(9);
      }
    }
  }

  updateMultiEventFormData() {
    const defaultFormData = this.rightPanelTabControlService.multieventTabs[this.tabIndex]['savedData'];
    if (defaultFormData?.override?.eventKey) {
      this.isOverride = true;
    }
    if (this.activeSport) {
      this.eventFormData.sportName = this.activeSport
    }
    const resultObj: ManualInitializingForm = this.multieventService.loadInitializeMultiEventForm(this.eventFormData, this.eventType, this.isManualGreyHounds);
    if (this.activeSport) {
      resultObj.data.sportName = this.activeSport;
    }
    if (resultObj) {
      this.raceoffState = resultObj.raceoffState ? resultObj.raceoffState : this.raceoffState;
      this.savedRecord = JSON.parse(JSON.stringify(resultObj?.data?.value));
      this.isSaved = defaultFormData?.isSaved ? defaultFormData.isSaved : resultObj?.isSaved;
      this.savedRecord.isSaved = this.isSaved;
      this.name = this.name ? this.name : resultObj?.name;
      this.savedRecord.name = this.name;
      this.savedRecord.tabName = this.name;
      this.id = this.id ? this.id : resultObj?.id;
      this.savedRecord.id = this.id;
      this.targetid = this.targetid ? this.targetid : resultObj?.targetid;
      this.savedRecord.targetid = this.targetid;
      this.isResulted = resultObj?.isResulted;
      this.savedRecord.isResulted = this.isResulted;
      this.multiEventForm = resultObj?.data;
      if(this.eventType == this.manualConstants.manual_sports_outright && this.savedRecord.manualSportsMultiMarketHeaderGroup.sportName) {
        this.activeSport = this.savedRecord.manualSportsMultiMarketHeaderGroup.sportName;
      }
      
      if (this.eventType == this.tabNamesEnum.sports || this.eventType == this.tabNamesEnum.racing) {
        this.events = resultObj?.data?.value[this.eventType == this.tabNamesEnum.sports ? 'sportsHeaderGroup' : 'racingHeaderGroup']?.racingEvents;
      }
      if (this.isSaved) {
        this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'] = this.prepareFormData(this.savedRecord);
        this.rightPanelTabControlService.multieventTabs[this.tabIndex]['eventFormData']['isSaved'] = this.isSaved;
        this.rightPanelTabControlService.multieventTabs[this.tabIndex]['eventFormData']['id'] = this.id;
        this.rightPanelTabControlService.multieventTabs[this.tabIndex]['eventFormData']['targetid'] = this.targetid;
        this.rightPanelTabControlService.multieventTabs[this.tabIndex]['eventFormData']['tabName'] = this.name;
      }
        this.multiEventForm.markAsPristine();
    }
  }

  initializeMultieventForm() {
    if (this.eventType === this.manualConstants.manual) {
      if (!!this.eventFormData?.category) {
        // edit existing
        this.activeCategory = this.eventFormData?.category;
        if (this.activeCategory === this.manualConstants.event_types.greyhounds) {
          this.activeCountry = this.eventFormData?.country;
        }
      } else {
        // new template
        if (!!this.activeCategory) {
          if (this.activeCategory === this.manualConstants.event_types.greyhounds) {
            this.activeCategory = this.activeCategory ? this.activeCategory : this.multiEventForm.value?.manualGreyhoundsHeaderGroup?.category;
            this.activeCountry = this.activeCountry ? this.activeCountry : this.multiEventForm.value?.manualGreyhoundsHeaderGroup?.activeCountry;
          } else {
            this.activeCategory = this.activeCategory ? this.activeCategory : this.multiEventForm.value?.manualHeaderGroup?.category;
          }
        }
      }
      if(this.eventFormData?.isEventResulted || this.eventFormData?.isResulted || this.savedRecord?.isResulted) {
        this.isResulted = true;
        this.eventFormData.isResulted = this.isResulted;
        this.eventFormData.isEventResulted = this.isResulted;
      }      
      this.raceoffState = this.eventFormData?.raceoffState ? this.eventFormData?.raceoffState : this.manualConstants.raceoff_stages.Untouched;
      this.activeRows = this.eventFormData?.activerows ? this.eventFormData?.activerows : this.activeRows;
    }
    this.isManualGreyHounds = this.activeCategory === this.manualConstants.event_types.greyhounds;
    this.setActiveRowsArray();
    this.updateMultiEventFormData();
  }

  setFocus() {
    if (this.firstInvalidControlNames == 'odds' || this.firstInvalidControlNames == 'selectionName') {
      let rowNumber: number = 0;
      let cellNumber: number = 0;
      for (let row of this.childComponentoutright.tableref.nativeElement.tBodies[0].rows) {
        rowNumber += 1;
        if (row.cells[1].getElementsByTagName('input')[0].value == '') { //selection name
          cellNumber = 1;
          break;
        }
        if (row.cells[2].getElementsByTagName('input')[0].value == '') { //odds
          cellNumber = 2
          break;
        }
      }
      this.childComponentoutright.tableref.nativeElement.tBodies[0].rows[rowNumber - 1].cells[cellNumber].getElementsByTagName('input')[0]?.focus()
    }
    else {
      const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="' + this.firstInvalidControlNames + '"]');
      invalidControl?.focus();
    }
  }


  saveMultiEvent() {
    this.counter = 0;
    if (this.multiEventForm.invalid) {
      this.isSubmit = true;
      this.firstInvalidControlNames = '';
      this.getInvalidControlNames(this.multiEventForm);
      this.focusFlag = false;
      if (this.eventType == this.manualConstants.manual_sports_outright) {
        this.setFocus();
      }
      else if (this.eventType == this.manualConstants.manual) {
        this.setInvalidFocusControlHorse();
      }
    }

    if (this.counter == 0 || !this.multiEventForm.invalid) {
      this.result_mappings = this.manualConstants.manual_sports_racing_mappings[0];
      this.tabName = this.eventType === this.manualConstants.manual ? this.manualConstants.manual : this.result_mappings[this.eventType];
      this.activeCategory = this.multiEventForm.value?.manualHeaderGroup?.category;
      if (!this.activeCategory) {
        this.activeCategory = this.multiEventForm.value?.manualGreyhoundsHeaderGroup?.category;
      }
      if (!this.isSaved) {

        const saveEventDialogData = {
          isSaveMode: true,
          dialog_title: this.manualConstants.create_event,          
          dialog_btn_cancel: this.manualConstants.btn_cancel,
          dialog_btn_submit: this.manualConstants.btn_save
        };

        const dialogRef = this.dialog.open(ActionDialogComponent, {
          id: 'create-new-multievent',
          hasBackdrop: true,
          width: '40%',
          panelClass: 'modern-dialog',
          disableClose: true,
          data: { ...saveEventDialogData, infoErrorIcon: this.infoErrorIconPath, tabIndex: this.tabIndex, name: this.defaultNameForSave },
        });
    
        dialogRef.afterClosed().subscribe(result => {
          if (result?.success) {
            this.save(); 
          } 
        });

      } else {
        this.save();
      }
    }
    else {
      this.multiEventForm.markAllAsTouched();
    }
  }

  save() {
    if (this.tabName != this.manualConstants.manual && !this.isManualSports) {
      let data = {
        name: this.name,
        racingEvents: this.events,
        tabIndex: this.tabIndex,
        labelName: this.labelSelectorService.getCurrentLabel(),
        tabName: this.tabName,
        target: (this.eventType == this.tabNamesEnum.sports) ? this.multiEventForm?.value?.sportsHeaderGroup?.market?.ItemID : this.multiEventForm?.value?.racingHeaderGroup?.market?.ItemID,
        isPageDoesNotDependsOnEvents: (this.eventType == this.tabNamesEnum.sports) ? this.multiEventForm?.value?.sportsHeaderGroup?.market?.IsPageDoesNotDependsOnEvents == '1' : this.multiEventForm?.value?.racingHeaderGroup?.market?.IsPageDoesNotDependsOnEvents == '1'
      }
      this.saveMultiEventData(data);
    }
    else {
      const newData: any = this.prepareFormData(this.multiEventForm.value);
      if(this.isResulted || this.eventFormData?.isEventResulted || this.eventFormData?.isResulted || this.savedRecord?.isResulted) {
        newData.isEventResulted = true;
        newData.isResulted = true;
      }
      this.eventFormData = newData;
      let data = {
        id: this.id,
        name: this.name,
        EventFormData: newData,
        tabIndex: this.tabIndex,
        labelName: this.labelSelectorService.getCurrentLabel(),
        tabName: this.getTabName(newData),
        target: '',
        racingEvents: [],
        targetFolderId: '',
        override: newData.override
      }
      this.saveManualRacingData(data);
    }
  }

  saveMultiEventData(multiEventData: any) {
    this.multieventService.saveMultiEvent(multiEventData).subscribe(() => {
      this.dialogRef?.close();
      this.multieventService?.dialogErrorData?.next(false);
      this.multieventService?.dialogTrackerData?.next({} as DialogTrackerData);
      this.rightPanelTabControlService?.closeTab(this.tabIndex);
    });
  }

  saveManualRacingData(manualRacingData: any) {
    this.multieventService.saveManualEvent(manualRacingData).subscribe((resp: any) => {
      if (resp && resp.message) {
        this.multieventService?.dialogErrorData?.next(true);
      }
      else {
        this.rightPanelTabControlService.changeTabName(this.tabIndex, this.name, this.eventType);
        this.isSaved = true;
        if(this.multiEventForm?.value?.isEventResulted) {
          this.isResulted = this.multiEventForm?.value?.isEventResulted;
          this.multiEventForm.get('isEventResulted')?.disable();
          this.multiEventForm.get('raceoff')?.disable();
        }        
        this.savedRecord = JSON.parse(JSON.stringify(this.multiEventForm?.value));
        this.savedRecord.isResulted = this.isResulted;
        if (resp) {
          this.id = resp.ID;
          this.targetid = resp.TargetId;
          this.raceoffState = resp.EventFormData.raceoffState;
          this.savedRecord.id = this.id;
          this.savedRecord.tabName = this.name;
          this.savedRecord.targetid = this.targetid;
          this.savedRecord.raceoffState = this.raceoffState;
        }
        this.savedRecord.isSaved = this.isSaved;
        this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'] = this.prepareFormData(this.savedRecord);
        this.rightPanelTabControlService.multieventTabs[this.tabIndex]['savedData'] = this.rightPanelTabControlService.multieventTabs[this.tabIndex]['defaultFormData'];
        this.multiEventForm.markAsPristine();
        this.dialogRef?.close();
        this.multieventService?.dialogErrorData?.next(false);
        this.multieventService?.dialogTrackerData?.next({} as DialogTrackerData);
      }

    });
  }

  prepareFormData(formData: any) {
    let newData: any = {};
    for (let key in formData) {
      if (this.manualConstants.manualObjectKeys.includes(key)) {
        for (let newkey in formData[key]) {
          newData[newkey] = formData[key][newkey];
        }
      }
      else if (this.manualConstants.manualObjectKeys.indexOf(key) == -1) {
        newData[key] = formData[key];
      }
    }
    if (!!newData) {
      newData['isEventResulted'] = !!newData['isEventResulted'] ? newData['isEventResulted'] : false;
      newData['raceoff'] = !!newData['raceoff'] ? newData['raceoff'] : false;
      newData['activerows'] = !!newData['activerows'] ? newData['activerows'] : this.activeRows;
    }

    if (newData['raceoff']) {
      newData['raceoffState'] = this.manualConstants.raceoff_stages.Happened;
    } else {
      if (this.raceoffState > this.manualConstants.raceoff_stages.Untouched) {
        newData['raceoffState'] = this.manualConstants.raceoff_stages.Done;
      } else {
        newData['raceoffState'] = this.manualConstants.raceoff_stages.Untouched;
      }
    }
    if(this.eventType == this.manualConstants.manual_sports_outright && this.activeSport) {
      newData['sportName'] = this.activeSport;
    }

    newData.folderName = this.eventType;

    return newData;
  }

  resetMultiEvent() {
    this.isResetFlag = true;
    if (this.manualIconPaths) {
      this.manualIconPaths.unsubscribe();
    }
    if (this.gantryUrl) {
      this.gantryUrl.unsubscribe();
    }
    if (this.nameData) {
      this.nameData.unsubscribe();
    }

    this.isSubmit = false;
    this.multiEventForm.reset();
    this.counter = 0;
    const eventType = this.eventType;
    this.eventType = '';
    setTimeout(() => {
      this.eventType = eventType;
      if (this.isSaved) {
        this.isSubmit = true;
        this.eventFormData = this.rightPanelTabControlService.multieventTabs[this.tabIndex]['savedData'];
      }
      else if (this.isOverride) {
        this.eventFormData = this.rightPanelTabControlService.multieventTabs[this.tabIndex]['savedData'];
      }
      else {
        if (this.eventType == this.manualConstants.manual_sports_outright) {
          this.activeRows = this.manualConstants.default_outright_selectionsCount;
          this.eventFormData.Runners.length = this.manualConstants.default_outright_selectionsCount;
          this.eventFormData.activerows = this.manualConstants.default_outright_selectionsCount;
          this.onActiveRowsChange(this.manualConstants.default_outright_selectionsCount);
        } else {
          this.eventFormData.activerows = this.manualConstants.default_active_rows;
          this.onActiveRowsChange(this.manualConstants.default_active_rows);
        }
        
        if (this.activeCategory == this.manualConstants.event_types.horseRacing && this.eventType != this.manualConstants.manual_sports_outright) {
          this.eventFormData.Runners.length = this.manualConstants.default_horse_rowsCount;
        } else if (this.activeCategory == this.manualConstants.event_types.greyhounds && this.eventType != this.manualConstants.manual_sports_outright) {
          this.eventFormData.Runners.length = this.activeCountry === this.manualConstants.countries[1] ? this.manualConstants.rows_by_countries.AUS : this.manualConstants.rows_by_countries.UK;
        }
      }
      this.ngOnInit();
      this.setRunnersForm();

    }, 0)

  }

  sortEvents(event: any) {
    moveItemInArray(this.events, event.previousIndex, event.currentIndex);
  }

  tabChanged(textLabel: string) {
    this.activeRows = this.eventFormData?.activerows ? this.eventFormData?.activerows : this.activeRows;
    this.counter = 0;
    this.isSubmit = false;
    this.selectedTabName = (textLabel == this.manualConstants.result) ? this.manualConstants.result : this.manualConstants.showprice;
    if (textLabel == this.manualConstants.result) {
      this.multiEventForm?.controls?.activerows?.setValue(this.activeRows);
      this.onActiveRowsChange(this.activeRows);
    }
    this.getMainSectionSpecialClass(this.eventType);
    this.invalidControlNames = [];
  }

  private getInvalidControlNames(input: UntypedFormGroup | UntypedFormArray): string[] {
    Object.keys(input.controls).forEach((controlName) => {
      const control = input.get(controlName)!;
      if (control.invalid && control instanceof UntypedFormControl) {
        this.invalidControlNames.push(controlName);
        this.counter = this.counter + 1;
        if (this.manualConstants.non_focus_items.indexOf(controlName) == -1) {
          this.firstInvalidControlNames == '' && (this.firstInvalidControlNames = controlName);
        }
      } else if (
        control.invalid &&
        (control instanceof UntypedFormGroup || control instanceof UntypedFormArray)
      ) {
        this.invalidControlNames.push(...this.getInvalidControlNames(control));
      }
    });
    return [...new Set(this.invalidControlNames)];
  }

  setInvalidFocusControlHorse() {
    if (this.manualConstants.focus_items.indexOf(this.firstInvalidControlNames) != -1) {
      let rowNumber: number = 0;
      let cellNumber: number = 0;
      let requiredArray = this.isManualGreyHounds ? this.manualGreyHoundsComponent?.tableRefHorse?.nativeElement?.tBodies[0]?.rows : this.childComponent?.tableRefHorse?.nativeElement?.tBodies[0]?.rows;
      for (let row of requiredArray) {
        rowNumber = rowNumber + 1;
        let breakcheck: boolean = false;
        for (let j = 2; j < row.cells.length; j++) {
          const property = row?.cells[j]?.getElementsByTagName('input')[0];
          if (property?.value == '' && property?.required) {
            cellNumber = j;
            breakcheck = true;
            break;
          }
        }
        if (breakcheck) {
          break;
        }
      }
      this.isManualGreyHounds ? this.manualGreyHoundsComponent?.tableRefHorse?.nativeElement?.tBodies[0]?.rows[rowNumber - 1]?.cells[cellNumber]?.getElementsByTagName('input')[0]?.focus() : this.childComponent?.tableRefHorse?.nativeElement?.tBodies[0]?.rows[rowNumber - 1]?.cells[cellNumber]?.getElementsByTagName('input')[0]?.focus();
    }
    else {
      const invalidControl = this.el.nativeElement?.querySelector('[formcontrolname="' + this.firstInvalidControlNames + '"]');
      invalidControl?.focus();
    }

  }

  private getValidControlNames(input: UntypedFormGroup | UntypedFormArray): string[] {
    Object.keys(input.controls).forEach((controlName) => {
      const control = input.get(controlName)!;
      if (control.valid && control instanceof UntypedFormControl) {
        this.validControlNames.push(controlName);
        this.validCounter = this.validCounter + 1;
      } else if (control instanceof UntypedFormGroup || control instanceof UntypedFormArray
      ) {
        this.validControlNames.push(...this.getValidControlNames(control));
      }
    });
    return [...new Set(this.validControlNames)];
  }

  eventsResult(events: Event[]) {
    this.events = events;
    this.rightPanelTabControlService.multieventTabs[this.tabIndex]['eventFormData'][this.eventType == this.tabNamesEnum.sports ? 'sportsHeaderGroup' : 'racingHeaderGroup']['racingEvents'] = this.events;
  }

  onActiveRowsChange(event: number) {
    this.activeFinishedArray = [];
    let i: number = 1;
    while (i <= event) {
      this.activeFinishedArray.push(i);
      i++;
    }
  }

  previewItem() {
    let gantryUrl = '';
    let _this = { contentItemId: this.id, id: this.targetid };
    gantryUrl = this.labelSelectorService.getLabelUrls(this.currentLabel) + 'getGantryUrlBasedOnTargetId?displayRuleItemId=';
    let targetItemID = JSON.stringify(_this);
    this.gantryUrl = this.baseTreeViewService.getUrl(gantryUrl, targetItemID).subscribe((url: string) => {
      if (url)
        BOMUtilities.openInNewTab(url);
    }, (err: string) => {
      console.error(err);
    });
  }

  ngOnDestroy() {
    if (this.manualIconPaths) {
      this.manualIconPaths.unsubscribe();
    }
    if (this.gantryUrl) {
      this.gantryUrl.unsubscribe();
    }
    if (this.nameData) {
      this.nameData.unsubscribe();
    }
  }

  getDividerSpecialClass(eventType: string) {
    return eventType === this.tabNamesEnum.sports ? 'sports-line-section' : this.isManualSports ? 'manual-sports-multiMarket' : '';
  }

  getMainSectionSpecialClass(eventType: string) {
    if (eventType.toLowerCase() === 'sports') { return this.mainClassWrapper = 'sports-coupon'; }
    else if (eventType.toLowerCase() === 'racing') { return this.mainClassWrapper = 'racing-challenges'; }
    else if (eventType.toLowerCase() === 'multi market') { return this.mainClassWrapper = 'multi-market-manual-sport-template'; }
    else if (eventType.toLowerCase() === 'outright') { this.manualOutrightSportsList.length == 0 && this.loadManualOutrightSportsList(); return this.mainClassWrapper = 'outright-manual-sport-template'; }
    else if (eventType.toLowerCase() === 'coupon') { return this.mainClassWrapper = 'coupon-manual-sport-template'; }
    else if (eventType.toLowerCase() === 'manual' && this.selectedTabName == this.manualConstants.result) {
      return this.mainClassWrapper = 'manual-horse-racing-result';
    }
    else {
      return this.mainClassWrapper = 'manual-racing-template';

    }
  }

  getTabName(formData: any) {
    return formData?.category ?
      (formData.override && formData.override?.eventKey ?
        this.result_mappings[this.manualConstants.override][formData.category] :
        this.result_mappings[this.manualConstants.manual][formData.category]
      ) :
      this.tabName
  }

  getDefaultNameForSave(formData: any){
    if(formData.override && formData.override?.eventKey){
      this.defaultNameForSave = formData.timehrs + formData.timemins + ' ' + formData.meetingName;
    }
  }

}

export interface MultiEventComponentApi {
  callParentMethod: () => void
}
