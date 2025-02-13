import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { GantryCommonModule } from '../../../../common/gantry-common.module';
import { MockManualOutrightData } from '../../../../outright/mocks/mock-manual-outright.data';
import { ActivatedRouteMock } from '../../../mocks/activated-route.mock';
import { EventFeedUrlServiceMock } from '../../../mocks/event-feed-url-service.mock';
import { RouteDataServiceMock } from '../../../mocks/route-data-service.mock';
import { DarkThemeManualOutrightComponent } from './dark-theme-manual-outright.component';

describe('DarkThemeManualOutrightComponent', () => {
    let component: DarkThemeManualOutrightComponent;
    let fixture: ComponentFixture<DarkThemeManualOutrightComponent>;
    let outrightManualMockdata: MockManualOutrightData;

    beforeEach(async () => {
        MockContext.useMock(RouteDataServiceMock);
        MockContext.useMock(EventFeedUrlServiceMock);
        MockContext.useMock(ActivatedRouteMock);

        await TestBed.configureTestingModule({
            declarations: [DarkThemeManualOutrightComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [GantryCommonModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        }).compileComponents();

        fixture = TestBed.createComponent(DarkThemeManualOutrightComponent);
        outrightManualMockdata = new MockManualOutrightData();
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('create manual outright for less number of runners less than or Equal to 6', () => {
        const result = component.checkSelectionsLength(outrightManualMockdata.darkThemeManualSmallCount);
        if (result) {
            expect(result).toBe('manual-outright-small-content');
        }
    });

    it('create manual outright for medium number of runners less than or Equal to 8 and greater than 6', () => {
        const result = component.checkSelectionsLength(outrightManualMockdata.darkThemeManualMediumCount);
        if (result) {
            expect(result).toBe('manual-outright-medium-content');
        }
    });

    it('create manual outright for more number of runners less than or Equal to 12 and greater than 8', () => {
        const result = component.checkSelectionsLength(outrightManualMockdata.darkThemeManualLargeCount);
        if (result) {
            expect(result).toBe('manual-outright-large-content common-ouright-wrapper');
        }
    });
    it('create manual outright for more number of runners less than or Equal to 16 and greater than 12', () => {
        const result = component.checkSelectionsLength(outrightManualMockdata.darkThemeManualExtraLargeCount);
        if (result) {
            expect(result).toBe('manual-outright-extralarge-content common-ouright-wrapper');
        }
    });
    it('create manual outright for more number of runners greater than 16', () => {
        const result = component.checkSelectionsLength(outrightManualMockdata.darkThemeManualPaginationCount);
        if (result) {
            expect(result).toBe('manual-outright-pagination-content common-ouright-wrapper');
        }
    });
});
