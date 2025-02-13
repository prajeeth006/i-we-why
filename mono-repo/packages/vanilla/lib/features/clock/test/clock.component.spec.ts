import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { LocalStoreKey, SlotName, WorkerType } from '@frontend/vanilla/core';
import { ClockComponent } from '@frontend/vanilla/features/clock';
import { MockContext } from 'moxxi';

import { CommonMessagesMock } from '../../../core/src/client-config/test/common-messages.mock';
import { DateTimeServiceMock } from '../../../core/test/browser/datetime.service.mock';
import { HtmlNodeMock } from '../../../core/test/browser/html-node.mock';
import { LocalStoreServiceMock } from '../../../core/test/browser/local-store.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { ClockConfigMock } from './clock-config.mock';

describe('ClockComponent', () => {
    let fixture: ComponentFixture<ClockComponent>;
    let htmlNodeMock: HtmlNodeMock;
    let clockConfigMock: ClockConfigMock;
    let localStoreServiceMock: LocalStoreServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    beforeEach(() => {
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        clockConfigMock = MockContext.useMock(ClockConfigMock);
        localStoreServiceMock = MockContext.useMock(LocalStoreServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        MockContext.useMock(CommonMessagesMock);
        MockContext.useMock(DateTimeServiceMock);
        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });

        fixture = TestBed.createComponent(ClockComponent);
        fixture.componentInstance.slotName = SlotName.Footer;
        fixture.detectChanges();
    });

    describe('ngOnInit', () => {
        it('should init the clock and tick periodically', fakeAsync(() => {
            clockConfigMock.whenReady.next();
            tick(1000);

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledOnceWith('footer-clock-shown', true);
            expect(fixture.componentInstance.time().getSeconds()).toEqual(new Date().getSeconds());
            expect(localStoreServiceMock.get).toHaveBeenCalledOnceWith(LocalStoreKey.ClockShowTimes);
            expect(localStoreServiceMock.set).toHaveBeenCalledOnceWith(LocalStoreKey.ClockShowTimes, 1);
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(WorkerType.ClockInterval, { interval: 1000 }, jasmine.any(Function));
        }));
    });

    describe('ngOnDestroy', () => {
        it('should remove the HTML class and clear the interval', fakeAsync(() => {
            clockConfigMock.whenReady.next();
            tick();

            fixture.destroy();

            expect(htmlNodeMock.setCssClass).toHaveBeenCalledWith('footer-clock-shown', false);
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.ClockInterval);
        }));
    });
});
