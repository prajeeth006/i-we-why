import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { DepositLimitExceededBootstrapService } from '../src/deposit-limit-exceeded-bootstrap.service';
import { DepositLimitExceededConfigMock } from './deposit-limit-exceeded.client-config.mock';
import { DepositLimitExceededServiceMock } from './deposit-limit-exceeded.service.mock';

describe('DepositLimitExceededBootstrapService', () => {
    let service: DepositLimitExceededBootstrapService;
    let nativeAppServiceMock: NativeAppServiceMock;
    let depositLimitExceededConfigMock: DepositLimitExceededConfigMock;
    let depositLimitExceededServiceMock: DepositLimitExceededServiceMock;

    beforeEach(() => {
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        depositLimitExceededConfigMock = MockContext.useMock(DepositLimitExceededConfigMock);
        depositLimitExceededServiceMock = MockContext.useMock(DepositLimitExceededServiceMock);

        TestBed.configureTestingModule({
            providers: [DepositLimitExceededBootstrapService, MockContext.providers],
        });

        service = TestBed.inject(DepositLimitExceededBootstrapService);
    });

    describe('on event', () => {
        it('should show overlay on DEPOSIT_LIMIT_EXCEEDED event', fakeAsync(() => {
            service.onFeatureInit();
            depositLimitExceededConfigMock.whenReady.next();
            tick();
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'DEPOSIT_LIMIT_EXCEEDED', data: { source: 'terminal' } });

            expect(depositLimitExceededServiceMock.showOverlay).toHaveBeenCalled();
        }));

        it('should not init overlay when event is NOT DEPOSIT_LIMIT_EXCEEDED', fakeAsync(() => {
            service.onFeatureInit();
            depositLimitExceededConfigMock.whenReady.next();
            tick();
            nativeAppServiceMock.eventsFromNative.next({ eventName: 'EVENT' });

            expect(depositLimitExceededServiceMock.showOverlay).not.toHaveBeenCalled();
        }));
    });
});
