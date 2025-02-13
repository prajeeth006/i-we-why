import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { OverlayRefMock } from '../../../shared/overlay-factory/test/cdk-overlay.mock';
import { HintComponent } from '../src/hint.component';

describe('HintComponent', () => {
    let fixture: ComponentFixture<HintComponent>;
    let overlayRefMock: OverlayRefMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    beforeEach(() => {
        overlayRefMock = MockContext.useMock(OverlayRefMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers],
        });
        fixture = TestBed.createComponent(HintComponent);
        fixture.detectChanges();
    });

    describe('closeMessage()', () => {
        it('should close overlay', () => {
            fixture.componentInstance.closeMessage();

            expect(overlayRefMock.detach).toHaveBeenCalled();
        });
    });

    describe('ngOnInit', () => {
        it('should close overlay', fakeAsync(() => {
            fixture.componentInstance.hint = {
                name: 'hint',
                templateName: 'test',
                parameters: {
                    timeOut: '50',
                },
            };
            fixture.componentInstance.ngOnInit();
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledWith(WorkerType.HintTimerTimeout, { timeout: 50 }, jasmine.any(Function));

            tick(500);
            expect(overlayRefMock.detach).toHaveBeenCalled();
        }));
    });

    describe('ngOnDestroy', () => {
        it('should clear timerId', fakeAsync(() => {
            fixture.componentInstance.hint = {
                name: 'hint',
                templateName: 'test',
                parameters: {
                    timeOut: '50',
                },
            };

            fixture.componentInstance.ngOnInit();

            tick(500);

            fixture.componentInstance.ngOnDestroy();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.HintTimerTimeout);
        }));
    });
});
