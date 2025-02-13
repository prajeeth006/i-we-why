import { provideHttpClientTesting } from '@angular/common/http/testing';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressService } from '../common/progress-service/progress.service';
import { LabelSelectorService } from '../display-manager/display-manager-header/label-selector/label-selector.service';
import { of } from 'rxjs'; // Import RxJS operators

import { DisplayManagerComponent } from './display-manager.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


class MockLabelSelectorService {
  labelCssClass: string = '';
}

class MockProgressService {
  progress = of(true);
  showProgress: boolean = false;
}

describe('DisplayManagerComponent', () => {
  let component: DisplayManagerComponent;
  let fixture: ComponentFixture<DisplayManagerComponent>;
  let labelSelectorService: LabelSelectorService;
  let progressService: ProgressService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DisplayManagerComponent],
      imports: [],
      providers: [
        { provide: LabelSelectorService, useClass: MockLabelSelectorService },
        { provide: ProgressService, useClass: MockProgressService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    labelSelectorService = TestBed.inject(LabelSelectorService);
    progressService = TestBed.inject(ProgressService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add label background colour class to display-manager-header component', () => {
    labelSelectorService.labelCssClass = 'coral-background-colour';
    fixture.detectChanges();
    let displayManagerHeaderEl: HTMLElement = fixture.nativeElement.querySelector('display-manager-header');
    expect(displayManagerHeaderEl).toHaveClass('coral-background-colour');

    labelSelectorService.labelCssClass = 'ladbrokes-background-colour';
    fixture.detectChanges();
    expect(displayManagerHeaderEl).toHaveClass('ladbrokes-background-colour');
  });
});
