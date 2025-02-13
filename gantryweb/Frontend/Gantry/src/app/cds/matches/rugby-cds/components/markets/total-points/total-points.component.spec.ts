import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPointsComponent } from './total-points.component';

describe('TotalPointsComponent', () => {
  let component: TotalPointsComponent;
  let fixture: ComponentFixture<TotalPointsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalPointsComponent]
    });
    fixture = TestBed.createComponent(TotalPointsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
