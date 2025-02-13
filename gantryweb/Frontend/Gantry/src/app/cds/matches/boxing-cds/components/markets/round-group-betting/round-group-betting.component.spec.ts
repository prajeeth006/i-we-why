import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoundGroupBettingComponent } from './round-group-betting.component';

describe('RoundGroupBettingComponent', () => {
  let component: RoundGroupBettingComponent;
  let fixture: ComponentFixture<RoundGroupBettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoundGroupBettingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoundGroupBettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
