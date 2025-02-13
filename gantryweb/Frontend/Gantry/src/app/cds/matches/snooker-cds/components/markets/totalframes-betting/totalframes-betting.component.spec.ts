import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalframesBettingComponent } from './totalframes-betting.component';

describe('TotalframesBettingComponent', () => {
  let component: TotalframesBettingComponent;
  let fixture: ComponentFixture<TotalframesBettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TotalframesBettingComponent]
    });
    fixture = TestBed.createComponent(TotalframesBettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
