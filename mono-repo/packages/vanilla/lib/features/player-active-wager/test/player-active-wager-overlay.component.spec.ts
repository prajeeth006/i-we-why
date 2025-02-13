import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeFormat, TimeSpan, UnitFormat, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { ClockServiceMock } from '../../../core/test/dsl/value-providers/time/clock.service.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { PlayerActiveWagerOverlayComponent } from '../src/player-active-wager-overlay.component';
import { PLAYER_ACTIVE_WAGER_TIME } from '../src/player-active-wager-overlay.service';
import { PlayerActiveWagerConfigMock } from './player-active-wager.client-config.mock';

describe('PlayerActiveWagerOverlayComponent', () => {
    let fixture: ComponentFixture<PlayerActiveWagerOverlayComponent>;
    let component: PlayerActiveWagerOverlayComponent;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let clockServiceMock: ClockServiceMock;
    let overlayRefMock: OverlayRefMock;

    beforeEach(() => {
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        clockServiceMock = MockContext.useMock(ClockServiceMock);
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        MockContext.useMock(PlayerActiveWagerConfigMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                {
                    provide: PLAYER_ACTIVE_WAGER_TIME,
                    useValue: 100,
                },
            ],
        });

        clockServiceMock.toTotalTimeStringFormat.and.returnValue('1:41');

        fixture = TestBed.createComponent(PlayerActiveWagerOverlayComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should initialize the timer and create Web worker', () => {
            expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledOnceWith(TimeSpan.fromSeconds(101), {
                unitFormat: UnitFormat.Hidden,
                hideZeros: false,
                timeFormat: TimeFormat.HMS,
            });
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.PlayerActiveWagerPopupTimerInterval,
                { interval: 1000 },
                jasmine.any(Function),
            );
        });
    });

    describe('ngOnDestroy', () => {
        it('should remove Web worker', () => {
            fixture.destroy();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.PlayerActiveWagerPopupTimerInterval);
        });
    });

    describe('close', () => {
        it('should detach overlay', () => {
            component.close();

            expect(overlayRefMock.detach).toHaveBeenCalledTimes(1);
        });
    });
});
