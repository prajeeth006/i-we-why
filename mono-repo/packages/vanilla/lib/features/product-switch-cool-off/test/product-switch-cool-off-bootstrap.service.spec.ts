import { TestBed } from '@angular/core/testing';

import { UserLoginEvent } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { UserServiceMock } from '../../../core/test/user/user.mock';
import { ProductSwitchCoolOffBootstrapService } from '../src/product-switch-cool-off-bootstrap.service';
import {
    ProductSwitchCoolOffConfigMock,
    ProductSwitchCoolOffOverlayServiceMock,
    ProductSwitchCoolOffServiceMock,
} from './product-switch-cool-off.mock';

describe('ProductSwitchCoolOffBootstrapService', () => {
    let service: ProductSwitchCoolOffBootstrapService;
    let productSwitchCoolOffConfigMock: ProductSwitchCoolOffConfigMock;
    let userServiceMock: UserServiceMock;
    let productSwitchCoolOffOverlayServiceMock: ProductSwitchCoolOffOverlayServiceMock;
    let productSwitchCoolOffServiceMock: ProductSwitchCoolOffServiceMock;

    beforeEach(() => {
        productSwitchCoolOffConfigMock = MockContext.useMock(ProductSwitchCoolOffConfigMock);
        productSwitchCoolOffServiceMock = MockContext.useMock(ProductSwitchCoolOffServiceMock);
        productSwitchCoolOffOverlayServiceMock = MockContext.useMock(ProductSwitchCoolOffOverlayServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, ProductSwitchCoolOffBootstrapService],
        });

        service = TestBed.inject(ProductSwitchCoolOffBootstrapService);
        userServiceMock.isAuthenticated = true;
    });

    describe('OnFeatureInit', () => {
        describe('show', () => {
            it('should be called when user is authenticated and shouldShow is true', () => {
                service.onFeatureInit();
                productSwitchCoolOffConfigMock.whenReady.next();

                expect(productSwitchCoolOffOverlayServiceMock.show).toHaveBeenCalled();
            });

            it('should not be called when user is not authenticated', () => {
                userServiceMock.isAuthenticated = false;
                service.onFeatureInit();
                productSwitchCoolOffConfigMock.whenReady.next();

                expect(productSwitchCoolOffOverlayServiceMock.show).not.toHaveBeenCalled();
            });

            it('should not be called when shouldShow is false', () => {
                productSwitchCoolOffServiceMock.shouldShow.set(false);
                service.onFeatureInit();
                productSwitchCoolOffConfigMock.whenReady.next();

                expect(productSwitchCoolOffOverlayServiceMock.show).not.toHaveBeenCalled();
            });
        });

        describe('setLastCoolOffProduct', () => {
            it('should be called when shouldWriteLastCoolOffProductOnBootstrap is true', () => {
                service.onFeatureInit();
                productSwitchCoolOffConfigMock.whenReady.next();

                expect(productSwitchCoolOffServiceMock.setLastCoolOffProduct).toHaveBeenCalled();
            });

            it('should not be called when shouldWriteLastCoolOffProductOnBootstrap is true', () => {
                productSwitchCoolOffServiceMock.shouldWriteLastCoolOffProductOnBootstrap.set(false);
                service.onFeatureInit();
                productSwitchCoolOffConfigMock.whenReady.next();

                expect(productSwitchCoolOffServiceMock.setLastCoolOffProduct).not.toHaveBeenCalled();
            });

            it('should be called on user login', () => {
                userServiceMock.isAuthenticated = false;
                productSwitchCoolOffServiceMock.shouldWriteLastCoolOffProductOnBootstrap.set(false);
                service.onFeatureInit();
                productSwitchCoolOffConfigMock.whenReady.next();

                userServiceMock.triggerEvent(new UserLoginEvent());

                expect(productSwitchCoolOffServiceMock.setLastCoolOffProduct).toHaveBeenCalled();
            });
        });
    });
});
