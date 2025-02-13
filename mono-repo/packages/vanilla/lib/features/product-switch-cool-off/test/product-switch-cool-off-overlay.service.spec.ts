import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { ProductSwitchCoolOffOverlayService } from '../src/product-switch-cool-off-overlay.service';
import { ProductSwitchCoolOffComponent } from '../src/product-switch-cool-off.component';

describe('ProductSwitchCoolOffOverlayService', () => {
    let service: ProductSwitchCoolOffOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        overlayRef = MockContext.useMock(OverlayRefMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ProductSwitchCoolOffOverlayService],
        });

        overlayMock.create.and.returnValue(overlayRef);

        service = TestBed.inject(ProductSwitchCoolOffOverlayService);
    });

    describe('show()', () => {
        it('should show overlay', () => {
            service.show();

            const expectedConfig = {
                panelClass: ['product-switch-cool-off-panel', 'vn-dialog-container'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<ProductSwitchCoolOffComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(ProductSwitchCoolOffComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });
    });
});
