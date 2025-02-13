import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TestBed } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { NavigationServiceMock } from '../../../core/test/navigation/navigation.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { OverlayFactoryMock } from '../../../shared/overlay-factory/test/overlay-factory.mock';
import { SessionInfoOverlayService } from '../src/session-info-overlay.service';
import { SessionInfoComponent } from '../src/session-info.component';
import { SessionInfo } from '../src/session-info.models';
import { SessionInfoConfigMock } from './session-info-config.mock';

describe('SessionInfoOverlayService', () => {
    let service: SessionInfoOverlayService;
    let overlayMock: OverlayFactoryMock;
    let overlayRef: OverlayRefMock;
    let loginDurationConfigMock: SessionInfoConfigMock;
    let navigationServiceMock: NavigationServiceMock;

    const sessionInfoMessage: SessionInfo = {
        balance: 10.2,
        elapsedTime: 700000,
    };

    beforeEach(() => {
        overlayMock = MockContext.useMock(OverlayFactoryMock);
        loginDurationConfigMock = MockContext.useMock(SessionInfoConfigMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        overlayRef = new OverlayRefMock();
        overlayRef.attach.and.returnValue({
            setInput: () => {},
        });

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SessionInfoOverlayService],
        });

        overlayMock.create.and.returnValue(overlayRef);
        loginDurationConfigMock.urlBlacklist = ['.*/nativeapp/'];
        navigationServiceMock.location.absUrl.and.returnValue('http://bwin.se/en/labelhost/test');

        service = TestBed.inject(SessionInfoOverlayService);
    });

    describe('show', () => {
        it('should create an overlay', () => {
            service.show(sessionInfoMessage);

            const expectedConfig = {
                backdropClass: 'lh-backdrop',
                panelClass: ['lh-login-duration-container', 'generic-modal-popup'],
            };

            expect(overlayMock.create).toHaveBeenCalledWith(expectedConfig);
            expect(overlayRef.attach).toHaveBeenCalled();
            const portal: ComponentPortal<SessionInfoComponent> = overlayRef.attach.calls.mostRecent().args[0];
            expect(portal.component).toBe(SessionInfoComponent);
            expect(portal.injector!.get(OverlayRef)).toBe(<any>overlayRef);
        });

        it('should not open overlay multiple times', () => {
            service.show(sessionInfoMessage);

            service.show(sessionInfoMessage);

            expect(overlayMock.create).toHaveBeenCalledTimes(1);
        });
    });

    describe('close', () => {
        it('should close overlay', () => {
            service.show(sessionInfoMessage);

            service.close();

            expect(overlayRef.detach).toHaveBeenCalled();
        });
    });
});
