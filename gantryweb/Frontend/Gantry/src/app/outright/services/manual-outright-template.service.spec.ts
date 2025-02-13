import { TestBed } from '@angular/core/testing';
import { ManualOutrightTemplateService } from './manual-outright-template.service';
import { MockContext } from 'moxxi';
import { RouteDataServiceMock } from '../../common/mocks/route-data-service.mock';
import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManualOutrightTemplateService', () => {
  let service: ManualOutrightTemplateService;

  beforeEach(() => {
    MockContext.useMock(RouteDataServiceMock);
    MockContext.useMock(ActivatedRouteMock);
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [MockContext.providers, ManualOutrightTemplateService],
      schemas: [NO_ERRORS_SCHEMA]
    });
    service = TestBed.inject(ManualOutrightTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
