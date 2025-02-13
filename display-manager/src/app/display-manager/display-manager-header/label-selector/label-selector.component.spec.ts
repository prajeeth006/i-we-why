import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LabelSelectorComponent } from './label-selector.component';
import { LabelSelectorService } from './label-selector.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('LabelSelectorComponent', () => {
  let component: LabelSelectorComponent;
  let fixture: ComponentFixture<LabelSelectorComponent>;
  let labelSelectorService: LabelSelectorService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [LabelSelectorComponent],
    imports: [],
    providers: [LabelSelectorService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelSelectorComponent);
    labelSelectorService = TestBed.inject(LabelSelectorService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display mat-option elements for each label', () => {
    labelSelectorService.labels$.next(['coral', 'ladbrokes']);
    fixture.detectChanges();
    let optionElements: HTMLElement[] = fixture.nativeElement.querySelector('mat-select').children;
    expect(optionElements.length).toBe(2);
  });

  it('should add label-background-colour class to selected option', () => {
    labelSelectorService.labels$.next(['coral', 'ladbrokes']);
    labelSelectorService.labelCssClass = 'coral-background-colour';
    component.selectedVal = 'coral';
    component.ngOnInit();
    fixture.detectChanges();
    let optionElements: HTMLElement[] = fixture.nativeElement.querySelector('mat-select').children;
    expect(optionElements[0]).toHaveClass('coral-background-colour');
  });

  it('should not add label-background-colour class to un selected options', () => {
    labelSelectorService.labels$.next(['coral', 'ladbrokes']);
    labelSelectorService.labelCssClass = 'coral-background-colour';
    component.selectedVal = 'coral';
    component.ngOnInit();
    fixture.detectChanges();
    let optionElements: HTMLElement[] = fixture.nativeElement.querySelector('mat-select').children;
    expect(optionElements[1]).not.toHaveClass('coral-background-colour');
  });
});
