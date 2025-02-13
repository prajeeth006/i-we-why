import { TestBed } from '@angular/core/testing';

import { NetworkStatusSource } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { Subject } from 'rxjs';

import { NetworkServiceMock } from '../../../core/test/browser/network.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { OfflineBootstrapService } from '../src/offline-bootstrap.service';
import { OfflineConfigMock } from './offline-config.mock';
import { OfflineServiceMock } from './offline.mock';

describe('OfflineBootstrapService', () => {
    let service: OfflineBootstrapService;
    let offlineServiceMock: OfflineServiceMock;
    let offlineConfigMock: OfflineConfigMock;
    let networkServiceMock: NetworkServiceMock;
    let dslServiceMock: DslServiceMock;
    let isEnabledSubject: Subject<boolean>;

    beforeEach(() => {
        offlineServiceMock = MockContext.useMock(OfflineServiceMock);
        offlineConfigMock = MockContext.useMock(OfflineConfigMock);
        networkServiceMock = MockContext.useMock(NetworkServiceMock);
        dslServiceMock = MockContext.useMock(DslServiceMock);
        isEnabledSubject = new Subject();

        TestBed.configureTestingModule({
            providers: [MockContext.providers, OfflineBootstrapService],
        });

        offlineConfigMock.isOverlayEnabled = 'exp';
        dslServiceMock.evaluateExpression.withArgs('exp').and.returnValue(isEnabledSubject);

        service = TestBed.inject(OfflineBootstrapService);
    });

    describe('run()', () => {
        it('should show overlay when offline', () => {
            networkServiceMock.events.next({ source: NetworkStatusSource.WindowEvent, online: false });

            service.onFeatureInit();
            offlineConfigMock.whenReady.next();
            isEnabledSubject.next(true);

            expect(offlineServiceMock.showOverlay).toHaveBeenCalled();
        });

        it('should not show overlay when disabled', () => {
            networkServiceMock.events.next({ source: NetworkStatusSource.WindowEvent, online: false });

            service.onFeatureInit();
            offlineConfigMock.whenReady.next();
            isEnabledSubject.next(false);

            expect(offlineServiceMock.showOverlay).not.toHaveBeenCalled();
        });

        it('should not show overlay when online', () => {
            service.onFeatureInit();
            offlineConfigMock.whenReady.next();
            isEnabledSubject.next(true);

            expect(offlineServiceMock.showOverlay).not.toHaveBeenCalled();
        });
    });
});
