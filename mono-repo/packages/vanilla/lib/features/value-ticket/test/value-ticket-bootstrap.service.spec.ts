import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SimpleEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { EventsServiceMock } from '../../../core/src/utils/test/utils.mock';
import { CookieServiceMock } from '../../../core/test';
import { RemoteLoggerMock } from '../../../core/test/utils/remote-logger.mock';
import { ValueTicketBootstrapService } from '../src/value-ticket-bootstrap.service';
import { ValueTicketRequest } from '../src/value-ticket.models';
import { ValueTicketConfigMock } from './value-ticket-config.mock';
import { ValueTicketServiceMock } from './value-ticket-service.mock';

describe('ValueTicketBootstrapService', () => {
    let service: ValueTicketBootstrapService;
    let eventsServiceMock: EventsServiceMock;
    let valueTicketServiceMock: ValueTicketServiceMock;
    let valueTicketConfigMock: ValueTicketConfigMock;
    let cookieServiceMock: CookieServiceMock;
    let remoteLoggerMock: RemoteLoggerMock;
    let event: SimpleEvent;

    beforeEach(() => {
        eventsServiceMock = MockContext.useMock(EventsServiceMock);
        valueTicketServiceMock = MockContext.useMock(ValueTicketServiceMock);
        valueTicketConfigMock = MockContext.useMock(ValueTicketConfigMock);
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        remoteLoggerMock = MockContext.useMock(RemoteLoggerMock);

        valueTicketConfigMock.isEnabled = true;

        event = {
            eventName: 'VALUETICKET',
            data: { barcode: 'V-123', source: 'terminal', reqRefId: '123' },
        };

        TestBed.configureTestingModule({
            providers: [ValueTicketBootstrapService, MockContext.providers],
        });

        service = TestBed.inject(ValueTicketBootstrapService);
    });

    describe('OnFeatureInit', () => {
        it('should not show overlay if disabled', () => {
            valueTicketConfigMock.isEnabled = false;
            service.onFeatureInit();
            valueTicketConfigMock.whenReady.next();
            cookieServiceMock.get.and.returnValue('1');
            eventsServiceMock.events.next(event);

            expect(valueTicketServiceMock.init).not.toHaveBeenCalled();
        });

        it('should not show overlay if config is not ready', () => {
            valueTicketConfigMock.isEnabled = false;
            service.onFeatureInit();
            cookieServiceMock.get.and.returnValue('1');
            eventsServiceMock.events.next(event);

            expect(valueTicketServiceMock.init).not.toHaveBeenCalled();
        });

        it('should show overlay if VALUETICKET', fakeAsync(() => {
            service.onFeatureInit();
            valueTicketConfigMock.whenReady.next();
            cookieServiceMock.get.and.returnValue('1');
            eventsServiceMock.events.next(event);

            tick();

            expect(valueTicketServiceMock.init).toHaveBeenCalledOnceWith(<ValueTicketRequest>{
                id: 'V-123',
                source: 'terminal',
                shopId: '1',
                terminalId: '1',
                reqRefId: '123',
            });
        }));

        it('should log error if shop ID and terminal ID are not defined', fakeAsync(() => {
            service.onFeatureInit();
            valueTicketConfigMock.whenReady.next();
            eventsServiceMock.events.next(event);

            tick();

            expect(valueTicketServiceMock.init).not.toHaveBeenCalled();
            expect(remoteLoggerMock.logError).toHaveBeenCalledWith(
                `shop_id and/or terminal_id cookies are missing for ValueTicket: ${event.data.barcode}`,
            );
        }));

        it('should not init overlay if not VALUETICKET', () => {
            service.onFeatureInit();
            valueTicketConfigMock.whenReady.next();
            eventsServiceMock.events.next({ eventName: 'EVENT' });

            expect(valueTicketServiceMock.init).not.toHaveBeenCalled();
        });
    });
});
