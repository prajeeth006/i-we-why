import { TestBed } from '@angular/core/testing';

import { MediaQueryService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { PageMock } from '../browsercommon/page.mock';
import { BreakpointObserverMock } from './breakpoint-observer.mock';

describe('MediaQueryService', () => {
    let service: MediaQueryService;
    let breakpointObserver: BreakpointObserverMock;

    beforeEach(() => {
        MockContext.useMock(PageMock);
        breakpointObserver = MockContext.useMock(BreakpointObserverMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, MediaQueryService],
        });

        service = TestBed.inject(MediaQueryService);
    });

    it('breakpoints', () => {
        expect(service.breakpoints).toEqual({
            xs: 'screen and (max-width: 599px)',
            sm: 'screen and (min-width: 600px) and (max-width: 959px)',
            md: 'screen and (min-width: 960px) and (max-width: 1279px)',
        });
    });

    describe('observe', () => {
        it('breakpoints from config', () => {
            service.observe();

            expect(breakpointObserver.observe).toHaveBeenCalledWith([
                'screen and (max-width: 599px)',
                'screen and (min-width: 600px) and (max-width: 959px)',
                'screen and (min-width: 960px) and (max-width: 1279px)',
            ]);
        });

        it('query as string', () => {
            service.observe('sm');

            expect(breakpointObserver.observe).toHaveBeenCalledWith('screen and (min-width: 600px) and (max-width: 959px)');
        });

        it('query as array of strings', () => {
            service.observe(['xs', 'screen and (min-width: 960px) and (max-width: 1279px)']);

            expect(breakpointObserver.observe).toHaveBeenCalledWith([
                'screen and (max-width: 599px)',
                'screen and (min-width: 960px) and (max-width: 1279px)',
            ]);
        });
    });

    describe('isActive', () => {
        it('breakpoint alias', () => {
            service.isActive('sm');

            expect(breakpointObserver.isMatched).toHaveBeenCalledWith('screen and (min-width: 600px) and (max-width: 959px)');
        });

        it('media query', () => {
            service.isActive('screen and (min-width: 960px) and (max-width: 1279px)');

            expect(breakpointObserver.isMatched).toHaveBeenCalledWith('screen and (min-width: 960px) and (max-width: 1279px)');
        });

        it('an array of media queries', () => {
            service.isActive(['screen and (max-width: 599px)', 'screen and (min-width: 960px) and (max-width: 1279px)']);

            expect(breakpointObserver.isMatched).toHaveBeenCalledWith([
                'screen and (max-width: 599px)',
                'screen and (min-width: 960px) and (max-width: 1279px)',
            ]);
        });
    });

    describe('toMediaQuery', () => {
        it('return media query based on alias', () => {
            expect(service.toMediaQuery('sm')).toBe('screen and (min-width: 600px) and (max-width: 959px)');
        });

        it('return media query when media query passed', () => {
            expect(service.toMediaQuery('screen and (max-width: 599px)')).toBe('screen and (max-width: 599px)');
        });

        it('return media query when array of breakpoints/media query passed', () => {
            expect(service.toMediaQuery(['xs', 'screen and (min-width: 960px) and (max-width: 1279px)'])).toEqual([
                'screen and (max-width: 599px)',
                'screen and (min-width: 960px) and (max-width: 1279px)',
            ]);
        });
    });
});
