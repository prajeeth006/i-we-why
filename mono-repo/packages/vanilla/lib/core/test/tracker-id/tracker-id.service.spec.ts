import { TestBed } from '@angular/core/testing';

import { QuerySearchParams } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { TrackerIdConfig } from '../../src/tracker-id/tracker-id.client-config';
import { TrackerIdService } from '../../src/tracker-id/tracker-id.service';
import { CookieServiceMock } from '../browser/cookie.mock';
import { NavigationServiceMock } from '../navigation/navigation.mock';

describe('TrackerIdService', () => {
    let target: TrackerIdService;
    let cookieServiceMock: CookieServiceMock;
    let navigationServiceMock: NavigationServiceMock;

    beforeEach(() => {
        cookieServiceMock = MockContext.useMock(CookieServiceMock);
        navigationServiceMock = MockContext.useMock(NavigationServiceMock);
        const config: TrackerIdConfig = {
            queryStrings: ['trc', 'wmid'],
        };

        TestBed.configureTestingModule({
            providers: [MockContext.providers, { provide: TrackerIdConfig, useValue: config }, TrackerIdService],
        });
        target = TestBed.inject(TrackerIdService);
    });

    it('should get value from query string honoring config order - first', () => {
        runTest({
            query: 'wmid=111&trc=222&other=333',
            cookie: 'ignored',
            expected: '222',
        });
    });

    it('should get value from query string honoring config order - second', () => {
        runTest({
            query: 'wmid=111&other=333',
            cookie: 'ignored',
            expected: '111',
        });
    });

    it('should trim value from query string', () => {
        runTest({
            query: 'wmid=  111 &other=333',
            cookie: 'ignored',
            expected: '111',
        });
    });

    it('should fallback to cookie', () => {
        runTest({
            cookie: '111',
            expected: '111',
        });
    });

    it('should return empty if no tracker', () => {
        runTest({
            expected: '',
        });
    });

    function runTest(opts: { cookie?: string; query?: string; expected: string }) {
        cookieServiceMock.get.withArgs('trackerId').and.returnValue(opts.cookie);
        navigationServiceMock.location.search = new QuerySearchParams(opts.query || '');

        // act
        expect(target.get()).toBe(opts.expected);
    }
});
