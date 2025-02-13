import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SlotName, SlotType } from '@frontend/vanilla/core';
import { NavigationLayoutTopMenuComponent } from '@frontend/vanilla/features/navigation-layout';
import { MockContext } from 'moxxi';

import { DynamicLayoutServiceMock } from '../../../core/test/dynamic-layout/dynamic-layout.mock';
import { NavigationLayoutBootstrapService } from '../src/navigation-layout-bootstrap.service';
import { NavigationLayoutConfigMock } from './navigation-layout.client-config.mock';
import { NavigationLayoutServiceMock } from './navigation-layout.mocks';

describe('NavigationLayoutBootstrapService', () => {
    let service: NavigationLayoutBootstrapService;
    let navigationLayoutConfigMock: NavigationLayoutConfigMock;
    let navigationLayoutServiceMock: NavigationLayoutServiceMock;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;

    beforeEach(() => {
        navigationLayoutConfigMock = MockContext.useMock(NavigationLayoutConfigMock);
        navigationLayoutServiceMock = MockContext.useMock(NavigationLayoutServiceMock);
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, NavigationLayoutBootstrapService],
        });

        service = TestBed.inject(NavigationLayoutBootstrapService);

        service.onFeatureInit();
    });

    describe('onFeatureInit', () => {
        it('should set NavigationLayoutTopMenuComponent if does not exist', fakeAsync(() => {
            navigationLayoutServiceMock.isV1orV4 = true;
            dynamicLayoutServiceMock.getSlot.and.returnValue({});
            navigationLayoutConfigMock.whenReady.next();
            tick();

            expect(navigationLayoutServiceMock.init).toHaveBeenCalled();
            expect(dynamicLayoutServiceMock.getSlot).toHaveBeenCalledOnceWith(SlotName.HeaderSubNav, SlotType.Single);
            expect(dynamicLayoutServiceMock.setComponent).toHaveBeenCalledOnceWith(SlotName.HeaderSubNav, NavigationLayoutTopMenuComponent, null);
        }));

        it('should NOT set NavigationLayoutTopMenuComponent if already exists', fakeAsync(() => {
            navigationLayoutServiceMock.isV1orV4 = true;
            dynamicLayoutServiceMock.getSlot.and.returnValue({ component: NavigationLayoutTopMenuComponent });
            navigationLayoutConfigMock.whenReady.next();
            tick();

            expect(navigationLayoutServiceMock.init).toHaveBeenCalled();
            expect(dynamicLayoutServiceMock.setComponent).not.toHaveBeenCalled();
        }));

        it('should NOT set NavigationLayoutTopMenuComponent if not isV1orV4', fakeAsync(() => {
            navigationLayoutConfigMock.whenReady.next();
            tick();

            expect(dynamicLayoutServiceMock.getSlot).not.toHaveBeenCalled();
            expect(dynamicLayoutServiceMock.setComponent).not.toHaveBeenCalled();
        }));
    });
});
