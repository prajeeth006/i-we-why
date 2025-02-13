import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { ValueTicketTrackingService } from '../src/value-ticket-tracking.service';

describe('ValueTicketTrackingService', () => {
    let service: ValueTicketTrackingService;
    let trackingServiceMock: TrackingServiceMock;

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ValueTicketTrackingService],
        });

        service = TestBed.inject(ValueTicketTrackingService);
    });

    it('track blocked overlay display', () => {
        service.trackBlockTicketOverlayDisplay('ticket is not valid');
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'scan bet ticket',
            'component.LabelEvent': 'value ticket',
            'component.ActionEvent': 'error',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'error message',
            'component.EventDetails': 'ticket is not valid',
        });
    });

    it('track blocked overlay close button click', () => {
        service.trackBlockTicketOverlayClickEvent('ok');
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'scan bet ticket',
            'component.LabelEvent': 'value ticket',
            'component.ActionEvent': 'error',
            'component.PositionEvent': 'ok',
            'component.LocationEvent': 'error message',
            'component.EventDetails': 'ok',
        });
    });

    it('track scanned ticket overlay display', () => {
        service.trackScanTicketOverlayDisplay();
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('contentView', {
            'component.CategoryEvent': 'scan bet ticket',
            'component.LabelEvent': 'value ticket',
            'component.ActionEvent': 'load',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'value ticket popup',
            'component.EventDetails': 'value ticket popup',
        });
    });

    it('track scanned ticket overlay ok button click', () => {
        service.trackScanTicketOverlayClickEvent('continue');
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'scan bet ticket',
            'component.LabelEvent': 'value ticket',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'value ticket popup',
            'component.EventDetails': 'continue',
        });
    });

    it('track scanned ticket overlay close button click', () => {
        service.trackScanTicketOverlayClickEvent('no thanks');
        expect(trackingServiceMock.triggerEvent).toHaveBeenCalledWith('Event.Tracking', {
            'component.CategoryEvent': 'scan bet ticket',
            'component.LabelEvent': 'value ticket',
            'component.ActionEvent': 'click',
            'component.PositionEvent': 'not applicable',
            'component.LocationEvent': 'value ticket popup',
            'component.EventDetails': 'no thanks',
        });
    });
});
