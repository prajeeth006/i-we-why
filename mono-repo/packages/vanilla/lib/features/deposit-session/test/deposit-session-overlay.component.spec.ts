import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeEventType } from '@frontend/vanilla/core';
import { TrustAsHtmlPipe } from '@frontend/vanilla/shared/browser';
import { MockContext } from 'moxxi';

import { NativeAppServiceMock } from '../../../core/test/native-app/native-app.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { DepositSessionOverlayComponent } from '../src/deposit-session-overlay.component';
import { DepositSessionEvent } from '../src/deposit-session.models';
import { DepositSessionConfigMock } from './deposit-session.mocks';

describe('DepositSessionOverlayComponent', () => {
    let fixture: ComponentFixture<DepositSessionOverlayComponent>;
    let component: DepositSessionOverlayComponent;
    let nativeAppServiceMock: NativeAppServiceMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        nativeAppServiceMock = MockContext.useMock(NativeAppServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(DepositSessionConfigMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        TestBed.overrideComponent(DepositSessionOverlayComponent, { set: { imports: [TrustAsHtmlPipe], schemas: [NO_ERRORS_SCHEMA] } });
        fixture = TestBed.createComponent(DepositSessionOverlayComponent);

        fixture = TestBed.createComponent(DepositSessionOverlayComponent);
        fixture.componentRef.setInput('depositSessionEvent', <DepositSessionEvent>{ cumulativeAmount: 100, currency: 'USD' });
        component = fixture.componentInstance;
        fixture.detectChanges();
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
