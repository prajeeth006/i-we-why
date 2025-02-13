import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { InactivityScreenSessionOverlayComponent } from '@frontend/vanilla/features/inactivity-screen';
import { MockContext } from 'moxxi';

import { HomeServiceMock } from '../../../core/test/login/home-service.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { CoreLoginDialogServiceMock } from '../../login/test/login.mocks';
import { InactivityScreenConfigMock } from './inactivity-screen-config.mock';
import { InactivityScreenTrackingServiceMock } from './inactivity-screen-tracking-service.mock';

describe('InactivityScreenSessionOverlayComponent', () => {
    let fixture: ComponentFixture<InactivityScreenSessionOverlayComponent>;
    let overlayRefMock: OverlayRefMock;
    let inactivityScreenConfigMock: InactivityScreenConfigMock;
    let inactivityScreenTrackingServiceMock: InactivityScreenTrackingServiceMock;
    let loginDialogServiceMock: CoreLoginDialogServiceMock;
    let homeServiceMock: HomeServiceMock;

    beforeEach(() => {
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        inactivityScreenConfigMock = MockContext.useMock(InactivityScreenConfigMock);
        inactivityScreenTrackingServiceMock = MockContext.useMock(InactivityScreenTrackingServiceMock);
        loginDialogServiceMock = MockContext.useMock(CoreLoginDialogServiceMock);
        homeServiceMock = MockContext.useMock(HomeServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        const resources: any = {
            messages: {
                Overlay_Session_title: 'Your session expired',
                Overlay_Session_Login: 'LOGIN',
                Overlay_Session_text: 'You have {MINUTES}min',
            },
        };

        inactivityScreenConfigMock.resources = resources;
        inactivityScreenConfigMock.overlay = resources;

        fixture = TestBed.createComponent(InactivityScreenSessionOverlayComponent);
    });

    describe('ngOnInit', () => {
        it('should init values and logout for betstation grid user', () => {
            fixture.componentInstance.ngOnInit();

            expect(fixture.componentInstance.messages).toEqual({
                Overlay_Session_title: 'Your session expired',
                Overlay_Session_Login: 'LOGIN',
                Overlay_Session_text: 'You have {MINUTES}min',
            });

            expect(fixture.componentInstance.text).toBe('You have 00min');
        });

        it('should login called', fakeAsync(() => {
            fixture.componentInstance.login();

            expect(overlayRefMock.detach).toHaveBeenCalled();
            expect(inactivityScreenTrackingServiceMock.trackLogin).toHaveBeenCalled();

            inactivityScreenTrackingServiceMock.trackLogin.resolve();
            tick();

            expect(loginDialogServiceMock.open).toHaveBeenCalledWith({
                openedBy: 'inactivity',
            });
        }));

        it('should close', () => {
            fixture.componentInstance.close();
            expect(overlayRefMock.detach).toHaveBeenCalled();
            expect(homeServiceMock.goTo).toHaveBeenCalled();
        });

        it('should okClose', () => {
            fixture.componentInstance.okClose();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
