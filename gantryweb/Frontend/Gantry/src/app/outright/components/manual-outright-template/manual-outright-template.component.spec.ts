import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualOutrightTemplateComponent } from './manual-outright-template.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockContext } from 'moxxi';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManualOutrightTemplateComponent', () => {
  let component: ManualOutrightTemplateComponent;
  let fixture: ComponentFixture<ManualOutrightTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ ManualOutrightTemplateComponent ],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualOutrightTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
