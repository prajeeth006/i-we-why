import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IndividualDraggableDirective } from './draggable.directive';
import { DisplayManagerRightPanelComponent } from 'src/app/display-manager/display-manager-right-panel/display-manager-right-panel.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('IndividualDraggableDirective', () => {
  let component: DisplayManagerRightPanelComponent;
  let fixture: ComponentFixture<DisplayManagerRightPanelComponent>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.configureTestingModule({
    declarations: [IndividualDraggableDirective],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
      .createComponent(DisplayManagerRightPanelComponent);
  }));

  beforeEach(() => {
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
