import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { CookieServiceMock } from '../../../core/test/browser/cookie.mock';
import { LastKnownProductConfigMock } from '../../../core/test/last-known-product/last-known-product-config.mock';
import { LastKnownProductServiceMock } from '../../../core/test/last-known-product/last-known-product.mock';
import { ProductSwitchCoolOffService } from '../src/product-switch-cool-off.service';
import { ProductSwitchCoolOffResourceServiceMock } from './product-switch-cool-off.mock';

describe('ProductSwitchCoolOffService', () => {
    let service: ProductSwitchCoolOffService;
    let cookieServiceMock: CookieServiceMock;
    let lastKnownProductConfigMock: LastKnownProductConfigMock;
    let lastKnownProductServiceMock: LastKnownProductServiceMock;
    let productSwitchCoolOffResourceServiceMock: ProductSwitchCoolOffResourceServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        lastKnownProductConfigMock = MockContext.useMock(LastKnownProductConfigMock);
        lastKnownProductServiceMock = MockContext.useMock(LastKnownProductServiceMock);
        productSwitchCoolOffResourceServiceMock = MockContext.useMock(ProductSwitchCoolOffResourceServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ProductSwitchCoolOffService],
        });

        cookieServiceMock.get.withArgs('lastCoolOffProduct').and.returnValue('testweb');
        lastKnownProductConfigMock.product = 'testweb';
        lastKnownProductServiceMock.get.and.returnValues({ previous: 'test', name: 'current' });
    });

    function init() {
        service = TestBed.inject(ProductSwitchCoolOffService);
    }

    describe('shouldShow', () => {
        it('should be false if previous product is unknown', () => {
            lastKnownProductServiceMock.get.and.returnValues({ previous: 'unknown' });
            init();

            expect(service.shouldShow()).toBeFalse();
        });

        it('should be false if last cool off product is current product', () => {
            init();

            expect(service.shouldShow()).toBeFalse();
        });

        it('should be true previous is not unknow and last cool off product is not current product', () => {
            lastKnownProductConfigMock.product = 'sports';
            init();

            expect(service.shouldShow()).toBeTrue();
        });
    });

    describe('shouldWriteLastCoolOffProductOnBootstrap', () => {
        it('should be true if previous is unknown and last cool of does not exist', () => {
            lastKnownProductServiceMock.get.and.returnValues({ previous: 'unknown' });
            cookieServiceMock.get.withArgs('lastCoolOffProduct').and.returnValue(undefined);
            init();

            expect(service.shouldWriteLastCoolOffProductOnBootstrap()).toBeTrue();
        });

        it('should be false if previous is not unknow', () => {
            cookieServiceMock.get.withArgs('lastCoolOffProduct').and.returnValue(undefined);
            init();

            expect(service.shouldWriteLastCoolOffProductOnBootstrap()).toBeFalse();
        });

        it('should be false if last cool off exists', () => {
            lastKnownProductServiceMock.get.and.returnValues({ previous: 'unknown' });
            init();

            expect(service.shouldWriteLastCoolOffProductOnBootstrap()).toBeFalse();
        });
    });

    describe('setLastCoolOffProduct', () => {
        it('should save last cool off product cookie', () => {
            init();
            service.setLastCoolOffProduct();

            expect(cookieServiceMock.putRaw).toHaveBeenCalledWith('lastCoolOffProduct', 'testweb');
        });
    });

    describe('setPlayerArea', () => {
        it('should save last cool off product cookie', () => {
            init();
            service.setPlayerArea();

            expect(productSwitchCoolOffResourceServiceMock.setPlayerArea).toHaveBeenCalledWith('current', 'test');
        });
    });
});
