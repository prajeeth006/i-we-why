import { DatePipe } from '@angular/common';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { DisplayManagerRightPanelComponent } from './display-manager-right-panel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DisplayManagerTabsComponent } from './display-manager-tabs/display-manager-tabs.component';

describe('DisplayManagerRightPanelComponent', () => {
  let component: DisplayManagerRightPanelComponent;
  let fixture: ComponentFixture<DisplayManagerRightPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ DisplayManagerRightPanelComponent, DisplayManagerTabsComponent ],
      providers: [ DatePipe ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayManagerRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show current date', waitForAsync(() => {
    let datePipe = TestBed.inject(DatePipe);  // Use TestBed to inject DatePipe
    let expectedDate = `Today, ${datePipe.transform(new Date(), 'fullDate')}`;

    // Wait for the fixture to stabilize, ensuring all async operations are complete
    fixture.whenStable().then(() => {
      // Query the element where the date is rendered (adjust the selector if necessary)
      let dateElement: HTMLElement = fixture.nativeElement.querySelector('.current-date');
      if (dateElement) {
        expect(dateElement.innerHTML.trim()).toBe(expectedDate);
      }
    });
  }));
});
