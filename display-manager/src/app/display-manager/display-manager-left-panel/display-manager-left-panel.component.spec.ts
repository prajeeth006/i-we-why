import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayManagerLeftPanelComponent } from './display-manager-left-panel.component';

describe('DisplayManagerLeftPanelComponent', () => {
  let component: DisplayManagerLeftPanelComponent;
  let fixture: ComponentFixture<DisplayManagerLeftPanelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayManagerLeftPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayManagerLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
