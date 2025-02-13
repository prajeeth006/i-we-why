import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HalftimeFulltimeComponent } from './halftime-fulltime.component';

describe('HalftimeFulltimeComponent', () => {
  let component: HalftimeFulltimeComponent;
  let fixture: ComponentFixture<HalftimeFulltimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HalftimeFulltimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HalftimeFulltimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
