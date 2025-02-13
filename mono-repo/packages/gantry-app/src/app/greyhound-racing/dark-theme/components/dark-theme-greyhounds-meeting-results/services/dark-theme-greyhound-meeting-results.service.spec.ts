import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { MockContext } from 'moxxi';
import { SportBookSelectionHelper } from 'packages/gantry-app/src/app/common/helpers/sport-book-selection-helper';
import { GreyhoundsResultsMock } from 'packages/gantry-app/src/app/common/mocks/greyhounds-results.mock';

import { ResultSelection } from '../../../../../common/models/data-feed/meeting-results.model';
import { MockMeetingResultsMapData } from '../../../../components/meeting-results/mocks/greyhounds-meeting-results.service.mock';
import { DarkThemeGreyhoundMeetingResultsService } from './dark-theme-greyhound-meeting-results.service';

describe('DarkThemeGreyhoundMeetingResultsService', () => {
    let service: DarkThemeGreyhoundMeetingResultsService;
    let mockData: MockMeetingResultsMapData;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            providers: [MockContext.providers, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
        });
        service = TestBed.inject(DarkThemeGreyhoundMeetingResultsService);
        mockData = new MockMeetingResultsMapData();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return vacants as "" as we don\'t have N/R', () => {
        const result = service.getVacantTraps(mockData.listOfSelections);
        expect(result).toBe('');
    });

    it('should return vacants as comma seperated eg: 3,4,5', () => {
        const listOfSelections: ResultSelection[] = [...mockData.listOfSelections, mockData.resultSelection6, mockData.resultSelection7];
        const result = service.getVacantTraps(listOfSelections);
        expect(result).toBe('6, 7');
    });

    it('to prepare selections properly i.e if a vacant is replaced with another selection of same runnerNumber, then based on selectionKey latest selection to be considered', () => {
        const greyhoundsResultsMock = new GreyhoundsResultsMock();
        const selections = SportBookSelectionHelper.prepareSelections(greyhoundsResultsMock.selections);
        const expectedSelectionName = selections.filter((s) => s.runnerNumber === 3)[0].selectionName;
        expect(expectedSelectionName).toBe('A Dublin Job (RES)');
    });
});
