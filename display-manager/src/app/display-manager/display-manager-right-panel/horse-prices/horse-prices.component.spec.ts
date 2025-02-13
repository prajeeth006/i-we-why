import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing';
import { HorsePricesComponent } from './horse-prices.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormControl, FormGroup, FormArray, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ApiService } from 'src/app/common/api.service';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';
import { OnlyNumber } from '../only-number.directive';
import { ChangeDetectorRef, forwardRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { Constants } from '../constants/constants';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { ManualFormService } from '../services/manualFormService/manual-form.service';

describe('HorsePricesComponent', () => {
  let component: HorsePricesComponent;
  let fixture: ComponentFixture<HorsePricesComponent>;
  let matDialog: jasmine.SpyObj<MatDialog>;
  let masterConfigService: jasmine.SpyObj<MasterConfigurationService>;
  let manualFormServiceMock: jasmine.SpyObj<ManualFormService>;

  beforeEach(fakeAsync(() => {
    matDialog = jasmine.createSpyObj('MatDialog', ['open']);
    manualFormServiceMock = jasmine.createSpyObj('ManualFormService', ['payoutChange']);
    masterConfigService = jasmine.createSpyObj('MasterConfigurationService', [], {
      manualIconPaths$: new BehaviorSubject<any[]>([
        { name: 'hamburgerIcon', path: '/assets/icons/hamburger.svg' },
        { name: 'plusGreenCircle', path: '/assets/icons/plus-green-circle.svg' },
        { name: 'resetIcon', path: '/assets/icons/reset-icon.svg' },
        { name: 'VectorIcon', path: '/assets/icons/vector-icon.svg' }
      ])
    });

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatSlideToggleModule
      ],
      declarations: [HorsePricesComponent, OnlyNumber],
      providers: [
        ApiService,
        { provide: MasterConfigurationService, useValue: masterConfigService },
        { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HorsePricesComponent), multi: true },
        { provide: MatDialog, useValue: matDialog }
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HorsePricesComponent);
    component = fixture.componentInstance;
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should assign correct paths to icon properties from manualIconPaths$', () => {
    masterConfigService.manualIconPaths$.next([
      { name: 'hamburgerIcon', path: '/assets/icons/hamburger.svg' },
      { name: 'plusGreenCircle', path: '/assets/icons/plus-green-circle.svg' },
      { name: 'resetIcon', path: '/assets/icons/reset-icon.svg' },
      { name: 'VectorIcon', path: '/assets/icons/vector-icon.svg' }
    ]);

    fixture.detectChanges();

    expect(component.hamburgerPath).toBe('/assets/icons/hamburger.svg');
    expect(component.addIconPath).toBe('/assets/icons/plus-green-circle.svg');
    expect(component.resetIconPath).toBe('/assets/icons/reset-icon.svg');
    expect(component.vectorIconPath).toBe('/assets/icons/vector-icon.svg');
  });

  it('should click Add Row with async', waitForAsync(() => {
    component.selectedTabName = Constants.showprice;
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const buttonElement = fixture.debugElement.query(By.css('.button-addrow'));

      expect(buttonElement).toBeTruthy('Button element not found');

      spyOn(component, 'addNewRow').and.callThrough();

      buttonElement.triggerEventHandler('click', null);

      const changeDetector = fixture.debugElement.injector.get(ChangeDetectorRef);
      changeDetector.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.addNewRow).toHaveBeenCalled();
      });
    });
  }));

  it('should click Delete Row with async', waitForAsync(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const buttonElement = fixture.debugElement.query(By.css('.close-icon'));
      expect(buttonElement).toBeTruthy();

      if (buttonElement) {
        spyOn(component, 'deleteRow').and.callThrough();

        buttonElement.triggerEventHandler('click', null);

        const changeDetector = fixture.debugElement.injector.get(ChangeDetectorRef);
        changeDetector.detectChanges();

        fixture.whenStable().then(() => {
          expect(component.deleteRow).toHaveBeenCalled();
        });
      } else {
        fail('Button element not found');
      }
    });
  }));

  it('should click Start Price with async', waitForAsync(() => {
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const buttonElement = fixture.debugElement.query(By.css('.button-sp'));
      expect(buttonElement).toBeTruthy();

      if (buttonElement) {
        spyOn(component, 'onChangeStartPricePayout').and.callThrough();

        buttonElement.triggerEventHandler('click', component.manualConstants.sp);

        const changeDetector = fixture.debugElement.injector.get(ChangeDetectorRef);
        changeDetector.detectChanges();

        fixture.whenStable().then(() => {
          expect(component.onChangeStartPricePayout).toHaveBeenCalled();
        });
      } else {
        fail('Button element not found');
      }
    });
  }));

  it('should correctly map finished selection runner values', () => {
    component.runnersArray.clear();
    component.runnersArray.push(new FormGroup({ finished: new FormControl(null) }));
    component.runnersArray.push(new FormGroup({ finished: new FormControl(2) }));
    component.runnersArray.push(new FormGroup({ finished: new FormControl(3) }));

    component.activeRows = 2;

    component.mapFinishedSelectionRunner();

    expect(component.runnersArray.at(0).value.finished).toEqual(1);
    expect(component.runnersArray.at(1).value.finished).toEqual(2);
    expect(component.runnersArray.at(2).value.finished).toEqual(3);
  });

  it('should call finishedSortArray on manualFormService', () => {
    const manualFormService = (component as any).manualFormService;
    spyOn(manualFormService, 'finishedSortArray');

    component.onFinishedChange();

    expect(manualFormService.finishedSortArray).toHaveBeenCalledWith(component.runnersArray);
  });

  it('should sort events and trigger appropriate methods', () => {
    const eventMock = { previousIndex: 2, currentIndex: 4 };
    const mapFinishedSelectionRunnerSpy = spyOn(component, 'mapFinishedSelectionRunner').and.callThrough();
    const sortArraySpy = spyOn(component, 'sortArray').and.callThrough();
    const markAsDirtySpy = spyOn(component.runnersArray, 'markAsDirty').and.callThrough();

    component.runnersArray.push(new FormGroup({ finished: new FormControl(1) }));
    component.runnersArray.push(new FormGroup({ finished: new FormControl(2) }));
    component.runnersArray.push(new FormGroup({ finished: new FormControl(3) }));

    component.selectedTabName = component.manualConstants.result;

    const initialOrder = component.runnersArray.controls.map(control => control.value.finished);

    component.sortEvents(eventMock);

    const updatedOrder = component.runnersArray.controls.map(control => control.value.finished);

    expect(updatedOrder).not.toEqual(initialOrder);
    expect(mapFinishedSelectionRunnerSpy).toHaveBeenCalled();
    expect(sortArraySpy).toHaveBeenCalled();
    expect(markAsDirtySpy).toHaveBeenCalled();
  });

  it('should handle duplicate selection and open a dialog', () => {
    const formArray = component.runnersArray;

    formArray.push(new FormGroup({ horseNumber: new FormControl(1) }));
    formArray.push(new FormGroup({ horseNumber: new FormControl(1) }));
    const selectionIndex = 1;

    component.checkSelectionDuplicate(selectionIndex);

    expect(matDialog.open).toHaveBeenCalledWith(DialogueComponent, {
      data: { message: component.manualConstants.dialogue_duplicate_selection_number },
    });

    expect(formArray.at(selectionIndex).value.horseNumber).toBeNull();
  });

  it('should call ngOnChanges and patch values correctly', fakeAsync(() => {
    const firstRunner = new FormGroup({
      price_odds_sp: new FormControl(10),
      result_odds_sp: new FormControl(15),
      isNonRunner: new FormControl(false),
    });

    const secondRunner = new FormGroup({
      price_odds_sp: new FormControl(20),
      result_odds_sp: new FormControl(25),
      isNonRunner: new FormControl(true),
    });

    component.runnersArray.clear();

    component.runnersArray.push(firstRunner);
    component.runnersArray.push(secondRunner);

    component.manualConstants = Constants;

    component.selectedTabName = component.manualConstants.result;

    spyOn(component, 'mapFinishedSelectionRunner');

    component.ngOnChanges();

    expect(component.mapFinishedSelectionRunner).toHaveBeenCalled();
  }));
});
