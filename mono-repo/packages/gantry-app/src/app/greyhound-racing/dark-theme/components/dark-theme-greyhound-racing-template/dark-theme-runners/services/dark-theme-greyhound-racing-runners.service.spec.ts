import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { GantryMock } from '../../../../../../common/mocks/gantrymarkets.mock';
import { MockGreyhoundRacingRunnersData } from '../../../../../../greyhound-racing/components/greyhound-racing-template/mocks/mock-greyhound-racing-runners-data';
import { MockGreyhoundStaticContent } from '../../../../../../greyhound-racing/components/greyhound-racing-template/mocks/mock-greyhound-static-content';
import { DarkThemeGreyhoundRacingRunnersService } from './dark-theme-greyhound-racing-runners.service';

describe('DarkThemeGreyhoundRacingRunnersService', () => {
    let service: DarkThemeGreyhoundRacingRunnersService;
    let mockGreyhoundRacingRunnersData: MockGreyhoundRacingRunnersData;
    let mockGreyhoundStaticContent: MockGreyhoundStaticContent;
    let gantryMockData: GantryMock;
    let activatedRouteStub: Partial<ActivatedRoute>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                { provide: ActivatedRoute, useValue: activatedRouteStub },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(DarkThemeGreyhoundRacingRunnersService);
        mockGreyhoundRacingRunnersData = new MockGreyhoundRacingRunnersData();
        mockGreyhoundStaticContent = new MockGreyhoundStaticContent();
        gantryMockData = new GantryMock();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('when createGreyhoundRacingRunnersResult called, should get isEventPGRTrackget as true if flags has "RD" ', () => {
        const greyhundRacingRunnersResult = service.createGreyhoundRacingRunnersResult(
            mockGreyhoundRacingRunnersData.sportBookResult,
            mockGreyhoundRacingRunnersData.racingGreyhoundContent,
            mockGreyhoundStaticContent.greyhoundRacingContent,
            'Uk',
            gantryMockData.Data,
        );
        expect(greyhundRacingRunnersResult.isEventPGRTrack).toBe(true);
    });
});
