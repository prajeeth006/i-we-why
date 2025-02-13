import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToscoreInfirststInnsComponent } from './toscore-infirstst-inns.component';

describe('ToscoreInfirststInnsComponent', () => {
  let component: ToscoreInfirststInnsComponent;
  let fixture: ComponentFixture<ToscoreInfirststInnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToscoreInfirststInnsComponent ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToscoreInfirststInnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
