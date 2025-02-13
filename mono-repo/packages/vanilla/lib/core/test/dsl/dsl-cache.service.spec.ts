import { fakeAsync, tick } from '@angular/core/testing';

import { DslCacheService } from '@frontend/vanilla/core';

describe('DslCacheService', () => {
    let dslCacheService: DslCacheService;

    beforeEach(() => {
        dslCacheService = new DslCacheService();
    });

    describe('get', () => {
        it('should retrieve items from cache and return result', () => {
            const deps = new Set(['dep1', 'dep2']);
            dslCacheService.set('test', true, deps, true);

            expect(dslCacheService.get('test')).toEqual({ result: true, dependencies: deps, notReady: true });
        });

        it('should return undefined if item is not cached', () => {
            expect(dslCacheService.get('test')).not.toBeDefined();
        });
    });

    describe('invalidate', () => {
        it('should remove dependent expressions from cache', () => {
            dslCacheService.set('test', true, new Set(['dep']));
            dslCacheService.set('test2', false, new Set(['dep2']));

            dslCacheService.invalidate(['dep']);

            expect(dslCacheService.get('test')).not.toBeDefined();
        });

        it('should not remove not dependent expressions from cache', () => {
            dslCacheService.set('test', true, new Set(['dep']));
            dslCacheService.set('test2', false, new Set(['dep2']));

            dslCacheService.invalidate(['dep']);

            expect(dslCacheService.get('test2')).toBeDefined();
        });

        it('should not do anything if specified dependencies are not watched', () => {
            dslCacheService.set('test', true, new Set(['dep', 'dep2']));

            dslCacheService.invalidate(['dep']);
            dslCacheService.invalidate(['dep']);

            expect(dslCacheService.get('test')).not.toBeDefined();
        });

        it('should emit an event when cache is invalidated', fakeAsync(() => {
            const spy = jasmine.createSpy('spy');
            dslCacheService.invalidation.subscribe(spy);

            dslCacheService.set('test', true, new Set(['dep', 'dep2']));

            dslCacheService.invalidate(['dep', 'dep3']);

            tick();

            expect(spy).toHaveBeenCalledWith(new Set(['dep']));
        }));

        it('should emit single event when cache is invalidated multiple times', fakeAsync(() => {
            const spy = jasmine.createSpy('spy');
            dslCacheService.invalidation.subscribe(spy);

            dslCacheService.set('test', true, new Set(['dep']));
            dslCacheService.set('test2', true, new Set(['dep2']));

            dslCacheService.invalidate(['dep']);
            dslCacheService.invalidate(['dep2']);

            tick();

            expect(spy).toHaveBeenCalledWith(new Set(['dep', 'dep2']));
            expect(spy.calls.count()).toBe(1);
        }));
    });

    describe('whenStable()', () => {
        it('should emit an event after the cache is invalidated invalidated', fakeAsync(() => {
            const spy = jasmine.createSpy('spy');
            const stableSpy = jasmine.createSpy('spy');

            dslCacheService.invalidation.subscribe(spy);

            dslCacheService.set('test', true, new Set(['dep', 'dep2']));
            dslCacheService.invalidate(['dep', 'dep3']);

            dslCacheService.whenStable().subscribe(stableSpy);

            tick();

            expect(spy).toHaveBeenCalledBefore(stableSpy);
        }));

        it('should emit an event immediately if stable', fakeAsync(() => {
            const spy = jasmine.createSpy('spy');
            dslCacheService.whenStable().subscribe(spy);

            tick();

            expect(spy).toHaveBeenCalled();
        }));
    });
});
