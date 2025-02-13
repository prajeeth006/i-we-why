import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalStoreKey, SlotName, TimeFormat, TimeSpan, UnitFormat, WINDOW, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';
import { MockComponent } from 'ng-mocks';

import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { LocalStoreServiceMock } from '../../../core/test/browser/local-store.mock';
import { ClockServiceMock } from '../../../core/test/dsl/value-providers/time/clock.service.mock';
import { Renderer2Mock } from '../../../core/test/renderer2.mock';
import { UserServiceMock } from '../../../core/test/user/user.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { IconCustomComponent } from '../../icons/src/icon-fast.component';
import { PlayerActiveWagerTimerComponent } from '../src/player-active-wager-timer.component';
import { PlayerActiveWagerConfigMock } from './player-active-wager.client-config.mock';
import { PlayerActiveWagerOverlayServiceMock } from './player-active-wager.mocks';

describe('PlayerActiveWagerTimerComponent', () => {
    let fixture: ComponentFixture<PlayerActiveWagerTimerComponent>;
    let htmlNodeMock: HtmlNodeMock;
    let localStoreServiceMock: LocalStoreServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;
    let clockServiceMock: ClockServiceMock;

    beforeEach(() => {
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        localStoreServiceMock = MockContext.useMock(LocalStoreServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        clockServiceMock = MockContext.useMock(ClockServiceMock);
        MockContext.useMock(Renderer2Mock);
        MockContext.useMock(UserServiceMock);
        MockContext.useMock(PlayerActiveWagerConfigMock);
        MockContext.useMock(PlayerActiveWagerOverlayServiceMock);

        localStoreServiceMock.get.withArgs(LocalStoreKey.LugasTimestamp).and.returnValue('1');
        clockServiceMock.toTotalTimeStringFormat.and.returnValue('00:00:00');

        TestBed.configureTestingModule({
            providers: [MockContext.providers, MockComponent(IconCustomComponent)],
        });

        TestBed.overrideComponent(PlayerActiveWagerTimerComponent, {
            remove: {
                imports: [IconCustomComponent],
            },
            add: {
                imports: [MockComponent(IconCustomComponent)],
            },
        });

        TestBed.inject(WINDOW);
        fixture = TestBed.createComponent(PlayerActiveWagerTimerComponent);
        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('initialize the timer and create a Web worker', () => {
            expect(htmlNodeMock.setCssClass).toHaveBeenCalledOnceWith(`${SlotName.HeaderTopItems}-lugas-timer-shown`, true);
            expect(localStoreServiceMock.get).toHaveBeenCalledOnceWith(LocalStoreKey.LugasTimestamp);
            expect(clockServiceMock.toTotalTimeStringFormat).toHaveBeenCalledOnceWith(jasmine.any(TimeSpan), {
                unitFormat: UnitFormat.Hidden,
                hideZeros: false,
                timeFormat: TimeFormat.HMS,
            });
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.PlayerActiveWagerTimerInterval,
                { interval: 1000 },
                jasmine.any(Function),
            );
        });
    });

    describe('ngOnDestroy', () => {
        it('should remove Web worker', () => {
            fixture.destroy();

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith(`${SlotName.HeaderTopItems}-lugas-timer-shown`, false);
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.PlayerActiveWagerTimerInterval);
        });
    });
});
