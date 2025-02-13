import { TestBed } from '@angular/core/testing';

import { LoadingIndicatorService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TimerServiceMock } from '../../src/browser/timer.mock';
import { HtmlNodeMock } from '../browser/html-node.mock';
import { PageMock } from '../browsercommon/page.mock';

describe('LoadingIndicatorService', () => {
    let service: LoadingIndicatorService;
    let htmlNodeMock: HtmlNodeMock;
    let pageMock: PageMock;
    let timerServiceMock: TimerServiceMock;

    beforeEach(() => {
        htmlNodeMock = MockContext.useMock(HtmlNodeMock);
        pageMock = MockContext.useMock(PageMock);
        timerServiceMock = MockContext.useMock(TimerServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, LoadingIndicatorService],
        });

        pageMock.loadingIndicator = {
            defaultDelay: 100,
            externalNavigationDelay: 50,
            spinnerContent: 'spinner',
            disabledUrlPattern: 'page/test',
        };

        service = TestBed.inject(LoadingIndicatorService);
    });

    it('should open indicator after configured delay', () => {
        service.start();

        expect(timerServiceMock.setTimeout).toHaveBeenCalledOnceWith(jasmine.any(Function), 100);
    });

    it('should open indicator after specified delay', () => {
        service.start({
            delay: 1000,
        });

        expect(timerServiceMock.setTimeout).toHaveBeenCalledOnceWith(jasmine.any(Function), 1000);
    });

    it('should open indicator instantly if delay is 0', () => {
        service.start({
            delay: 0,
        });

        expect(timerServiceMock.setTimeout).toHaveBeenCalledOnceWith(jasmine.any(Function), 0);
    });

    it('should close indicator', () => {
        const loadingIndicator = service.start();

        expect(timerServiceMock.setTimeout).toHaveBeenCalledOnceWith(jasmine.any(Function), 100);

        loadingIndicator.done();

        expect(timerServiceMock.clearTimeout).toHaveBeenCalled();
        expect(htmlNodeMock.setCssClass).not.toHaveBeenCalled();
    });

    it('should not show indicator if disabled for url', () => {
        service.start({ url: 'page/test' });

        expect(timerServiceMock.setTimeout).not.toHaveBeenCalled();
    });

    it('should show indicator if not disabled for url', () => {
        service.start({ url: 'page/1test' });

        expect(timerServiceMock.setTimeout).toHaveBeenCalledOnceWith(jasmine.any(Function), 100);
    });

    it('should close indicator only if all handlers are done', () => {
        const handlers = [];

        for (let i = 0; i < 5; i++) {
            handlers.push(service.start());
        }

        expect(timerServiceMock.setTimeout).toHaveBeenCalledTimes(5);

        for (let i = 0; i < 5; i++) {
            handlers[i]?.done();
        }

        expect(timerServiceMock.clearTimeout).toHaveBeenCalledTimes(5);
    });

    it('should add disable scrolling is blockScrolling parameter is true', () => {
        const loadingIndicator = service.start({ blockScrolling: true });

        expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(true);

        loadingIndicator.done();

        expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(false);
    });

    it('should remove no scrolling class after all loading indicators that block scrolling are done', () => {
        const handlers = [];

        for (let i = 0; i < 5; i++) {
            handlers.push(service.start({ blockScrolling: true }));
        }

        for (let i = 0; i < 5; i++) {
            expect(htmlNodeMock.setCssClass).not.toHaveBeenCalledWith('no-scrolling', false);
            handlers[i]?.done();
        }

        expect(htmlNodeMock.blockScrolling).toHaveBeenCalledWith(false);
    });
});
