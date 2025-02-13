import { RacingHeaderComponent } from './racing-header.component';
import { FormGroupDirective } from '@angular/forms';
import { MultieventService } from '../multi-event/services/multievent.service';
import { LabelSelectorService } from 'src/app/display-manager/display-manager-header/label-selector/label-selector.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('RacingHeaderComponent', () => {
  let component: RacingHeaderComponent;
  let fixture: ComponentFixture<RacingHeaderComponent>;
  let formGroupDirectiveMock: any;
  let multieventServiceMock: any;
  let labelSelectorServiceMock: any;

  beforeEach(() => {
    // Mock the FormGroupDirective and its control
    formGroupDirectiveMock = {
      control: {
        get: jasmine.createSpy().and.returnValue({
          value: { category: { categoryCode: 'testCode' }, region: {}, competition: {}, market: {} },
          controls: {
            category: { setValue: jasmine.createSpy() },
            region: { setValue: jasmine.createSpy() },
            competition: { setValue: jasmine.createSpy() },
            market: { setValue: jasmine.createSpy() },
            date: { setValue: jasmine.createSpy() }
          }
        })
      }
    };

    // Mock other services
    multieventServiceMock = {
      loadItems: jasmine.createSpy().and.returnValue(of({ content: [] })),
      loadTemplates: jasmine.createSpy().and.returnValue(of({})),
      loadMarketTemplates: jasmine.createSpy().and.returnValue(of([]))
    };

    labelSelectorServiceMock = {
      getCurrentLabel: jasmine.createSpy().and.returnValue('testLabel')
    };

    TestBed.configureTestingModule({
      declarations: [RacingHeaderComponent],
      providers: [
        { provide: FormGroupDirective, useValue: formGroupDirectiveMock },
        { provide: MultieventService, useValue: multieventServiceMock },
        { provide: LabelSelectorService, useValue: labelSelectorServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RacingHeaderComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form on ngOnInit', () => {
    // Trigger ngOnInit
    component.ngOnInit();
    expect(formGroupDirectiveMock.control.get).toHaveBeenCalledWith(component.formGroupName);
  });
});
