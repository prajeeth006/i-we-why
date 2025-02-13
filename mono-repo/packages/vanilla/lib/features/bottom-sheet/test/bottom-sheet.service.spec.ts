import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { MenuItemsServiceMock } from '../../account-menu/test/menu-items.mock';
import { BottomSheetService } from '../src/bottom-sheet.service';

class SampleComponent {}

describe('BottomSheetService', () => {
    let service: BottomSheetService;
    let overlayMock: OverlayFactoryMock;
    let menuItemsServiceMock: MenuItemsServiceMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        menuItemsServiceMock = MockContext.useMock(MenuItemsServiceMock);

        TestBed.configureTestingModule({
            providers: [...MockContext.providers, BottomSheetService],
        });

        service = TestBed.inject(BottomSheetService);
        overlayRef = new OverlayRefMock();
        overlayMock.create.and.returnValue(overlayRef);
    });

    describe('setItemCounter', () => {
        it('should forward to menu items service', () => {
            service.setItemCounter('item', 5, 'class');

            expect(menuItemsServiceMock.setCounter).toHaveBeenCalledWith('BottomSheet', 'item', 5, 'class');
        });
    });

    describe('menu item templates', () => {
        it('should allow to set menu item templates', () => {
            service.setBottomSheetComponent('type', SampleComponent);

            expect(service.getBottomSheetComponent('type')).toBe(SampleComponent);
        });

        it('should allow to set default item template', () => {
            service.setBottomSheetComponent('default', SampleComponent);

            expect(service.getBottomSheetComponent(undefined)).toBe(SampleComponent);
        });
    });
});
