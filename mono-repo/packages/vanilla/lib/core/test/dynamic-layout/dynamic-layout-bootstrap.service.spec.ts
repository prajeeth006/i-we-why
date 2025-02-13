import { TestBed } from '@angular/core/testing';

import { MainComponent, SlotName, SlotType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DynamicLayoutBootstrapService } from '../../src/dynamic-layout/dynamic-layout-bootstrap.service';
import { DynamicLayoutServiceMock } from './dynamic-layout.mock';

describe('DynamicLayoutBootstrapService', () => {
    let service: DynamicLayoutBootstrapService;
    let dynamicLayoutServiceMock: DynamicLayoutServiceMock;

    beforeEach(() => {
        dynamicLayoutServiceMock = MockContext.useMock(DynamicLayoutServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DynamicLayoutBootstrapService],
        });

        service = TestBed.inject(DynamicLayoutBootstrapService);
    });

    it('should register slots', () => {
        service.onAppInit();

        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.App, SlotType.Multi);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.Background, SlotType.Single);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.Banner, SlotType.Single);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.Bottom, SlotType.Multi);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.Footer, SlotType.Single);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.FooterItems, SlotType.Multi);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.FooterItemsInline, SlotType.Multi);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.Header, SlotType.Single);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.HeaderBottomItems, SlotType.Multi);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.HeaderSubNav, SlotType.Single);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.HeaderTopItems, SlotType.Multi);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.LoginSpinner, SlotType.Single);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.Main, SlotType.Single);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.Menu, SlotType.Single);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.Messages, SlotType.Multi);
        expect(dynamicLayoutServiceMock.registerSlot).toHaveBeenCalledWith(SlotName.NavLayoutFooter, SlotType.Single);
        expect(dynamicLayoutServiceMock.setComponent).toHaveBeenCalledWith(SlotName.Main, MainComponent);
    });
});
