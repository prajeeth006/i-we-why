import { ComponentFactoryResolver } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { RtmsClientConfigMock, RtmsSubscriberServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';
import { RtmsOverlayBootstrapService } from '../src/rtms-overlay-bootstrap.service';
import { RtmsOverlayServiceMock } from './mocks/rtms-overlay.service.mock';

describe('RtmsOverlayBootstrapService', () => {
    let service: RtmsOverlayBootstrapService;

    let rtmsSubscriberServiceMock: RtmsSubscriberServiceMock;
    let rtmsClientConfigMock: RtmsClientConfigMock;
    let rtmsOverlayServiceMock: RtmsOverlayServiceMock;

    beforeEach(() => {
        rtmsSubscriberServiceMock = MockContext.useMock(RtmsSubscriberServiceMock);
        rtmsClientConfigMock = MockContext.useMock(RtmsClientConfigMock);
        rtmsOverlayServiceMock = MockContext.useMock(RtmsOverlayServiceMock);
        MockContext.useMock(DynamicLayoutServiceMock);

        rtmsClientConfigMock.version = 1;

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsOverlayBootstrapService, ComponentFactoryResolver],
        });
        service = TestBed.inject(RtmsOverlayBootstrapService);
    });

    it('rtmsClientConfig disabled', () => {
        rtmsClientConfigMock.isMicroComponentEnabled = false;
        service.onFeatureInit();
        expect(rtmsSubscriberServiceMock.init).not.toHaveBeenCalled();
        expect(rtmsOverlayServiceMock.init).not.toHaveBeenCalled();
    });

    it('rtmsClientConfig enabled', () => {
        rtmsClientConfigMock.isMicroComponentEnabled = true;
        rtmsClientConfigMock.version = 2;
        service.onFeatureInit();
        rtmsClientConfigMock.whenReady.next();
        expect(rtmsSubscriberServiceMock.init).toHaveBeenCalled();
        expect(rtmsOverlayServiceMock.init).toHaveBeenCalled();
    });
});
