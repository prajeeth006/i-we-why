import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DSL_NOT_READY } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslListResolverService } from '../../src/dsl/dsl-list-resolver.service';
import { SharedFeaturesApiServiceMock } from '../../src/http/test/shared-features-api.mock';
import { DslCacheServiceMock } from './dsl-cache.mock';

describe('DslListResolverService', () => {
    let dslListResolverService: DslListResolverService;
    let dslCacheServiceMock: DslCacheServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslListResolverService],
        });

        dslListResolverService = TestBed.inject(DslListResolverService);
    });

    describe('resolve()', () => {
        it('should return not ready and request result from api', fakeAsync(() => {
            const value = dslListResolverService.resolve({ listName: 'testList', item: 'testVal' });

            expect(value).toBe(DSL_NOT_READY);

            tick();

            expect(apiServiceMock.post).toHaveBeenCalledWith('asyncdsl/list', [{ listName: 'testList', item: 'testVal' }], { showSpinner: false });
        }));

        it('should execute one request for multiple filters', fakeAsync(() => {
            dslListResolverService.resolve({ listName: 'testList', item: 'testVal' });
            dslListResolverService.resolve({ listName: 'testList2', item: 'testVal2' });
            dslListResolverService.resolve({ listName: 'testList3', item: 'testVal3' });

            tick();

            expect(apiServiceMock.post).toHaveBeenCalledWith(
                'asyncdsl/list',
                [
                    { listName: 'testList', item: 'testVal' },
                    { listName: 'testList2', item: 'testVal2' },
                    { listName: 'testList3', item: 'testVal3' },
                ],
                jasmine.anything(),
            );
        }));

        it('should invalidate cache when request is completed', fakeAsync(() => {
            dslListResolverService.resolve({ listName: 'testList', item: 'testVal' });
            dslListResolverService.resolve({ listName: 'testList2', item: 'testVal2' });
            dslListResolverService.resolve({ listName: 'testList3', item: 'testVal3' });

            tick();

            apiServiceMock.post.completeWith({
                data: [
                    { listName: 'testList', item: 'testVal', passed: true },
                    { listName: 'testList2', item: 'testVal2', passed: true },
                    { listName: 'testList3', item: 'testVal3', passed: false },
                ],
            });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith([
                'list.Contains.testList.testVal',
                'list.Contains.testList2.testVal2',
                'list.Contains.testList3.testVal3',
            ]);
        }));

        it('should invalidate with empty string if value is not in the response', fakeAsync(() => {
            dslListResolverService.resolve({ listName: 'testList', item: <any>null });

            tick();

            apiServiceMock.post.completeWith({ data: [{ listName: 'testList', passed: true }] });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['list.Contains.testList.']);
        }));

        it('should return cached result after request is completed', fakeAsync(() => {
            dslListResolverService.resolve({ listName: 'testList', item: 'testVal' });
            dslListResolverService.resolve({ listName: 'testList2', item: 'testVal2' });
            dslListResolverService.resolve({ listName: 'testList3', item: 'testVal3' });

            tick();

            apiServiceMock.post.completeWith({
                data: [
                    { listName: 'testList', item: 'testVal', passed: true },
                    { listName: 'testList2', item: 'testVal2', passed: true },
                    { listName: 'testList3', item: 'testVal3', passed: false },
                ],
            });

            apiServiceMock.post.calls.reset();

            expect(dslListResolverService.resolve({ listName: 'testList', item: 'testVal' }).passed).toBeTrue();
            expect(dslListResolverService.resolve({ listName: 'testList2', item: 'testVal2' }).passed).toBeTrue();
            expect(dslListResolverService.resolve({ listName: 'testList3', item: 'testVal3' }).passed).toBeFalse();

            tick();

            expect(apiServiceMock.post).not.toHaveBeenCalled();
        }));

        it('should not request result for the same list and item when request is already in progress', fakeAsync(() => {
            dslListResolverService.resolve({ listName: 'testList', item: 'testVal' });

            tick();

            expect(dslListResolverService.resolve({ listName: 'testList', item: 'testVal' })).toBe(DSL_NOT_READY);

            expect(apiServiceMock.post.calls.count()).toBe(1);
        }));
    });
});
