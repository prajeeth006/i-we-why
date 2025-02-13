import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualGreyhoundFooterComponent } from './manual-greyhound-footer.component';
import { ReactiveFormsModule, UntypedFormGroup, UntypedFormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormGroupDirective } from '@angular/forms';
import { OnlyNumber } from '../only-number.directive';  // Your custom directive, if needed

describe('ManualGreyhoundFooterComponent', () => {
  let component: ManualGreyhoundFooterComponent;
  let fixture: ComponentFixture<ManualGreyhoundFooterComponent>;
  let formGroupMock: UntypedFormGroup;

  beforeEach(async () => {
    // Mock the FormGroup with necessary controls
    formGroupMock = new UntypedFormGroup({
      multiEventForm: new UntypedFormGroup({
        eachway: new UntypedFormControl('Win'),
        run: new UntypedFormControl(''),
        distance: new UntypedFormControl(''),
        grade: new UntypedFormControl(''),
        forecast: new UntypedFormControl(''),
        tricast: new UntypedFormControl(''),
      }),
    });

    await TestBed.configureTestingModule({
      declarations: [ManualGreyhoundFooterComponent, OnlyNumber],  // Include any directives or components needed
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,  // For mat-form-field
        MatInputModule,      // For matInput
        MatSelectModule,     // For mat-select (if used in the template)
        BrowserAnimationsModule,
      ],
      providers: [
        {
          provide: FormGroupDirective,
          useValue: {
            control: formGroupMock, // Pass the mock form group
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualGreyhoundFooterComponent);
    component = fixture.componentInstance;

    // Set input values to match those used in the template
    component.formGroupName = 'multiEventForm';  // Should match the mock control
    component.selectedTabName = null;  // Or set it as needed for your test case
    component.categories = [];  // Provide mock categories if needed
    component.isSubmit = false;  // Set as needed for your test case

    fixture.detectChanges();  // Ensure the component is initialized
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
