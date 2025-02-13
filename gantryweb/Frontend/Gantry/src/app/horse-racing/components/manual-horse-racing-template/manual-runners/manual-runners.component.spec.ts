import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualRunnersComponent } from './manual-runners.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ManualHorseRacingTemplateService } from '../services/manual-horse-racing-template.service';

describe('ManualRunnersComponent', () => {
  let component: ManualRunnersComponent;
  let fixture: ComponentFixture<ManualRunnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ ManualRunnersComponent ],
      providers: [MockContext.providers, ManualHorseRacingTemplateService],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualRunnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
