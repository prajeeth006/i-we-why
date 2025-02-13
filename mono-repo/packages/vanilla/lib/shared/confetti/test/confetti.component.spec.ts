import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WINDOW, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { ConfettiComponent } from '../src/confetti.component';

describe('ConfettiComponent', () => {
    let fixture: ComponentFixture<ConfettiComponent>;
    let windowMock: WindowMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    beforeEach(() => {
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);
        windowMock = new WindowMock();

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        windowMock.innerWidth = 1024;
        windowMock.innerHeight = 768;

        fixture = TestBed.createComponent(ConfettiComponent);
        fixture.detectChanges();
    });

    describe('ngAfterViewInit', () => {
        it('should init the canvas', () => {
            const canvas = fixture.componentInstance.canvasConfetti.nativeElement;

            expect(canvas.width).toBe(1024);
            expect(canvas.height).toBe(768);

            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(WorkerType.ConfettiTimeout, { timeout: 1500 }, jasmine.any(Function));
        });
    });

    describe('ngOnDestroy', () => {
        it('should remove Web worker', () => {
            fixture.destroy();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.ConfettiTimeout);
        });
    });
});
