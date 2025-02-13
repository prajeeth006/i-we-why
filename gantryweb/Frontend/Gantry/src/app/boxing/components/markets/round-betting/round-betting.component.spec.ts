import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundBettingComponent } from './round-betting.component';

describe('RoundBettingComponent', () => {
  let component: RoundBettingComponent;
  let fixture: ComponentFixture<RoundBettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundBettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoundBettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
