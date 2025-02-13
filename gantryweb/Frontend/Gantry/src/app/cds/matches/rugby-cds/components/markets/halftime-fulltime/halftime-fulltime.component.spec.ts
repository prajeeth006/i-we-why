import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalftimeFulltimeComponent } from './halftime-fulltime.component';

describe('HalftimeFulltimeComponent', () => {
  let component: HalftimeFulltimeComponent;
  let fixture: ComponentFixture<HalftimeFulltimeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HalftimeFulltimeComponent]
    });
    fixture = TestBed.createComponent(HalftimeFulltimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
