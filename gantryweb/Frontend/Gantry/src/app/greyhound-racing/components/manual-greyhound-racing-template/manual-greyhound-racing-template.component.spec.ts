import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualGreyhoundRacingTemplateComponent } from './manual-greyhound-racing-template.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManualGreyhoundRacingTemplateComponent', () => {
  let component: ManualGreyhoundRacingTemplateComponent;
  let fixture: ComponentFixture<ManualGreyhoundRacingTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ ManualGreyhoundRacingTemplateComponent ],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualGreyhoundRacingTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
