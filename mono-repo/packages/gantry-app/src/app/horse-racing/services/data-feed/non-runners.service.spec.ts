import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { EventSourceDataFeedServiceMock } from '../../../common/mocks/event-source-data-feed-service.mock';
import { NonRunnersServiceMock } from '../../mocks/non-runners-service.mock';
import { NonRunnersService } from './non-runners.service';

describe('NonRunnersService', () => {
    let service: NonRunnersService;

    beforeEach(() => {
        MockContext.useMock(NonRunnersServiceMock);
        MockContext.useMock(EventSourceDataFeedServiceMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });
        service = TestBed.inject(NonRunnersService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
