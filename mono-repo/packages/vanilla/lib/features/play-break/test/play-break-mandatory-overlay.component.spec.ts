import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuAction } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { MenuActionsServiceMock } from '../../../core/test/menu-actions/menu-actions.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { PlayBreakMandatoryOverlayComponent } from '../src/play-break-mandatory-overlay.component';
import { PlayBreakNotification } from '../src/play-break.models';
import { PlayBreakConfigMock, PlayBreakServiceMock, PlayBreakTrackingServiceMock } from './play-break.mocks';

describe('PlayBreakMandatoryOverlayComponent', () => {
    let fixture: ComponentFixture<PlayBreakMandatoryOverlayComponent>;
    let component: PlayBreakMandatoryOverlayComponent;
    let playBreakTrackingServiceMock: PlayBreakTrackingServiceMock;
    let menuActionsServiceMock: MenuActionsServiceMock;
    let overlayRefMock: OverlayRefMock;
    let playBreakNotification: PlayBreakNotification;

    beforeEach(() => {
        playBreakTrackingServiceMock = MockContext.useMock(PlayBreakTrackingServiceMock);
        menuActionsServiceMock = MockContext.useMock(MenuActionsServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(PlayBreakConfigMock);
        MockContext.useMock(PlayBreakServiceMock);

        playBreakNotification = {
            cstEventId: '',
            graceEndTime: 15,
        };

        TestBed.overrideComponent(PlayBreakMandatoryOverlayComponent, {
            set: {
                providers: [MockContext.providers],
                schemas: [NO_ERRORS_SCHEMA],
            },
        });

        fixture = TestBed.createComponent(PlayBreakMandatoryOverlayComponent);
        fixture.componentRef.setInput('notification', playBreakNotification);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should track and init break duration', () => {
            expect(component.content).toBeDefined();
            expect(playBreakTrackingServiceMock.trackHardInterceptorShown).toHaveBeenCalled();
        });
    });

    describe('close', () => {
        it('should track and detach overlay', () => {
            component.close();

            expect(playBreakTrackingServiceMock.trackHardInterceptorTakeBreak).toHaveBeenCalled();
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('openChat', () => {
        it('should track and invoke OPEN_ZENDESK_CHAT menu action', () => {
            component.openChat();

            expect(playBreakTrackingServiceMock.trackHardInterceptorLiveChat).toHaveBeenCalled();
            expect(menuActionsServiceMock.invoke).toHaveBeenCalledOnceWith(MenuAction.OPEN_ZENDESK_CHAT, 'player-break-mandatory');
        });
    });
});
