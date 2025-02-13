import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { NativeEventType, TimeFormat, TimeSpan, UnitFormat } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { ClockServiceMock } from '../../../core/test/dsl/value-providers/time/clock.service.mock';
import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { TerminalSessionOverlayComponent } from '../src/terminal-session-overlay.component';
import { TerminalSessionConfigMock } from './terminal-session.mocks';

describe('TerminalSessionOverlayComponent', () => {
    let fixture: ComponentFixture<TerminalSessionOverlayComponent>;
    let component: TerminalSessionOverlayComponent;
    let terminalSessionConfigMock: TerminalSessionConfigMock;
    let clockServiceMock: ClockServiceMock;
    let nativeAppServiceMock: NativeAppServiceMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        terminalSessionConfigMock = MockContext.useMock(TerminalSessionConfigMock);
        clockServiceMock = MockContext.useMock(ClockServiceMock);
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);

        terminalSessionConfigMock.content = <any>{
            validation: {
                timeFormat: '',
                hideZeros: '',
            },
        };

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        TestBed.overrideComponent(TerminalSessionOverlayComponent, { set: { imports: [TrustAsHtmlPipe], schemas: [NO_ERRORS_SCHEMA] } });
        fixture = TestBed.createComponent(TerminalSessionOverlayComponent);

        fixture = TestBed.createComponent(TerminalSessionOverlayComponent);
        fixture.componentRef.setInput('terminalSessionNotification', { timeActive: TimeSpan.fromSeconds(10), cumulativeBalance: 100 });
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('timeActive', () => {
        it('should return formatted time', fakeAsync(() => {
            clockServiceMock.toTotalTimeStringFormat.and.returnValue('0:00:10');

            expect(component.timeActive()).toBe('0:00:10');
            expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledOnceWith(TimeSpan.fromSeconds(10), {
                timeFormat: TimeFormat.HMS,
                hideZeros: false,
                unitFormat: UnitFormat.Hidden,
            });
        }));
    });

    describe('continueSession', () => {
        it('should send continue session event to native app', () => {
            component.continueSession();

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledOnceWith({ eventName: NativeEventType.SESSION_CONTINUE });
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('finishSession', () => {
        it('should send finish session event to native app', () => {
            component.finishSession();

            expect(nativeAppServiceMock.sendToNative).toHaveBeenCalledOnceWith({ eventName: NativeEventType.SESSION_EXIT });
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
