import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchresultBothteamstoscoreComponent } from './matchresult-bothteamstoscore.component';

describe('MatchresultBothteamstoscoreComponent', () => {
  let component: MatchresultBothteamstoscoreComponent;
  let fixture: ComponentFixture<MatchresultBothteamstoscoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchresultBothteamstoscoreComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MatchresultBothteamstoscoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
