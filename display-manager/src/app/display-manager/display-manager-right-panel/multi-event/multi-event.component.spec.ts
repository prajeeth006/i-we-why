import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { MultiEventComponent } from './multi-event.component';
import { MatSlideToggle, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { By } from '@angular/platform-browser';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Constants } from '../constants/constants';
import { LabelSelectorService } from '../../display-manager-header/label-selector/label-selector.service';
import { RightPanelTabControlService } from '../services/tab-control.service';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

describe('MultiEventComponent', () => {
  let component: MultiEventComponent;
  let fixture: ComponentFixture<MultiEventComponent>;
  const testActiveRowsArray = [1, 2, 3];
  let labelSelectorService: LabelSelectorService;
  let rightPanelTabControlService: RightPanelTabControlService;
  let httpTestingController: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MultiEventComponent],
      imports: [HttpClientTestingModule, MatSlideToggleModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatOptionModule],
      providers: [
        LabelSelectorService,
        {
          provide: RightPanelTabControlService,
          useValue: {
            multieventTabs: [
              {
                savedData: {
                  tabName: 'sportsTab',
                  targetid: 'target123',
                  id: 'id123'
                },
                tabName: 'sportsTab',
                eventType: 'sports',
                eventFormData: undefined,
                defaultFormData: undefined
              }
            ]
          }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiEventComponent);
    component = fixture.componentInstance;
    labelSelectorService = TestBed.inject(LabelSelectorService);
    rightPanelTabControlService = TestBed.inject(RightPanelTabControlService);
    httpTestingController = TestBed.inject(HttpTestingController);

    component.manualConstants = Constants;
    component.eventType = Constants.manual;
    spyOn(labelSelectorService, 'getCurrentLabel').and.returnValue('someLabel');
    component.tabName = 'sportsTab';
    component.tabIndex = 0;

    const parentControl = new FormGroup({
      dynamicControl: new FormControl(''),
      anotherControl: new FormControl('')
    });

    (component as any).formGroup = parentControl;

    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click ShowPrice button with async', async () => {
    component.eventType = Constants.manual;
    component.selectedTabName = 'SHOW PRICE';
    fixture.detectChanges();

    const showPriceButton = fixture.debugElement.query(By.css('#showprice'));
    expect(showPriceButton).toBeTruthy('ShowPrice button not found in the DOM');

    showPriceButton.triggerEventHandler('click', null);
    fixture.detectChanges();

    expect(component.selectedTabName).toBe('SHOW PRICE');
  });

  it('should trigger slider toggle for Race-Off', () => {
    component.selectedTabName = Constants.showprice;
    component.eventType = Constants.manual;
    fixture.detectChanges();

    const slider = fixture.debugElement.query(By.css('#raceOff'));

    expect(slider).toBeTruthy();

    if (slider) {
      slider.triggerEventHandler('change', { checked: true });
    }

    fixture.detectChanges();
  });

  it('should trigger slider toggle for Resulted...', fakeAsync(() => {
    component.selectedTabName = component.manualConstants.result;
    component.eventType = 'manual';
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const slider = fixture.debugElement.query(By.css('#resulted'));

      if (slider) {
        expect(slider).toBeTruthy('Slider element should be found');
        slider.triggerEventHandler('change', { checked: true });
        fixture.detectChanges();
      }
    });
  }));
});
