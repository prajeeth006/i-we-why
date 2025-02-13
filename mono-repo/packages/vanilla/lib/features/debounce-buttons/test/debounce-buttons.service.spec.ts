import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { WINDOW, WindowEvent, WorkerType } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { WindowMock } from '../../../core/src/browser/window/test/window-ref.mock';
import { DslServiceMock } from '../../../core/test/dsl/dsl.mock';
import { HtmlElementMock } from '../../../core/test/element-ref.mock';
import { WebWorkerServiceMock } from '../../../core/test/web-worker/web-worker.service.mock';
import { DebounceButtonConfig, DebounceButtonsService } from '../src/debounce-buttons.service';

describe('DebounceButtonsService', () => {
    let service: DebounceButtonsService;
    let windowMock: WindowMock;
    let dslServiceMock: DslServiceMock;
    let webWorkerServiceMock: WebWorkerServiceMock;

    beforeEach(() => {
        windowMock = new WindowMock();
        dslServiceMock = MockContext.useMock(DslServiceMock);
        webWorkerServiceMock = MockContext.useMock(WebWorkerServiceMock);

        TestBed.configureTestingModule({
            providers: [
                MockContext.providers,
                DebounceButtonsService,
                {
                    provide: WINDOW,
                    useValue: windowMock,
                },
            ],
        });

        service = TestBed.inject(DebounceButtonsService);
    });

    describe('init', () => {
        const config: DebounceButtonConfig = {
            debounceTime: '3000',
            disabledClass: 'disabled',
            disabledCondition: 'DSL:User.LoggedIn',
            selector: '.menu-item-link',
        };

        const elements = [new HtmlElementMock(), new HtmlElementMock()];
        beforeEach(() => windowMock.document.querySelectorAll.and.returnValue(elements));

        it('should evaluate DSL expression and add disabled class', () => {
            service.init(config);

            expect(windowMock.document.querySelectorAll).toHaveBeenCalledOnceWith('.menu-item-link');
            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledWith('DSL:User.LoggedIn');
            expect(dslServiceMock.evaluateExpression).toHaveBeenCalledTimes(2);

            dslServiceMock.evaluateExpression.next(true);

            expect(elements[0]?.classList.add).toHaveBeenCalledWith('disabled');
        });

        it('should add click event if enabled and has debounceTime', () => {
            service.init(config);

            dslServiceMock.evaluateExpression.next(false);

            expect(elements[0]?.addEventListener).toHaveBeenCalledWith(WindowEvent.Click, jasmine.any(Function));
        });

        it('should disable element and remove class after debounceTime', fakeAsync(() => {
            service.init(config);

            dslServiceMock.evaluateExpression.next(false);
            elements[0]?.addEventListener.calls.mostRecent().args[1]();

            expect(elements[0]?.classList.add).toHaveBeenCalledWith('disabled');
            expect(webWorkerServiceMock.createWorker).toHaveBeenCalledOnceWith(
                WorkerType.DebounceButtonsTimeout,
                { timeout: 3000 },
                jasmine.any(Function),
            );

            elements[0]?.classList.contains.and.returnValue(true);

            tick(3000);

            expect(elements[0]?.classList.remove).toHaveBeenCalledOnceWith('disabled');
            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledOnceWith(WorkerType.DebounceButtonsTimeout);
        }));
    });

    describe('ngOnDestroy', () => {
        it('should remove worker', () => {
            service.ngOnDestroy();

            expect(webWorkerServiceMock.removeWorker).toHaveBeenCalledWith(WorkerType.DebounceButtonsTimeout);
        });
    });
});
