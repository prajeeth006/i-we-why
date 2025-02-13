import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ManualHeaderComponent } from './manual-header.component';
import { UntypedFormControl, ReactiveFormsModule, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';  // Import MatSelectModule
import { MatFormFieldModule } from '@angular/material/form-field';  // Import MatFormFieldModule
import { MatInputModule } from '@angular/material/input';  // Import MatInputModule
import { MatOptionModule } from '@angular/material/core';  // Import MatOptionModule
import { By } from '@angular/platform-browser';
import { OnlyNumber } from '../only-number.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { HttpClientModule } from '@angular/common/http';

describe('ManualHeaderComponent', () => {
  let component: ManualHeaderComponent;
  let fixture: ComponentFixture<ManualHeaderComponent>;

  let categoriesTestData = [{ 'name': 'HORSE_RACING' }, { 'name': 'GREYHOUNDS' }];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatSelectModule,
        MatFormFieldModule,  // Add MatFormFieldModule
        MatInputModule,  // Add MatInputModule
        MatOptionModule,
        BrowserAnimationsModule,
        HttpClientModule
      ],
      declarations: [ManualHeaderComponent, OnlyNumber],  // Declare OnlyNumber directive here
      providers: [FormGroupDirective]  // Provide FormGroupDirective
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualHeaderComponent);
    component = fixture.componentInstance;

    // Initialize the form with category control
    component.form = new FormGroup({
      category: new UntypedFormControl(categoriesTestData[0]),  // Set default category
      timehrs: new UntypedFormControl(''),
      timemins: new UntypedFormControl(''),
      meetingName: new UntypedFormControl(''),
      race: new UntypedFormControl('')
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should bind input text value to Component property', () => {
    const hostElement = fixture.nativeElement;
    const hoursInput: HTMLInputElement = hostElement.querySelector('#hrs');
    const minsInput: HTMLInputElement = hostElement.querySelector('#mins');
    const meetingNameInput: HTMLInputElement = hostElement.querySelector('#meetingName');
    const raceInput: HTMLInputElement = hostElement.querySelector('#race');
    fixture.detectChanges();

    // Simulate user input in the form fields
    hoursInput.value = '10';
    minsInput.value = '20';
    meetingNameInput.value = 'Test Meeting';
    raceInput.value = '1';

    hoursInput.dispatchEvent(new Event('input'));
    minsInput.dispatchEvent(new Event('input'));
    meetingNameInput.dispatchEvent(new Event('input'));
    raceInput.dispatchEvent(new Event('input'));

    // Check if the form controls are updated
    expect(component.form.controls.timehrs.value).toBe('10');
    expect(component.form.controls.timemins.value).toBe('20');
    expect(component.form.controls.meetingName.value).toBe('Test Meeting');
    expect(component.form.controls.race.value).toBe('1');
  });
});
