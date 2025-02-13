import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { ValueTicketResourceService } from '../src/value-ticket-resource.service';
import { PayoutValueTicketRequest, ValueTicketRequest } from '../src/value-ticket.models';

describe('ValueTicketResourceService', () => {
    let service: ValueTicketResourceService;
    let sharedFeaturesApiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        sharedFeaturesApiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ValueTicketResourceService],
        });

        service = TestBed.inject(ValueTicketResourceService);
    });

    describe('getValueTicket', () => {
        it('shoud do an API request', () => {
            const request: ValueTicketRequest = {
                id: 'V-123',
                source: 'terminal',
                terminalId: '2',
                shopId: '3',
                reqRefId: '123',
            };
            service.getValueTicket(request);

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledWith('retail/valueticket', request);
        });
    });

    describe('payoutValueTicket', () => {
        it('shoud do an API request', () => {
            const request: PayoutValueTicketRequest = {
                id: 'v',
                terminalId: '1',
                source: 'terminal',
                shopId: '2',
                agentName: 'bond',
                description: 'james',
            };
            service.payoutValueTicket(request);

            expect(sharedFeaturesApiServiceMock.post).toHaveBeenCalledWith('retail/payoutvalueticket', request);
        });
    });
});
