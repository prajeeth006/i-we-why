import { TestBed, discardPeriodicTasks, fakeAsync } from '@angular/core/testing';

import { MockContext } from 'moxxi';
import { of } from 'rxjs';

import { SessionStoreServiceMock } from '../../../core/src/browser/store/test/session-store.mock';
import { SharedFeaturesApiServiceMock } from '../../../core/src/http/test/shared-features-api.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { ProductServiceMock } from '../../../core/test/products/product.mock';
import { SmartBannerResourceService } from '../src/smart-banner-resource.service';
import { SmartBannerConfigMock } from './smart-banner-config.mock';

describe('SmartBannerResourceService', () => {
    let service: SmartBannerResourceService;
    let sessionStoreServiceMock: SessionStoreServiceMock;
    let smartBannerConfigMock: SmartBannerConfigMock;
    let dslServiceMock: DslServiceMock;
    let sharedFeaturesApiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        sessionStoreServiceMock = MockContext.useMock(SessionStoreServiceMock);
        smartBannerConfigMock = MockContext.useMock(SmartBannerConfigMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        sharedFeaturesApiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        MockContext.useMock(ProductServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SmartBannerResourceService],
        });

        service = TestBed.inject(SmartBannerResourceService);
    });

    describe('closedCounter', () => {
        it('should get counter from session store service', () => {
            service.closedCounter;

            expect(sessionStoreServiceMock.get).toHaveBeenCalledOnceWith('host-closedCounter');
        });
    });

    describe('closed', () => {
        it('should return True if closed counter is greater or equal to display counter', () => {
            sessionStoreServiceMock.get.and.returnValue(10);

            expect(service.closed).toBeTrue();
        });

        it('should return False if closed counter less then display counter', () => {
            sessionStoreServiceMock.get.and.returnValue(1);

            expect(service.closed).toBeFalse();
        });
    });

    describe('smartBannerData', () => {
        it('should call smartbanner API', fakeAsync(() => {
            dslServiceMock.evaluateExpression.and.returnValue(of(true));
            smartBannerConfigMock.whenReady.next();

            service.smartBannerData.subscribe(() => {
                expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledOnceWith('smartbanner', { appId: '123456' });
            });

            discardPeriodicTasks();
        }));
    });

    describe('close', () => {
        it('should set closed count in session storage and set the data to null', () => {
            service.close();

            expect(sessionStoreServiceMock.set).toHaveBeenCalledOnceWith('host-closedCounter', 1);
        });
    });
});
