import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormControl, FormArray } from '@angular/forms';
import { ManualGreyhoundPricesComponent } from './manual-greyhound-prices.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { OnlyNumber } from '../only-number.directive';
import { of, BehaviorSubject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { Constants } from '../constants/constants';
import { SimpleChanges } from '@angular/core';

describe('ManualGreyhoundPricesComponent', () => {
  let component: ManualGreyhoundPricesComponent;
  let fixture: ComponentFixture<ManualGreyhoundPricesComponent>;
  let mockMasterConfigurationService: jasmine.SpyObj<MasterConfigurationService>;
  let matDialogSpy: jasmine.SpyObj<MatDialog>;

  beforeEach(async () => {
    const manualIconPathsSubject = new BehaviorSubject<any[]>([
      { name: 'hamburgerIcon', path: 'path/to/hamburger' },
    ]);

    mockMasterConfigurationService = jasmine.createSpyObj('MasterConfigurationService', {
      getRacingEvent: of({
        runners: [
          {
            isVacant: false,
            isReserved: false,
            trapNumber: 1,
            greyhoundName: 'Greyhound 1',
          },
        ],
      }),
    });

    mockMasterConfigurationService.manualIconPaths$ = manualIconPathsSubject;

    matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [ManualGreyhoundPricesComponent, OnlyNumber],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        DragDropModule,
        MatSlideToggleModule,
      ],
      providers: [
        { provide: MasterConfigurationService, useValue: mockMasterConfigurationService },
        { provide: MatDialog, useValue: matDialogSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ManualGreyhoundPricesComponent);
    component = fixture.componentInstance;

    const formArray = new FormArray([
      new FormGroup({
        price_odds_sp: new FormControl('10'),
        result_odds_sp: new FormControl('15'),
        isVacant: new FormControl(false),
        odds_sp_value: new FormControl(''),
      }),
    ]);
    spyOnProperty(component, 'runnersArray', 'get').and.returnValue(formArray);

    component.manualConstants = Constants;

    component.RacingEvent = new FormGroup({
      Runners: new FormArray([
        new FormGroup({
          isVacant: new FormControl(false),
          isReserved: new FormControl(false),
          trapNumber: new FormControl(1),
          greyhoundName: new FormControl('Greyhound 1'),
        }),
      ]),
    });

    fixture.detectChanges();
  });


  describe('If Condition Tests', () => {
    beforeEach(() => {
      spyOn(component, 'mapFinishedSelectionRunner').and.callThrough();
    });

    it('should correctly patch values when selectedTabName matches manualConstants.result and oddssp is true', () => {
      component.selectedTabName = component.manualConstants.result;
      component.oddssp = true;

      component.runnersArray?.controls.forEach((runner, index) => {
        component.runnersArray?.controls[index]?.patchValue({
          price_odds_sp: runner?.value?.price_odds_sp,
          result_odds_sp: runner?.value?.result_odds_sp,
          odds_sp_value: runner?.value?.isVacant
            ? ' '
            : component.oddssp
              ? component.manualConstants.sp
              : runner?.value?.result_odds_sp,
        });
      });
      component.mapFinishedSelectionRunner();

      expect(component.runnersArray.controls[0].value).toEqual({
        price_odds_sp: '10',
        result_odds_sp: '15',
        isVacant: false,
        odds_sp_value: component.manualConstants.sp,
      });
      expect(component.mapFinishedSelectionRunner).toHaveBeenCalled();
    });
  });

  it('should patch values based on selectedTabName and manualConstants', fakeAsync(() => {
    component.selectedTabName = Constants.result;
    component.oddssp = true;

    component.runnersArray?.controls.forEach((runner, index) => {
      component.runnersArray?.controls[index]?.patchValue({
        price_odds_sp: runner?.value?.price_odds_sp,
        result_odds_sp: runner?.value?.result_odds_sp,
        odds_sp_value: runner?.value?.isVacant
          ? ' '
          : component.oddssp
            ? Constants.sp
            : component.runnersArray?.controls[index]?.value?.result_odds_sp,
      });
    });

    expect(component.runnersArray?.controls[0]?.value.odds_sp_value).toBe(Constants.sp);
  }));

  it('should update oddssp to true and patch the values when currentlabel matches Constants.sp', fakeAsync(() => {
    const markAsDirtySpy = spyOn(component.runnersArray, 'markAsDirty');

    const patchValueSpy = spyOn(component.runnersArray.controls[0], 'patchValue');

    component.onChangeStartPricePayout(Constants.sp);

    fixture.detectChanges();
    tick();

    expect(component.oddssp).toBe(true);

    component.runnersArray.controls.forEach((control) => {
      expect(patchValueSpy).toHaveBeenCalledWith({
        isStartPrice: true,
        price_odds_sp: control.value.price_odds_sp,
        result_odds_sp: control.value.result_odds_sp,
        odds_sp_value: control.value.isVacant ? ' ' : Constants.sp,
      });
    });

    expect(markAsDirtySpy).toHaveBeenCalled();
  }));

  it('should create the component and initialize the form', fakeAsync(() => {
    tick();

    expect(component).toBeTruthy();
    expect(component.RacingEvent instanceof FormGroup).toBe(true);

    const runnersFormArray = component.RacingEvent.get('Runners') as FormArray;
    expect(runnersFormArray instanceof FormArray).toBe(true);

    expect(runnersFormArray.length).toBeGreaterThan(0);

    const firstRunner = runnersFormArray.at(0) as FormGroup;
    expect(firstRunner.get('isVacant')?.value).toBeFalse();
    expect(firstRunner.get('isReserved')?.value).toBeFalse();
    expect(firstRunner.get('trapNumber')?.value).toBe(1);
    expect(firstRunner.get('greyhoundName')?.value).toBe('Greyhound 1');
  }));

  it('should update `runnersArray` when selectedTabName is not "result"', () => {
    component.selectedTabName = 'someOtherTab';

    const formArray = component.runnersArray as FormArray;
    formArray.controls.forEach((control) => {
      control.patchValue({
        price_odds_sp: '20',
        result_odds_sp: '25',
        isVacant: false,
        odds_sp_value: '',
      });
    });

    component.ngOnChanges({});

    formArray.controls.forEach((control) => {
      expect(control.value.odds_sp_value).toBe('20');
    });
  });

  it('should update `runnersArray` when selectedTabName is "result" and isVacant is true', () => {
    component.selectedTabName = 'result';

    const formArray = component.runnersArray as FormArray;
    formArray.controls.forEach((control) => {
      control.patchValue({
        price_odds_sp: '20',
        result_odds_sp: '25',
        isVacant: true,
        odds_sp_value: '',
      });
    });

    component.ngOnChanges({});

    formArray.controls.forEach((control) => {
      expect(control.value.odds_sp_value).toBe(' ');
    });
  });

  it('should set the finished property of runners correctly', () => {
    component.activeRows = 3;

    const formArray = component.runnersArray as FormArray;
    formArray.clear();
    formArray.push(new FormGroup({ finished: new FormControl(null) }));
    formArray.push(new FormGroup({ finished: new FormControl(2) }));
    formArray.push(new FormGroup({ finished: new FormControl(4) }));
    formArray.push(new FormGroup({ finished: new FormControl(null) }));

    component.mapFinishedSelectionRunner();

    expect(formArray.at(0).value.finished).toBe(1);
    expect(formArray.at(1).value.finished).toBe(2);
    expect(formArray.at(2).value.finished).toBe(3);
    expect(formArray.at(3).value.finished).toBe(4);
  });

  it('should not open dialog if no duplicate trap number is found', () => {
    const formArray = component.runnersArray as FormArray;
    formArray.push(new FormGroup({
      trapNumber: new FormControl(2),
      greyhoundName: new FormControl('Greyhound 2'),
    }));

    component.checkSelectionDuplicate(1);

    expect(matDialogSpy.open).not.toHaveBeenCalled();

    expect(formArray.at(1).get('trapNumber')?.value).toBe(2);
  });

  it('should call mapFinishedSelectionRunner if selectedTabName is "result"', () => {
    const mapFinishedSelectionRunnerSpy = spyOn(component, 'mapFinishedSelectionRunner');
    component.selectedTabName = component.manualConstants.result;

    component.sortEvents({ previousIndex: 1, currentIndex: 2 });


    expect(mapFinishedSelectionRunnerSpy).toHaveBeenCalled();
  });

  it('should not call mapFinishedSelectionRunner if selectedTabName is not "result"', () => {
    const mapFinishedSelectionRunnerSpy = spyOn(component, 'mapFinishedSelectionRunner');
    component.selectedTabName = 'someOtherTab';

    component.sortEvents({ previousIndex: 1, currentIndex: 2 });


    expect(mapFinishedSelectionRunnerSpy).not.toHaveBeenCalled();
  });

  it('should call markAsDirty on runnersArray in sortEvents', () => {
    const markAsDirtySpy = spyOn(component.runnersArray, 'markAsDirty');

    component.sortEvents({ previousIndex: 1, currentIndex: 2 });


    expect(markAsDirtySpy).toHaveBeenCalled();
  });

  it('should open dialog when duplicate trap number is found', () => {
    const formArray = component.runnersArray as FormArray;
    formArray.push(new FormGroup({
      trapNumber: new FormControl(1),
      greyhoundName: new FormControl('Greyhound 1'),
    }));

    formArray.push(new FormGroup({
      trapNumber: new FormControl(1),
      greyhoundName: new FormControl('Greyhound 2'),
    }));

    component.checkSelectionDuplicate(1);

    expect(matDialogSpy.open).toHaveBeenCalledWith(DialogueComponent, jasmine.objectContaining({
      data: jasmine.objectContaining({
        message: 'Trap number already exists, Please try another.',
      }),
    }));
  });

  it('should allow only valid odds values', () => {
    const formArray = component.runnersArray as FormArray;
    formArray.push(new FormGroup({
      price_odds_sp: new FormControl('15'),
      result_odds_sp: new FormControl('20'),
    }));

    const validOdds = formArray.at(0).get('price_odds_sp')?.value;
    expect(validOdds).toBeGreaterThan(0);
    expect(validOdds).toBeLessThan(100);
  });

  it('should call payoutChange method on manualFormService when payoutChange is triggered', () => {
    const payoutChangeSpy = spyOn(component['manualFormService'], 'payoutChange');
    const index = 0;

    component.payoutChange(index);

    expect(payoutChangeSpy).toHaveBeenCalledWith(index, component.runnersArray);
  });

  it('should call payoutChangeResult method on manualFormService when payoutChangeResult is triggered', () => {
    const payoutChangeResultSpy = spyOn(component['manualFormService'], 'payoutChangeResult');
    const index = 1;

    component.payoutChangeResult(index);

    expect(payoutChangeResultSpy).toHaveBeenCalledWith(index, component.runnersArray);
  });

  it('should correctly set the totalRows and add rows based on activeCountry', () => {
    spyOn(component, 'addRow').and.callThrough();

    component.manualConstants = Constants;

    component.activeCountry = 'UK';
    component.sampleData();

    expect(component.totalRows).toBe(6);
    expect(component.addRow).toHaveBeenCalledTimes(5);

    component.activeCountry = 'AUS';
    component.sampleData();

    expect(component.totalRows).toBe(8);
    expect(component.addRow).toHaveBeenCalledTimes(12);
  });


  it('should create RacingEvent form with Runners array', () => {
    component.createRacingForm();

    expect(component.RacingEvent.contains('Runners')).toBe(true);
    expect(component.RacingEvent.get('Runners')?.value.length).toBe(1);
  });

  it('should call finishedSortArray when onFinishedChange is called', () => {
    spyOn(component['manualFormService'], 'finishedSortArray');

    component.onFinishedChange();

    expect(component['manualFormService'].finishedSortArray).toHaveBeenCalledWith(component.runnersArray);
  });

  it('should update runnersArray correctly when selectedTabName is not "result"', () => {
    component.selectedTabName = 'someOtherTab';
    const formArray = component.runnersArray as FormArray;
    formArray.controls.forEach((control) => {
      control.patchValue({
        price_odds_sp: '10',
        result_odds_sp: '15',
        isVacant: false,
        odds_sp_value: '',
      });
    });

    component.ngOnChanges({});

    formArray.controls.forEach((control) => {
      expect(control.value.odds_sp_value).toBe(control.value.price_odds_sp);
    });

    const mapFinishedSelectionRunnerSpy = spyOn(component, 'mapFinishedSelectionRunner');
    component.ngOnChanges({});
    expect(mapFinishedSelectionRunnerSpy).not.toHaveBeenCalled();
  });


  it('should toggle isVacant and update odds_sp_value correctly when onChangeReserved is called', () => {
    const index = 0;
    const initialFormArrayValue = {
      isVacant: true,
      price_odds_sp: '10',
      result_odds_sp: '20',
      odds_sp_value: ''
    };

    const formArray = component.runnersArray as FormArray;
    formArray.push(new FormGroup({
      isVacant: new FormControl(initialFormArrayValue.isVacant),
      price_odds_sp: new FormControl(initialFormArrayValue.price_odds_sp),
      result_odds_sp: new FormControl(initialFormArrayValue.result_odds_sp),
      odds_sp_value: new FormControl(initialFormArrayValue.odds_sp_value),
    }));

    component.oddssp = false;
    component.selectedTabName = component.manualConstants.showprice;

    component.onChangeReserved(null, index);
    const updatedControl = formArray.at(index);
    expect(updatedControl.get('isVacant')?.value).toBe(false);
  });

  it('should toggle isReserved, update odds_sp_value and set isFavourite to false when onChangeVacant is called', () => {
    const index = 1;
    const event = { checked: false };
    const initialFormArrayValue = {
      isReserved: true,
      price_odds_sp: '10',
      result_odds_sp: '20',
      odds_sp_value: 'SP',
      isFavourite: true,
    };

    const formArray = component.runnersArray as FormArray;
    const formGroup = new FormGroup({
      isReserved: new FormControl(initialFormArrayValue.isReserved),
      price_odds_sp: new FormControl(initialFormArrayValue.price_odds_sp),
      result_odds_sp: new FormControl(initialFormArrayValue.result_odds_sp),
      odds_sp_value: new FormControl(initialFormArrayValue.odds_sp_value),
      isFavourite: new FormControl(initialFormArrayValue.isFavourite),
    });
    formArray.push(formGroup);

    component.oddssp = false;
    component.selectedTabName = component.manualConstants.showprice;


    component.onChangeVacant(event, index);

    const updatedControl = formArray.at(index);
    const isReservedValue = updatedControl.get('isReserved')?.value;
    const isFavouriteValue = updatedControl.get('isFavourite')?.value;
    const oddsSpValue = updatedControl.get('odds_sp_value')?.value;

    expect(isReservedValue).toBe(false);
    expect(isFavouriteValue).toBe(false);
  });

  it('should call createRacingForm and sampleData when activeCountry changes', () => {
    spyOn(component, 'createRacingForm');
    spyOn(component, 'sampleData');
    component.activeCountry = 'USA';
    fixture.detectChanges();
    const changes: SimpleChanges = {
      activeCountry: {
        previousValue: 'USA',
        currentValue: 'UK',
        firstChange: false,
        isFirstChange: function (): boolean {
          throw new Error('Function not implemented.');
        }
      },
    };
    component.ngOnChanges(changes);
    expect(component.createRacingForm).toHaveBeenCalled();
    expect(component.sampleData).toHaveBeenCalled();
  });
});
