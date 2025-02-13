import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { GantryCommonModule } from '../../../../common/gantry-common.module';
import { ActivatedRouteMock } from '../../../mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../mocks/route-data-service.mock';
import { ManualOutrightComponent } from './manual-outright.component';

describe('ManualOutrightComponent', () => {
    let component: ManualOutrightComponent;
    let fixture: ComponentFixture<ManualOutrightComponent>;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);

        await TestBed.configureTestingModule({
            declarations: [ManualOutrightComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [GantryCommonModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(ManualOutrightComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
