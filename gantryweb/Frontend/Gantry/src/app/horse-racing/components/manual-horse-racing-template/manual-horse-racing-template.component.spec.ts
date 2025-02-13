import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualHorseRacingTemplateComponent } from './manual-horse-racing-template.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';

describe('ManualHorseRacingTemplateComponent', () => {
  let component: ManualHorseRacingTemplateComponent;
  let fixture: ComponentFixture<ManualHorseRacingTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ ManualHorseRacingTemplateComponent ],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualHorseRacingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
