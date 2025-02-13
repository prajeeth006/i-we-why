import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { of, throwError } from 'rxjs';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { BalancePropertiesServiceMock } from '../../balance-properties/test/balance-properties.service.mock';
import { ValueTicketOverlayComponent } from '../src/value-ticket-overlay.component';
import { TicketStatus, VALUE_TICKET_DATA, ValueTicketData, ValueTicketStatus } from '../src/value-ticket.models';
import { ValueTicketConfigMock } from './value-ticket-config.mock';
import { ValueTicketResourceServiceMock } from './value-ticket-resource-service.mock';
import { ValueTicketTrackingServiceMock } from './value-ticket-tracking.service.mock';

describe('ValueTicketOverlayComponent', () => {
    let fixture: ComponentFixture<ValueTicketOverlayComponent>;
    let component: ValueTicketOverlayComponent;
    let overlayRefMock: OverlayRefMock;
    let valueTicketResourceServiceMock: ValueTicketResourceServiceMock;
    let valueTicketTrackingServiceMock: ValueTicketTrackingServiceMock;
    let balancePropertiesServiceMock: BalancePropertiesServiceMock;
    let ticketData: ValueTicketData;

    beforeEach(() => {
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        valueTicketResourceServiceMock = MockContext.useMock(ValueTicketResourceServiceMock);
        valueTicketTrackingServiceMock = MockContext.useMock(ValueTicketTrackingServiceMock);
        balancePropertiesServiceMock = MockContext.useMock(BalancePropertiesServiceMock);
        MockContext.useMock(ValueTicketConfigMock);

        ticketData = <ValueTicketData>{
            valueTicketId: 'v',
            amount: 25,
            source: 'terminal',
            status: TicketStatus.SUCCESS,
            valueTicketStatus: ValueTicketStatus.SCANNED,
        };

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                {
                    provide: VALUE_TICKET_DATA,
                    useValue: ticketData,
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        });

        fixture = TestBed.createComponent(ValueTicketOverlayComponent);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should update dialog content and track', () => {
            fixture.detectChanges();

            expect(component.dialog()).toEqual({
                status: ValueTicketStatus.SCANNED,
                title: undefined,
                text: undefined,
            });

            expect(valueTicketTrackingServiceMock.trackScanTicketOverlayDisplay).toHaveBeenCalled();
        });

        it('should track block ticket overlay', () => {
            ticketData.valueTicketStatus = ValueTicketStatus.BLOCKED;

            fixture.detectChanges();

            expect(valueTicketTrackingServiceMock.trackBlockTicketOverlayDisplay).toHaveBeenCalledOnceWith(component.dialog()?.text);
        });
    });

    describe('accept', () => {
        it('should do an API request to payout value ticket', () => {
            valueTicketResourceServiceMock.payoutValueTicket.and.returnValue(
                of({
                    status: TicketStatus.SUCCESS,
                    valueTicketStatus: ValueTicketStatus.PAID_OUT,
                }),
            );

            component.accept();

            expect(valueTicketResourceServiceMock.payoutValueTicket).toHaveBeenCalledWith({
                ...ticketData,
                id: ticketData.valueTicketId,
                description: ticketData.comments,
            });

            expect(component.ticketData).toEqual({
                ...ticketData,
                status: TicketStatus.SUCCESS,
                valueTicketStatus: ValueTicketStatus.PAID_OUT,
            });
            expect(balancePropertiesServiceMock.refresh).toHaveBeenCalled();
        });

        it('should show error overlay', () => {
            valueTicketResourceServiceMock.payoutValueTicket.and.returnValue(
                throwError(() => ({ errorCode: ValueTicketStatus.ORC_DEPOSIT_LIMIT_EXCEED_01 })),
            );
            component.accept();

            expect(component.ticketData).toEqual({
                ...ticketData,
                status: TicketStatus.FAILED,
                valueTicketStatus: ValueTicketStatus.ORC_DEPOSIT_LIMIT_EXCEED_01,
            });
        });
    });

    describe('cancel', () => {
        it('should close the overlay and track', () => {
            fixture.detectChanges();

            component.close();

            expect(valueTicketTrackingServiceMock.trackScanTicketOverlayClickEvent).toHaveBeenCalledOnceWith('no thanks');
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });

        it('should track block ticket overlay', () => {
            ticketData.valueTicketStatus = ValueTicketStatus.BLOCKED;

            fixture.detectChanges();

            component.close();

            expect(valueTicketTrackingServiceMock.trackBlockTicketOverlayClickEvent).toHaveBeenCalledOnceWith(component.dialog()?.text);
        });
    });
});
