import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FightResultComponent } from './fight-result.component';

describe('FightResultComponent', () => {
  let component: FightResultComponent;
  let fixture: ComponentFixture<FightResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FightResultComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FightResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
