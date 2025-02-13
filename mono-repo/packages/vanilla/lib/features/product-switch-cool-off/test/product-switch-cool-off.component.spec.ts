import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { LastKnownProductConfigMock } from '../../../core/test/last-known-product/last-known-product-config.mock';
import { LastKnownProductServiceMock } from '../../../core/test/last-known-product/last-known-product.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { ProductSwitchCoolOffComponent } from '../src/product-switch-cool-off.component';
import {
    ProductSwitchCoolOffConfigMock,
    ProductSwitchCoolOffServiceMock,
    ProductSwitchCoolOffTrackingServiceMock,
} from './product-switch-cool-off.mock';

describe('ProductSwitchCoolOffComponent', () => {
    let fixture: ComponentFixture<ProductSwitchCoolOffComponent>;
    let productSwitchCoolOffConfigMock: ProductSwitchCoolOffConfigMock;
    let lastKnownProductConfigMock: LastKnownProductConfigMock;
    let productSwitchCoolOffServiceMock: ProductSwitchCoolOffServiceMock;
    let lastKnownProductServiceMock: LastKnownProductServiceMock;
    let productSwitchCoolOffTrackingServiceMock: ProductSwitchCoolOffTrackingServiceMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        productSwitchCoolOffConfigMock = MockContext.useMock(ProductSwitchCoolOffConfigMock);
        productSwitchCoolOffServiceMock = MockContext.useMock(ProductSwitchCoolOffServiceMock);
        lastKnownProductConfigMock = MockContext.useMock(LastKnownProductConfigMock);
        lastKnownProductServiceMock = MockContext.useMock(LastKnownProductServiceMock);
        productSwitchCoolOffTrackingServiceMock = MockContext.useMock(ProductSwitchCoolOffTrackingServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        productSwitchCoolOffConfigMock.content = {
            title: 'Title with {PRODUCT} and {PRODUCT}',
            text: 'Text with {PRODUCT} and {PRODUCT}',
            messages: {
                OKButton: 'Ok',
                bingo: 'Bingooo',
            },
        };
        lastKnownProductConfigMock.product = 'bingo';
        lastKnownProductServiceMock.get.and.returnValue({ previous: 'casino' });

        fixture = TestBed.createComponent(ProductSwitchCoolOffComponent);
        fixture.detectChanges();
    });

    describe('init', () => {
        it('should set title and text', () => {
            expect(fixture.componentInstance.title()).toBe('Title with Bingooo and Bingooo');
            expect(fixture.componentInstance.text()).toBe('Text with Bingooo and Bingooo');
            expect(fixture.componentInstance.content()).toEqual({
                title: 'Title with {PRODUCT} and {PRODUCT}',
                text: 'Text with {PRODUCT} and {PRODUCT}',
                messages: {
                    OKButton: 'Ok',
                    bingo: 'Bingooo',
                },
            });
            expect(productSwitchCoolOffTrackingServiceMock.trackLoad).toHaveBeenCalledWith('bingo', 'casino');
        });
    });

    describe('confirm', () => {
        it('should close overlay', fakeAsync(() => {
            fixture.componentInstance.confirm();
            expect(productSwitchCoolOffServiceMock.setPlayerArea).toHaveBeenCalled();
            productSwitchCoolOffServiceMock.setPlayerArea.resolve();
            tick();
            expect(productSwitchCoolOffServiceMock.setLastCoolOffProduct).toHaveBeenCalled();
            expect(productSwitchCoolOffTrackingServiceMock.trackConfirm).toHaveBeenCalledWith('bingo', 'casino');
            expect(overlayRefMock.detach).toHaveBeenCalled();
        }));
    });
});
