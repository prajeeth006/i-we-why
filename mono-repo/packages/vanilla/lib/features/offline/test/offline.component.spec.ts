import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkStatusSource, WINDOW } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { AuthServiceMock } from '../../../core/test/auth/auth.mock';
import { NetworkServiceMock } from '../../../core/test/browser/network.mock';
import { LoggerMock } from '../../../core/test/languages/logger.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OfflineComponent } from '../src/offline.component';
import { OfflineConfigMock } from './offline-config.mock';

describe('OfflineComponent', () => {
    let fixture: ComponentFixture<OfflineComponent>;
    let networkServiceMock: NetworkServiceMock;
    let windowMock: WindowMock;
    let offlineConfigMock: OfflineConfigMock;
    let authServiceMock: AuthServiceMock;
    let overlayRefMock: OverlayRefMock;
    let loggerMock: LoggerMock;

    beforeEach(() => {
        networkServiceMock = MockContext.useMock(NetworkServiceMock);
        windowMock = new WindowMock();
        offlineConfigMock = MockContext.useMock(OfflineConfigMock);
        authServiceMock = MockContext.useMock(AuthServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        loggerMock = MockContext.useMock(LoggerMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        offlineConfigMock.content.text = 'OFFLINE';

        networkServiceMock.events.next({ source: NetworkStatusSource.WindowEvent, online: true });

        fixture = TestBed.createComponent(OfflineComponent);
        fixture.detectChanges();
    });

    describe('init', () => {
        it('should set content', () => {
            expect(fixture.componentInstance.content()).toBe(offlineConfigMock.content);
        });

        it('should refresh when network comes online with true if it was changed by a window event', () => {
            const refreshSpy = spyOn(fixture.componentInstance, 'refresh');

            networkServiceMock.events.next({ source: NetworkStatusSource.WindowEvent, online: true });

            expect(refreshSpy).toHaveBeenCalledWith(true);
        });

        it('should refresh when network comes online with false if it was not changed by a window event', () => {
            const refreshSpy = spyOn(fixture.componentInstance, 'refresh');

            networkServiceMock.events.next({ source: NetworkStatusSource.ApiRequest, online: true });

            expect(refreshSpy).toHaveBeenCalledWith(false);
        });
    });

    describe('refresh', () => {
        describe('when called with false', () => {
            it('should detach overlay if network is back online', async () => {
                networkServiceMock.isOnline = true;

                await fixture.componentInstance.refresh(false);

                expect(overlayRefMock.detach).toHaveBeenCalled();
            });

            it('should not detach overlay if network is still offline', async () => {
                networkServiceMock.isOnline = false;

                await fixture.componentInstance.refresh(false);

                expect(overlayRefMock.detach).not.toHaveBeenCalled();
            });
        });

        describe('when called with true', () => {
            it('should run api check first, then detach overlay if the network is back online', async () => {
                networkServiceMock.isOnline = true;
                authServiceMock.isAuthenticated.and.returnValue(Promise.resolve(true));

                await fixture.componentInstance.refresh(true);

                expect(overlayRefMock.detach).toHaveBeenCalled();
                expect(authServiceMock.isAuthenticated).toHaveBeenCalledBefore(overlayRefMock.detach);
            });

            it('should reload if api check throws error and network is back online', async () => {
                networkServiceMock.isOnline = true;
                authServiceMock.isAuthenticated.and.returnValue(Promise.reject('XX'));

                await fixture.componentInstance.refresh(true);

                expect(windowMock.location.reload).toHaveBeenCalled();
                expect(loggerMock.error).toHaveBeenCalled();
            });
        });
    });
});
