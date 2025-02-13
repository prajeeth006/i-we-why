import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManualResultsComponent } from './manual-results.component'
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ManualGreyhoundRacingTemplateService } from './../services/manual-greyhound-racing-template.service';

describe('ManualResultsComponent', () => {
  let component: ManualResultsComponent;
  let fixture: ComponentFixture<ManualResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({

      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ManualResultsComponent],
      providers: [MockContext.providers, ManualGreyhoundRacingTemplateService],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
