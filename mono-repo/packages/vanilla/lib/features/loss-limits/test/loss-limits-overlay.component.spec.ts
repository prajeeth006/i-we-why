import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ClientConfigServiceMock } from '../../../core/test/client-config/client-config.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { LossLimitsOverlayComponent } from '../src/loss-limits-overlay.component';
import { LossLimitsDetails, LossLimitsType } from '../src/loss-limits.models';
import { LossLimitsTrackingServiceMock } from './loss-limits-tracking-service.mock';
import { LossLimitsConfigMock } from './loss-limits.mock';

describe('LossLimitsOverlayComponent', () => {
    let fixture: ComponentFixture<LossLimitsOverlayComponent>;
    let component: LossLimitsOverlayComponent;
    let overlayRefMock: OverlayRefMock;
    let lossLimitsConfigMock: LossLimitsConfigMock;
    let lossLimitsTrackingServiceMock: LossLimitsTrackingServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    const lossLimitsDetails: LossLimitsDetails[] = [
        {
            notificationType: LossLimitsType.DailyLimit,
            playerLimitAmount: 10,
            totalLossAmount: 8,
            pendingLossAmount: 2,
            currency: 'JPY',
            usedPercentage: 80,
            isMandatory: false,
        },
        {
            notificationType: LossLimitsType.WeeklyLimit,
            playerLimitAmount: 100,
            totalLossAmount: 81,
            pendingLossAmount: 19,
            currency: 'JPY',
            usedPercentage: 81,
            isMandatory: false,
        },
        {
            notificationType: LossLimitsType.MonthLimit,
            playerLimitAmount: 200,
            totalLossAmount: 162,
            pendingLossAmount: 38,
            currency: 'JPY',
            usedPercentage: 81,
            isMandatory: false,
        },
    ];

    beforeEach(() => {
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        lossLimitsConfigMock = MockContext.useMock(LossLimitsConfigMock);
        lossLimitsTrackingServiceMock = MockContext.useMock(LossLimitsTrackingServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        MockContext.useMock(ClientConfigServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        lossLimitsConfigMock.closeWaitingTime = 3;
        lossLimitsConfigMock.content = {
            messages: {
                CloseMessage: 'You can close this message in {0} seconds',
                SubTitle: 'SubTitle',
            },
        };

        TestBed.overrideComponent(LossLimitsOverlayComponent, { set: { imports: [], schemas: [NO_ERRORS_SCHEMA] } });

        fixture = TestBed.createComponent(LossLimitsOverlayComponent);

        fixture.componentRef.setInput('lossLimitsDetails', lossLimitsDetails);
        component = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
        it('should set content and init countdown', () => {
            expect(component.buttonsDisabled()).toBeTrue();

            fixture.detectChanges();

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.LossLimitsInterval,
                {
                    interval: 1000,
                    runInsideAngularZone: true,
                },
                jasmine.any(Function),
            );
            expect(lossLimitsTrackingServiceMock.trackLoad).toHaveBeenCalledOnceWith(lossLimitsDetails);

            webWorkerServiceMock.createWorker.calls.mostRecent().args[2]();
            webWorkerServiceMock.createWorker.calls.mostRecent().args[2]();

            expect(component.closeMessage()).toBe('You can close this message in 1 seconds');

            webWorkerServiceMock.createWorker.calls.mostRecent().args[2]();

            expect(component.buttonsDisabled()).toBeFalse();
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.LossLimitsInterval);
            expect(component.lossLimitsDetails()).toEqual(lossLimitsDetails);
        });
    });

    describe('ngOnDestroy', () => {
        it('should clear interval', () => {
            component.ngOnDestroy();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.LossLimitsInterval);
        });
    });

    describe('close()', () => {
        it('should close overlay', () => {
            component.close();

            expect(lossLimitsTrackingServiceMock.trackClose).toHaveBeenCalledOnceWith(lossLimitsDetails);
            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });
});
