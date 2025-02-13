import { TestBed } from '@angular/core/testing';

import { DSL_NOT_READY, DslRecordable, DslRecorderService } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslCacheServiceMock } from '../../../core/test/dsl/dsl-cache.mock';
import { PlayBreakDslValuesProvider } from '../src/play-break-dsl-values-provider';
import { PlayBreak } from '../src/play-break.models';
import { PlayBreakServiceMock } from './play-break.mocks';

describe('PlayBreakDslValuesProvider', () => {
    let target: DslRecordable;
    let dslCacheServiceMock: DslCacheServiceMock;
    let playBreakServiceMock: PlayBreakServiceMock;

    beforeEach(() => {
        playBreakServiceMock = MockContext.useMock(PlayBreakServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslRecorderService, PlayBreakDslValuesProvider],
        });

        const provider = TestBed.inject(PlayBreakDslValuesProvider);
        TestBed.inject(DslRecorderService).beginRecording();

        target = provider.getProviders().PlayBreak!;
    });

    it('should return not ready initially', () => {
        expect(() => target.IsActive).toThrowError(DSL_NOT_READY);
        expect(() => target.BreakType).toThrowError(DSL_NOT_READY);
        expect(() => target.EndDate).toThrowError(DSL_NOT_READY);
    });

    it('should get value once loaded', () => {
        const playBreak: PlayBreak = {
            playBreak: true,
            playBreakType: 'Test',
            playBreakEndTime: '2021-01-01',
            gracePeriodEndTime: '2021-01-01',
            gracePeriod: true,
            playBreakOpted: true,
        };
        playBreakServiceMock.playBreak.next(playBreak);

        expect(target.IsActive).toBeTrue();
        expect(target.BreakType).toBe('Test');
        expect(target.EndDate).toBe('2021-01-01');
    });

    describe('Invalidate watcher', () => {
        it('should invalidate cache and update value playBreak event', () => {
            playBreakServiceMock.playBreak.next(<any>{});

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['playBreak']);
        });
    });
});
