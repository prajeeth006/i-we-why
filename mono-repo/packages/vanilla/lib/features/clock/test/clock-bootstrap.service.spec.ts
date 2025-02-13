import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SlotName } from '@frontend/vanilla/core';
import { ClockComponent } from '@frontend/vanilla/features/clock';
import { MockContext } from 'moxxi';

import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { ClockBootstrapService } from '../src/clock-bootstrap.service';
import { ClockConfigMock } from './clock-config.mock';
import { EmbeddableComponentsServiceMock } from './embeddable-components.mock';

describe('ClockBootstrapService', () => {
    let service: ClockBootstrapService;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;
    let clockConfigMock: ClockConfigMock;
    let embeddableComponentsServiceMock: EmbeddableComponentsServiceMock;

    beforeEach(() => {
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);
        clockConfigMock = MockContext.useMock(ClockConfigMock);
        embeddableComponentsServiceMock = MockContext.useMock(EmbeddableComponentsServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ClockBootstrapService],
        });

        clockConfigMock.slotName = SlotName.HeaderTopItems;
        clockConfigMock.dateTimeFormat = 'mediumTime';
        service = TestBed.inject(ClockBootstrapService);
    });

    describe('onFeatureInit()', () => {
        it('should add clock component to slot and register as embeddable component', fakeAsync(() => {
            service.onFeatureInit();

            expect(embeddableComponentsServiceMock.registerEmbeddableComponent).toHaveBeenCalledOnceWith(ClockComponent);

            clockConfigMock.whenReady.next();
            tick();

            expect(dynamicLayoutServiceMock.addFirstComponent).toHaveBeenCalledOnceWith(SlotName.HeaderTopItems, ClockComponent, {
                slotName: SlotName.HeaderTopItems,
                format: 'mediumTime',
            });
        }));
    });
});
