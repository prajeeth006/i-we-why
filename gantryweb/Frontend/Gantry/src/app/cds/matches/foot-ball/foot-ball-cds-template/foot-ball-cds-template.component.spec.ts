import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FootBallCdsTemplateComponent } from './foot-ball-cds-template.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockContext } from 'moxxi';
import { SportEventDateFormatPipe } from '../../../../common/pipes/sport-event-datetime-format.pipe';

describe('FootBallCdsTemplateComponent', () => {
  let component: FootBallCdsTemplateComponent;
  let fixture: ComponentFixture<FootBallCdsTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [FootBallCdsTemplateComponent, SportEventDateFormatPipe],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(FootBallCdsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
