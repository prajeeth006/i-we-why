import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MessageEnvelope, MessageType } from '@cds/push';
import { of } from 'rxjs';

import { CdsClientService } from '../../../../common/cds-client/cds-client-service.service';
import { StringHelper } from '../../../../common/helpers/string.helper';
import { ErrorService } from '../../../../common/services/error.service';
import { SportContentService } from '../../../../common/services/sport-content/sport-content.service';
import { SportCdsTemplateService } from '../../../common/services/sport-cds-template.service';
import { MockFormula1CdsData } from '../mock/formula1-cds-data.mock';
import { BetDetails, Formula1CdsContent, Racers } from '../models/formula1-cds-content.model';
import { Formula1CdsService } from './formula1-cds.service';

describe('Formula1CdsService', () => {
    let service: Formula1CdsService;
    let cdsClientService: jasmine.SpyObj<CdsClientService>;
    let sportCdsTemplateService: jasmine.SpyObj<SportCdsTemplateService>;
    let errorService: jasmine.SpyObj<ErrorService>;
    let sportContentService: jasmine.SpyObj<SportContentService>;
    let mockData: MockFormula1CdsData;

    beforeEach(() => {
        const cdsClientServiceSpy = jasmine.createSpyObj('CdsClientService', ['getFixtures']);
        const errorServiceSpy = jasmine.createSpyObj('ErrorService', ['logError', 'setError', 'unSetError']);
        const sportContentServiceSpy = jasmine.createSpyObj('SportContentService', ['getContent']);

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [
                Formula1CdsService,
                { provide: CdsClientService, useValue: cdsClientServiceSpy },
                { provide: ErrorService, useValue: errorServiceSpy },
                { provide: SportContentService, useValue: sportContentServiceSpy },
                provideHttpClient(withInterceptorsFromDi()),
                provideHttpClientTesting(),
            ],
        });

        service = TestBed.inject(Formula1CdsService);
        cdsClientService = TestBed.inject(CdsClientService) as jasmine.SpyObj<CdsClientService>;
        sportCdsTemplateService = TestBed.inject(SportCdsTemplateService) as jasmine.SpyObj<SportCdsTemplateService>;
        errorService = TestBed.inject(ErrorService) as jasmine.SpyObj<ErrorService>;
        sportContentService = TestBed.inject(SportContentService) as jasmine.SpyObj<SportContentService>;
        mockData = new MockFormula1CdsData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    describe('prepareFormula1CdsContent', () => {
        it('should set sport name to "FORMULA 1"', () => {
            const formula1CdsContent = new Formula1CdsContent();
            formula1CdsContent.content = mockData.formula1Content;
            service.prepareFormula1CdsContent(formula1CdsContent, mockData.fixture, mockData.markets);
            expect(formula1CdsContent.sportName).toBe('FORMULA 1');
        });

        it('should handle missing data', () => {
            const formula1CdsContent = new Formula1CdsContent();
            service.prepareFormula1CdsContent(formula1CdsContent, null as any, []);
            expect(formula1CdsContent.sportName).toBeUndefined();
            expect(errorService.setError).toHaveBeenCalled();
        });
    });

    describe('getFormula1CdsContent', () => {
        it('should fetch and combine data streams', fakeAsync(() => {
            cdsClientService.getFixtures.and.returnValue(of(mockData.fixture));
            sportContentService.getContent.and.returnValue(of(mockData.formula1Content));
            spyOn(sportCdsTemplateService as any, 'getGantryMarketDataContent').and.returnValue(of(mockData.markets));

            service.getFormula1CdsContent('fixtureId', 'marketId', 'gameIds');
            tick();

            service.formula1CdsContent$.subscribe((content) => {
                expect(content).toBeTruthy();
                expect(content.sportName).toBe('FORMULA 1');
                expect(cdsClientService.getFixtures).toHaveBeenCalled();
                expect(sportContentService.getContent).toHaveBeenCalled();
            });
        }));
    });

    describe('getUpdatedFormula1CdsContent', () => {
        it('should update fixture data on GameUpdate message', () => {
            service.fixture = mockData.fixture;
            const messageEnvelope: MessageEnvelope = {
                messageType: MessageType.GameUpdate,
                payload: { game: { id: 76911762, name: { value: 'Updated Game' } } },
                producer: '',
                timestamp: '',
                topic: '',
            };

            const updatedContent = service.getUpdatedFormula1CdsContent(messageEnvelope);

            expect(updatedContent).toBeTruthy();
            expect(service.fixture.games.find((game) => game.id === 76911762)?.name.value).toBe('Updated Game');
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

            const updatedContent = service.getUpdatedFormula1CdsContent(messageEnvelope);

            expect(updatedContent).toBeTruthy();
            expect(service.fixture.games.length).toBe(3);
            expect(service.fixture.games.find((game) => game.id === 76911761)).toBeUndefined();
        });
    });

    describe('addOddsDataInSelectionList', () => {
        it('should add odds data to racer selection list', () => {
            const racer = new Racers();
            const game = mockData.fixture.games[0];
            service.addOddsDataInSelectionList(racer, 'Alonso', 1, game);

            expect(racer.selectionDetails).toBeDefined();
            expect(racer.selectionDetails.length).toBe(1);
            expect(racer.selectionDetails[0].order).toBe(1);
        });
    });

    describe('arrangeMissingSelections', () => {
        it('should arrange missing selections', () => {
            const formula1TempContent = new Formula1CdsContent();
            const racer = new Racers();
            racer.driverName = 'Racer A';
            racer.selectionDetails.push(new BetDetails(1, 'Fastest Lap', '5'));
            racer.selectionDetails.push(new BetDetails(2, 'Points Finish', '3'));
            racer.selectionDetails.push(new BetDetails(3, 'Podium Finish', '6'));
            racer.selectionDetails.push(new BetDetails(4, 'Race Winner', '4'));
            formula1TempContent.racerList = [racer];

            service['arrangeMissingSelections'](formula1TempContent);

            expect(racer.selectionDetails.length).toBe(4);
        });
    });

    describe('sortRaceWinnerList', () => {
        it('should sort racerList by selectionDetails[3].betOdds in ascending order', () => {
            const formula1TempContent = new Formula1CdsContent();
            const racerA = new Racers();
            racerA.driverName = 'Racer A';
            racerA.selectionDetails.push(new BetDetails(1, 'Fastest Lap', '5'));
            racerA.selectionDetails.push(new BetDetails(2, 'Points Finish', '3'));
            racerA.selectionDetails.push(new BetDetails(3, 'Podium Finish', '6'));
            racerA.selectionDetails.push(new BetDetails(4, 'Race Winner', '4'));
            const racerB = new Racers();
            racerB.driverName = 'Racer B';
            racerB.selectionDetails.push(new BetDetails(1, 'Fastest Lap', '2'));
            racerB.selectionDetails.push(new BetDetails(2, 'Points Finish', '3'));
            racerB.selectionDetails.push(new BetDetails(3, 'Podium Finish', '1'));
            racerB.selectionDetails.push(new BetDetails(4, 'Race Winner', '4'));
            formula1TempContent.racerList = [racerA, racerB];

            const sortedFormula1CdsContent = service['sortRaceWinnerList'](formula1TempContent);

            expect(sortedFormula1CdsContent.racerList).toBeDefined();
            expect(sortedFormula1CdsContent.racerList.length).toBe(2);
            expect(StringHelper.getPriceFromOdds(sortedFormula1CdsContent.racerList[0].selectionDetails[3].betOdds)).toBeLessThanOrEqual(
                StringHelper.getPriceFromOdds(sortedFormula1CdsContent.racerList[1].selectionDetails[3].betOdds),
            );
        });
    });
});
