import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualResultComponent } from './manual-result.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ManualHorseRacingTemplateService } from '../services/manual-horse-racing-template.service';

describe('ManualResultComponent', () => {
  let component: ManualResultComponent;
  let fixture: ComponentFixture<ManualResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ ManualResultComponent ],
      providers: [MockContext.providers, ManualHorseRacingTemplateService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
