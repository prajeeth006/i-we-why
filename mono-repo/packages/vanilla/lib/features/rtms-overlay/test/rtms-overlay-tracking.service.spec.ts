import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { AppInfoConfigMock } from '../../../core/src/client-config/test/app-info-config.mock';
import { TrackingServiceMock } from '../../../core/src/tracking/test/tracking.mock';
import { RtmsOverlayTrackingService, RtmsTrackingData } from '../src/rtms-overlay-tracking.service';

describe('RtmsOverlayTrackingService', () => {
    let trackingServiceMock: TrackingServiceMock;
    let service: RtmsOverlayTrackingService;
    let appInfoConfig: AppInfoConfigMock;
    const rtmsTestData: RtmsTrackingData = <any>{
        positionEvent: 'NA',
        locationEvent: 'NA',
        eventDetails: 'NA',
        campaignId: 'NA',
        sitecoreTemplateid: 'NA',
        product: 'poker',
        promoIntent: 'not applicable',
        labelEvent: 'NA',
        urlClicked: 'not applicable',
    };

    beforeEach(() => {
        trackingServiceMock = MockContext.useMock(TrackingServiceMock);
        appInfoConfig = MockContext.useMock(AppInfoConfigMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsOverlayTrackingService],
        });

        service = TestBed.inject(RtmsOverlayTrackingService);
    });

    describe('trackRtmsOverlayToasterLoad', () => {
        it('should have been called once and with same data', () => {
            service.trackRtmsOverlayToasterLoad(rtmsTestData);
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledOnceWith('contentView', {
                'component.CategoryEvent': 'customer communications',
                'component.ActionEvent': 'load',
                'component.LabelEvent': rtmsTestData.labelEvent.toLocaleLowerCase(),
                'component.PositionEvent': rtmsTestData.positionEvent.toLocaleLowerCase(),
                'component.LocationEvent': rtmsTestData.locationEvent,
                'component.EventDetails': rtmsTestData.eventDetails,
                'component.URLClicked': 'not applicable',
                'component.ContentPosition': 'not applicable',
                'campaignId': rtmsTestData.campaignId,
                'page.sitecoretemplateid': rtmsTestData.sitecoreTemplateid,
                'component.Product': appInfoConfig.product.toLocaleLowerCase(),
                'component.PromoIntent': rtmsTestData.promoIntent,
            });
        });
    });

    describe('trackRtmsOverlayToasterClick', () => {
        it('should have been called once and with same data', () => {
            service.trackRtmsOverlayToasterClick(rtmsTestData);
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledOnceWith('Event.Tracking', {
                'component.CategoryEvent': 'customer communications',
                'component.ActionEvent': 'click',
                'component.LabelEvent': rtmsTestData.labelEvent.toLocaleLowerCase(),
                'component.PositionEvent': rtmsTestData.positionEvent.toLocaleLowerCase(),
                'component.LocationEvent': rtmsTestData.locationEvent,
                'component.EventDetails': rtmsTestData.eventDetails,
                'component.URLClicked': rtmsTestData.urlClicked,
                'component.ContentPosition': 'not applicable',
                'campaignId': rtmsTestData.campaignId,
                'page.sitecoretemplateid': rtmsTestData.sitecoreTemplateid,
                'component.Product': appInfoConfig.product.toLocaleLowerCase(),
                'component.PromoIntent': rtmsTestData.promoIntent,
            });
        });
    });

    describe('trackRtmsOverlayToasterClose', () => {
        it('should have been called once and with same data', () => {
            service.trackRtmsOverlayToasterClose(rtmsTestData);
            expect(trackingServiceMock.triggerEvent).toHaveBeenCalledOnceWith('Event.Tracking', {
                'component.CategoryEvent': 'customer communications',
                'component.ActionEvent': 'close',
                'component.LabelEvent': rtmsTestData.labelEvent.toLocaleLowerCase(),
                'component.PositionEvent': rtmsTestData.positionEvent.toLocaleLowerCase(),
                'component.LocationEvent': rtmsTestData.locationEvent,
                'component.EventDetails': 'close x',
                'component.URLClicked': 'not applicable',
                'component.ContentPosition': 'not applicable',
                'campaignId': rtmsTestData.campaignId,
                'page.sitecoretemplateid': rtmsTestData.sitecoreTemplateid,
                'component.Product': appInfoConfig.product.toLocaleLowerCase(),
                'component.PromoIntent': rtmsTestData.promoIntent,
            });
        });
    });
});
