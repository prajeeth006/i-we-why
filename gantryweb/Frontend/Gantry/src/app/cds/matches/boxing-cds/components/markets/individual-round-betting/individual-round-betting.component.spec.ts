import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualRoundBettingComponent } from './individual-round-betting.component';

describe('IndividualRoundBettingComponent', () => {
  let component: IndividualRoundBettingComponent;
  let fixture: ComponentFixture<IndividualRoundBettingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IndividualRoundBettingComponent]
    });
    fixture = TestBed.createComponent(IndividualRoundBettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
