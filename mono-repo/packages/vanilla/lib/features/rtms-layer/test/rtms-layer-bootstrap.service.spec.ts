import { ComponentFactoryResolver } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { RtmsLayerBootstrapService } from '../../../features/rtms-layer/src/rtms-layer-bootstrap.service';
import { RtmsClientConfigMock, RtmsSubscriberServiceMock } from '../../../shared/rtms/test/stubs/rtms-mocks';

describe('RtmsLayerBootstrapService', () => {
    let service: RtmsLayerBootstrapService;

    let rtmsSubscriberServiceMock: RtmsSubscriberServiceMock;
    let rtmsClientConfigMock: RtmsClientConfigMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;

    beforeEach(() => {
        rtmsSubscriberServiceMock = MockContext.useMock(RtmsSubscriberServiceMock);
        rtmsClientConfigMock = MockContext.useMock(RtmsClientConfigMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);

        rtmsClientConfigMock.version = 1;

        TestBed.configureTestingModule({
            providers: [MockContext.providers, RtmsLayerBootstrapService, ComponentFactoryResolver],
        });
        service = TestBed.inject(RtmsLayerBootstrapService);
    });

    it('rtmsClientConfig disabled', () => {
        rtmsClientConfigMock.isMicroComponentEnabled = false;
        service.onFeatureInit();
        expect(rtmsSubscriberServiceMock.init).not.toHaveBeenCalled();
    });

    it('rtmsClientConfig enabled', () => {
        rtmsClientConfigMock.isMicroComponentEnabled = true;
        service.onFeatureInit();
        rtmsClientConfigMock.whenReady.next();
        expect(dynamicLayoutServiceMock.addComponent).toHaveBeenCalled();
        expect(rtmsSubscriberServiceMock.init).toHaveBeenCalled();
    });
});
