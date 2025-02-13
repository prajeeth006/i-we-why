import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualOutrightComponent } from './manual-outright.component';
import { MockContext } from 'moxxi';
import { RouteDataServiceMock } from '../../../mocks/route-data-service.mock';
import { ActivatedRouteMock } from '../../../mocks/activated-route.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EventFeedUrlServiceMock } from '../../../mocks/event-feed-url-service.mock';
import {GantryCommonModule} from '../../../../common/gantry-common.module'

describe('ManualOutrightComponent', () => {
  let component: ManualOutrightComponent;
  let fixture: ComponentFixture<ManualOutrightComponent>;

  beforeEach(async () => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(EventFeedUrlServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    await TestBed.configureTestingModule({
      declarations: [ ManualOutrightComponent ],
      imports: [HttpClientTestingModule, GantryCommonModule],
      providers: [MockContext.providers],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManualOutrightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
