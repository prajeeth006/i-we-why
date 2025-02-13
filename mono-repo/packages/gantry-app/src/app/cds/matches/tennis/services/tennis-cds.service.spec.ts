import { TitleCasePipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MessageEnvelope, MessageType } from '@cds/push';
import { MockContext } from 'moxxi';

import { Markets, Sports } from '../../../../common/models/gantrymarkets.model';
import { PrepareEvsPipe } from '../../../../common/pipes/prepare-evs.pipe';
import { MockTennisCdsData } from '../mock/mock-tennis-cds-data';
import { TennisCdsTemplate } from '../models/tennis-cds-template.constant';
import { TennisCdsService } from './tennis-cds.service';

describe('TennisCdsService', () => {
    let service: TennisCdsService;
    let mockData: MockTennisCdsData;
    let titleCasePipe: TitleCasePipe;
    let prepareEvsPipe: PrepareEvsPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                MockContext.providers,
                TitleCasePipe,
                PrepareEvsPipe,
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });
        service = TestBed.inject(TennisCdsService);
        titleCasePipe = TestBed.inject(TitleCasePipe);
        prepareEvsPipe = TestBed.inject(PrepareEvsPipe);
        mockData = new MockTennisCdsData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('[DARK_THEME] should be created title case pipe', () => {
        expect(titleCasePipe).toBeTruthy();
    });

    describe('GetUpdatedTennisCdsContent', () => {
        it('should update fixture data on GameUpdate message', () => {
            service.fixture = mockData.fixture;
            const messageEnvelope: MessageEnvelope = {
                messageType: MessageType.GameUpdate,
                payload: { game: { id: 76911762, name: { value: 'Updated Game' } } },
                producer: '',
                timestamp: '',
                topic: '',
            };

            const updatedContent = service.GetUpdatedTennisCdsContent(messageEnvelope);
            expect(updatedContent).toBeTruthy();
            expect(service.fixture.games.find((game) => game.id === 76911762)?.name.value).toBe('Updated Game');
        });

        it('should return Undefined on Game Update', () => {
            service.fixture = mockData.fixture;
            const messageEnvelope: MessageEnvelope = {
                messageType: MessageType.GameUpdate,
                payload: { game: { id: 76911763, name: { value: 'Updated Game' }, templateId: '62' } },
                producer: '',
                timestamp: '',
                topic: '',
            };

            const updatedContent = service.GetUpdatedTennisCdsContent(messageEnvelope);
            expect(updatedContent).toBeTruthy();
            expect(service.fixture.games.find((game) => game.id === 76911762)?.name.value).toBeUndefined();
        });

        it('should return Undefined on Game Update without templateId', () => {
            service.fixture = mockData.fixture;
            const messageEnvelope: MessageEnvelope = {
                messageType: MessageType.GameUpdate,
                payload: { game: { id: 76911763, name: { value: 'Updated Game' } } },
                producer: '',
                timestamp: '',
                topic: '',
            };

            const updatedContent = service.GetUpdatedTennisCdsContent(messageEnvelope);
            expect(updatedContent).toBeTruthy();
            expect(service.fixture.games.find((game) => game.id === 76911762)?.name.value).toBeUndefined();
        });

        it('should remove game on GameDelete message', () => {
            service.fixture = mockData.fixture;

            const messageEnvelope: MessageEnvelope = {
                messageType: MessageType.GameDelete,
                payload: { gameId: 76911761 },
                producer: '',
                timestamp: '',
                topic: '',
            };

            const updatedContent = service.GetUpdatedTennisCdsContent(messageEnvelope);
            expect(updatedContent).toBeTruthy();
            expect(service.fixture.games.find((game) => game.id === 76911761)).toBeUndefined();
        });

        it('should update fixture data on fixtureUpdate', () => {
            service.fixture = mockData.fixture;

            const messageEnvelope: MessageEnvelope = {
                messageType: MessageType.FixtureUpdate,
                payload: { gameId: 76911761, startDate: '2024-08-30T05:00:00Z' },
                producer: '',
                timestamp: '',
                topic: '',
            };

            const updatedContent = service.GetUpdatedTennisCdsContent(messageEnvelope);
            expect(updatedContent).toBeTruthy();
            expect(service.fixture.startDate).toBe('2024-08-30T05:00:00Z');
        });
    });

    describe('should cover unit test cases for Match Betting', () => {
        it('[DARK_THEME] should return tennis content for Match Betting ', () => {
            const gantryMarkets: Markets[] = [
                {
                    sport: Sports.CdsTennis,
                    markets: [
                        {
                            matches: [TennisCdsTemplate.matchBetting],
                            name: '',
                        },
                    ],
                },
            ];

            const result = service.getTennisCdsContent(mockData.fixture, gantryMarkets, mockData.tennisContent);

            expect(result.sportName).withContext('should match sportName in upper case').toBe('TENNIS');

            expect(result.title).withContext('should match fixture title').toBe('A. Bogdanvic / J. Goodall V A. Brianti/A-L. Groenefeld');

            expect(result.eventStartDate).withContext('should match event start date').toBe('2024-08-30T05:00:00Z');

            expect(result.competitionName).withContext('should match competition name').toBe('US Open');

            expect(result.games.length).withContext('should match game length').toBe(1);

            expect(prepareEvsPipe.transform(mockData.matchBetting.matchBetting.awayBettingPrice))
                .withContext('should return EVS as we have 1/1 as awayPrice')
                .toBe('EVS');
        });
    });

    describe('should cover unit test cases for Set Betting', () => {
        it('[DARK_THEME] should return tennis content for Set Betting ', () => {
            const gantryMarkets: Markets[] = [
                {
                    sport: Sports.CdsTennis,
                    markets: [
                        {
                            matches: [TennisCdsTemplate.setBetting],
                            name: '',
                        },
                    ],
                },
            ];

            const result = service.getTennisCdsContent(mockData.fixture, gantryMarkets, mockData.tennisContent);

            expect(result.sportName).withContext('should match sportName in upper case').toBe('TENNIS');

            expect(result.title).withContext('should match fixture title').toBe('A. Bogdanvic / J. Goodall V A. Brianti/A-L. Groenefeld');

            expect(result.eventStartDate).withContext('should match event start date').toBe('2024-08-30T05:00:00Z');

            expect(result.competitionName).withContext('should match competition name').toBe('US Open');

            expect(result.games.length).withContext('should match game length').toBe(1);

            expect(prepareEvsPipe.transform(mockData.setBetting.setBetting[0].awayBettingPrice))
                .withContext('should return away betting price')
                .toBe('8/1');
        });
    });
});
