import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { EventType, NativeEventType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { of, throwError } from 'rxjs';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { ValueTicketOverlayComponent } from '../src/value-ticket-overlay.component';
import { TicketStatus, VALUE_TICKET_DATA, ValueTicketErrorResponse, ValueTicketRequest, ValueTicketStatus } from '../src/value-ticket.models';
import { ValueTicketService } from '../src/value-ticket.service';
import { ValueTicketResourceServiceMock } from './value-ticket-resource-service.mock';

describe('ValueTicketService', () => {
    let service: ValueTicketService;
    let valueTicketResourceServiceMock: ValueTicketResourceServiceMock;
    let overlayMock: OverlayFactoryMock;
    let overlayRefMock: OverlayRefMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let request: ValueTicketRequest;

    beforeEach(() => {
        valueTicketResourceServiceMock = MockContext.useMock(ValueTicketResourceServiceMock);
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);

        request = {
            id: 'V-123',
            source: 'terminal',
            shopId: '',
            terminalId: '',
            reqRefId: '321',
        };

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ValueTicketService],
        });

        overlayMock.create.and.returnValue(overlayRefMock);

        service = TestBed.inject(ValueTicketService);
    });

    describe('init', () => {
        it('should get value ticket data from API', () => {
            service.init(request);

            expect(valueTicketResourceServiceMock.getValueTicket).toHaveBeenCalledWith(request);
        });

        it('should create an overlay and raise CCB event', fakeAsync(() => {
            valueTicketResourceServiceMock.getValueTicket.and.returnValue(
                of({
                    status: 'error',
                    valueTicketStatus: 'ERROR',
                }),
            );
            service.init(request);

            tick();
            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.EVENT_CAPTURE,
                parameters: {
                    usecaseName: 'SCAN_VT_COMPLETE',
                    reqRefId: request.reqRefId,
                    source: EventType.Vanilla,
                    timestamp: new Date().toISOString(),
                },
            });

            expect(overlayMock.create).toHaveBeenCalledWith({
                panelClass: ['vn-value-ticket-panel', 'vn-dialog-container'],
            });
            expect(overlayRefMock.attach).toHaveBeenCalled();
            const portal: ComponentPortal<ValueTicketOverlayComponent> = overlayRefMock.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(ValueTicketOverlayComponent);
            expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRefMock);
            expect(portal.injector?.get(VALUE_TICKET_DATA)).toEqual(<any>{
                status: 'error',
                valueTicketStatus: 'ERROR',
                source: 'terminal',
            });
        }));

        it('should show error overlay on exception', fakeAsync(() => {
            valueTicketResourceServiceMock.getValueTicket.and.returnValue(
                throwError(
                    () =>
                        <ValueTicketErrorResponse>{
                            errorCode: 'VALUETICKET_VALIDATION_ERROR',
                        },
                ),
            );
            service.init(request);

            tick();

            const expectedConfig = {
                panelClass: ['vn-value-ticket-panel', 'vn-dialog-container'],
            };

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledWith({
                eventName: NativeEventType.EVENT_CAPTURE,
                parameters: {
                    usecaseName: 'SCAN_VT_ERROR',
                    reqRefId: request.reqRefId,
                    source: EventType.Vanilla,
                    timestamp: new Date().toISOString(),
                },
            });

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRefMock.attach).toHaveBeenCalled();
            const portal: ComponentPortal<ValueTicketOverlayComponent> = overlayRefMock.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(ValueTicketOverlayComponent);
            expect(portal.injector?.get(OverlayRef)).toBe(<any>overlayRefMock);
            expect(portal.injector?.get(VALUE_TICKET_DATA)).toEqual(<any>{
                status: TicketStatus.FAILED,
                valueTicketStatus: ValueTicketStatus.VALUETICKET_VALIDATION_ERROR,
                source: 'terminal',
            });
        }));
    });
});
