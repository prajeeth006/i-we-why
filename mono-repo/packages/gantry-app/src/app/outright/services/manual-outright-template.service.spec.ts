import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';

import { ActivatedRouteMock } from '../../common/mocks/activated-route.mock';
import { RouteDataServiceMock } from '../../common/mocks/route-data-service.mock';
import { ManualOutrightTemplateService } from './manual-outright-template.service';

describe('ManualOutrightTemplateService', () => {
    let service: ManualOutrightTemplateService;

    beforeEach(() => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(ActivatedRouteMock);
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [RouterTestingModule],
            providers: [
                MockContext.providers,
                ManualOutrightTemplateService,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(ManualOutrightTemplateService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
