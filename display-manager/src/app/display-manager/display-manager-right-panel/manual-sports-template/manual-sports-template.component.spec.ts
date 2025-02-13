import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { ManualSportsTemplateComponent } from './manual-sports-template.component';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { MasterConfigurationService } from '../master-layout/services/master-configuration.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { By } from '@angular/platform-browser';
import { FormGroupDirective } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OnlyNumber } from '../only-number.directive';
import { DialogueComponent } from 'src/app/common/dialogue/dialogue.component';
import { MatDialog } from '@angular/material/dialog';

describe('ManualSportsTemplateComponent', () => {
  let component: ManualSportsTemplateComponent;
  let fixture: ComponentFixture<ManualSportsTemplateComponent>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const mockMasterConfigurationService = {
      manualIconPaths$: of([
        { name: 'hamburgerIcon', path: 'path/to/hamburgerIcon' },
        { name: 'plusGreenCircle', path: 'path/to/plusGreenCircle' }
      ]),
    };

    const mockFormGroupDirective = {
      control: {
        get: jasmine.createSpy('get').and.callFake((formName: string) => {
          return formBuilder.group({
            firstOdds: null,
            firstPlayer: null,
            draw: null,
            isDraw: new FormControl(false) as FormControl<boolean>,
            secondPlayer: null,
            secondOdds: null,
            Runners: formBuilder.array([component.initRunners()]),
            manualSports: formBuilder.group({
              odds: ['', [Validators.required]],
              selectionName: [''],
            })
          });
        }),
      },
    };

    await TestBed.configureTestingModule({
      declarations: [ManualSportsTemplateComponent, OnlyNumber],
      imports: [ReactiveFormsModule, HttpClientModule, MatSlideToggleModule],
      providers: [
        FormBuilder,
        { provide: MasterConfigurationService, useValue: mockMasterConfigurationService },
        { provide: FormGroupDirective, useValue: mockFormGroupDirective },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualSportsTemplateComponent);
    component = fixture.componentInstance;
    formBuilder = TestBed.inject(FormBuilder);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should call addNewRow method when Add Row button is clicked', () => {
    const buttonElement = fixture.debugElement.query(By.css('.button-addrow'));

    spyOn(component, 'addNewRow');

    buttonElement.triggerEventHandler('click', null);

    fixture.whenStable().then(() => {
      expect(component.addNewRow).toHaveBeenCalled();
    });
  });

  it('should call deleteRow method when Delete Row button is clicked', () => {
    component.runnersArray.push(component.addRow());

    const buttonElement = fixture.debugElement.query(By.css('.close-icon'));

    spyOn(component, 'deleteRow');

    buttonElement.triggerEventHandler('click', null);

    fixture.whenStable().then(() => {
      expect(component.deleteRow).toHaveBeenCalled();
    });
  });

  it('should require valid selectionName', () => {
    const selectionNameControl = component.RacingEvent.get('manualSports.selectionName');
    selectionNameControl?.setValue('');
    expect(component.RacingEvent.valid).toEqual(false);
  });

  it('should require valid odds', () => {
    fixture.detectChanges();

    const manualSportsFormGroup = component.RacingEvent?.get('manualSports') as FormGroup;

    expect(manualSportsFormGroup).toBeTruthy('FormGroup "manualSports" should be initialized');

    const oddsControl = manualSportsFormGroup?.get('odds');
    expect(oddsControl).toBeTruthy('Form control "odds" should be available');

    oddsControl?.setValue('');
    oddsControl?.markAsTouched();

    fixture.detectChanges();

    expect(manualSportsFormGroup?.valid).toBeFalse();
  });

  it('should reset invalid odds and show error dialog in payoutChange', () => {
    const invalidOdds = '1//2';
    const mockDialog = TestBed.inject(MatDialog);
    spyOn(mockDialog, 'open');

    component.runnersArray.push(component.addRow());
    component.runnersArray.controls[0].patchValue({ odds: invalidOdds });

    component.payoutChange(0);

    const oddsControl = component.runnersArray.controls[0].get('odds');
    expect(oddsControl?.value).toBeNull();
    expect(mockDialog.open).toHaveBeenCalledWith(DialogueComponent, {
      data: { message: component.manualConstants.dialogue_error_odds_sp },
    });
  });

  it('should reset odds to null if payoutChange detects invalid input', () => {
    component.runnersArray.push(component.addRow());
    const invalidOdds = 'invalid/odds';
    const runnerIndex = 0;

    component.runnersArray.at(runnerIndex).patchValue({ odds: invalidOdds });
    component.payoutChange(runnerIndex);

    const oddsValue = component.runnersArray.at(runnerIndex).value.odds;
    expect(oddsValue).toBeNull('Odds should be reset to null for invalid input');
  });
});
