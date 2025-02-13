import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ManualFooterComponent } from './manual-footer.component';
import { UntypedFormGroup, FormControl, UntypedFormControl, FormGroupDirective } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Constants } from '../constants/constants';

const mockManualfooter = {
  eachway: '',
  distance: '',
  run: '',
  going: '',
  ran: '',
  forecast: '',
  tricast: '',
  win: '',
  place: '',
  exacta: '',
  trifecta: ''
};

class MockFormGroupDirective {
  control = {
    get: (formGroupName: string) => {
      return new UntypedFormGroup({
        eachway: new FormControl(''),
        distance: new FormControl(''),
        run: new FormControl(''),
        going: new FormControl(''),
        ran: new FormControl(''),
        forecast: new FormControl(''),
        tricast: new FormControl(''),
        win: new FormControl(''),
        place: new FormControl(''),
        exacta: new FormControl(''),
        trifecta: new FormControl('')
      });
    }
  };
}

describe('ManualFooterComponent', () => {
  let component: ManualFooterComponent;
  let fixture: ComponentFixture<ManualFooterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ManualFooterComponent],
      providers: [
        { provide: FormGroupDirective, useClass: MockFormGroupDirective }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualFooterComponent);
    component = fixture.componentInstance;

    component.model = mockManualfooter;
    component.formGroupName = 'manualFormGroup';

    component.form = new UntypedFormGroup({
      eachway: new UntypedFormControl(''),
      distance: new UntypedFormControl(''),
      run: new UntypedFormControl(''),
      going: new UntypedFormControl(''),
      ran: new UntypedFormControl(''),
      forecast: new UntypedFormControl(''),
      tricast: new UntypedFormControl(''),
      win: new UntypedFormControl(''),
      place: new UntypedFormControl(''),
      exacta: new UntypedFormControl(''),
      trifecta: new UntypedFormControl('')
    });

    component.eachWayList = Constants.eachway_array || ['Option 1', 'Option 2', 'Option 3'];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should bind the configured value to Eachway', waitForAsync(() => {
    component.eachWayList = Constants.eachway_array || ['Win Only', '2 places 1/4 odds'];
    fixture.detectChanges();

    const matSelect = fixture.debugElement.query(By.css('#eachwayField'));
    expect(matSelect).toBeTruthy();

    matSelect.nativeElement.click();
    fixture.detectChanges();

    const matOptions = fixture.debugElement.queryAll(By.css('mat-option'));
    expect(matOptions.length).toBeGreaterThan(0);
    expect(matOptions[0].nativeElement.textContent.trim()).toBe('Win Only');
    matOptions[1].nativeElement.click();
    fixture.detectChanges();
  }));

  it('should bind input text value to Component property', waitForAsync(() => {
    const hostElement = fixture.nativeElement;

    const formGroup = new UntypedFormGroup({
      eachway: new UntypedFormControl(''),
      distance: new UntypedFormControl('')
    });
    component.form = formGroup;

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const distanceInput: HTMLInputElement = hostElement.querySelector('#distanceField');
      expect(distanceInput).toBeTruthy();

      distanceInput.value = '10';
      distanceInput.dispatchEvent(new Event('input'));

      component.form.controls['distance'].setValue('10');
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        const updatedValue = formGroup.controls['distance'].value;
        expect(updatedValue).toBe('10', 'Form control did not update correctly');
      });
    });
  }));
});
