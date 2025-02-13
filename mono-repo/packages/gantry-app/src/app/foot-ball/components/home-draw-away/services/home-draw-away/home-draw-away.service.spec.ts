import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HomeDrawAway, HomeDrawAwaySelection } from '../../models/home-draw-away.model';
import { HomeDrawAwayService } from './home-draw-away.service';

describe('HomeDrawAwayService', () => {
    let service: HomeDrawAwayService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(HomeDrawAwayService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('HomeDrawAway with one Selection', () => {
        const homeDrawAway: HomeDrawAway[] = [
            {
                eventName: '',
                eventDateTime: new Date('2022-12-29T15:00:00Z'),
                eventTime: '',
                homeSelection: new HomeDrawAwaySelection(),
                drawSelection: new HomeDrawAwaySelection(),
                awaySelection: new HomeDrawAwaySelection(),
            },
        ];
        const eventTimeInfo: string = '{0}';

        const getEventTimeDateFromPipe = service.getEventTimeDateFromPipe(homeDrawAway, eventTimeInfo, null);
        expect(getEventTimeDateFromPipe).toBe('THURSDAY 29 DECEMBER');
    });

    it('HomeDrawAway with Multiple Selection with different EventDateTimes', () => {
        const homeDrawAway: HomeDrawAway[] = [
            {
                eventName: '',
                eventDateTime: new Date('2022-12-29T15:00:00Z'),
                eventTime: '',
                homeSelection: new HomeDrawAwaySelection(),
                drawSelection: new HomeDrawAwaySelection(),
                awaySelection: new HomeDrawAwaySelection(),
            },
            {
                eventName: '',
                eventDateTime: new Date('2022-12-30T15:00:00Z'),
                eventTime: '',
                homeSelection: new HomeDrawAwaySelection(),
                drawSelection: new HomeDrawAwaySelection(),
                awaySelection: new HomeDrawAwaySelection(),
            },
        ];
        const eventTimeInfo: string = '{0}';

        const getEventTimeDateFromPipe = service.getEventTimeDateFromPipe(homeDrawAway, eventTimeInfo, null);
        expect(getEventTimeDateFromPipe).toBe('THURSDAY 29 DECEMBER - FRIDAY 30 DECEMBER');
    });

    it('HomeDrawAway with Multiple Selection with same Event Date Time for different year/month', () => {
        const homeDrawAway: HomeDrawAway[] = [
            {
                eventName: '',
                eventDateTime: new Date('2022-12-29T15:00:00Z'),
                eventTime: '',
                homeSelection: new HomeDrawAwaySelection(),
                drawSelection: new HomeDrawAwaySelection(),
                awaySelection: new HomeDrawAwaySelection(),
            },
            {
                eventName: '',
                eventDateTime: new Date('2022-11-29T15:00:00Z'),
                eventTime: '',
                homeSelection: new HomeDrawAwaySelection(),
                drawSelection: new HomeDrawAwaySelection(),
                awaySelection: new HomeDrawAwaySelection(),
            },
        ];
        const eventTimeInfo: string = '{0}';

        const getEventTimeDateFromPipe = service.getEventTimeDateFromPipe(homeDrawAway, eventTimeInfo, null);
        expect(getEventTimeDateFromPipe).toBe('THURSDAY 29 DECEMBER - TUESDAY 29 NOVEMBER');
    });

    it('HomeDrawAway with multiple Selections having same EventDateTime', () => {
        const homeDrawAway: HomeDrawAway[] = [
            {
                eventName: '',
                eventDateTime: new Date('2022-12-29T15:00:00Z'),
                eventTime: '',
                homeSelection: new HomeDrawAwaySelection(),
                drawSelection: new HomeDrawAwaySelection(),
                awaySelection: new HomeDrawAwaySelection(),
            },
            {
                eventName: '',
                eventDateTime: new Date('2022-12-29T15:00:00Z'),
                eventTime: '',
                homeSelection: new HomeDrawAwaySelection(),
                drawSelection: new HomeDrawAwaySelection(),
                awaySelection: new HomeDrawAwaySelection(),
            },
        ];
        const eventTimeInfo: string = '{0}';

        const getEventTimeDateFromPipe = service.getEventTimeDateFromPipe(homeDrawAway, eventTimeInfo, null);
        expect(getEventTimeDateFromPipe).toBe('THURSDAY 29 DECEMBER');
    });
});
