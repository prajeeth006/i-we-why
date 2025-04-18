import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BothteamstoScoreComponent } from './bothteamsto-score.component';

describe('BothteamstoScoreComponent', () => {
  let component: BothteamstoScoreComponent;
  let fixture: ComponentFixture<BothteamstoScoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BothteamstoScoreComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BothteamstoScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
