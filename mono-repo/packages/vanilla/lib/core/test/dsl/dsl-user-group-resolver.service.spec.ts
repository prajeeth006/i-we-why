import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DSL_NOT_READY } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslUserGroupResolverService } from '../../src/dsl/dsl-user-group-resolver.service';
import { SharedFeaturesApiServiceMock } from '../../src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../user/user.mock';
import { DslCacheServiceMock } from './dsl-cache.mock';

describe('DslUserGroupResolverService', () => {
    let dslUserGroupResolverService: DslUserGroupResolverService;
    let dslCacheServiceMock: DslCacheServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslUserGroupResolverService],
        });

        dslUserGroupResolverService = TestBed.inject(DslUserGroupResolverService);
    });

    describe('resolve()', () => {
        it('should return not ready and request result from api', fakeAsync(() => {
            const value = dslUserGroupResolverService.resolve({ group: 'testVal' });

            expect(value).toBe(DSL_NOT_READY);

            tick();

            expect(apiServiceMock.post).toHaveBeenCalledWith('asyncdsl/group', [{ group: 'testVal' }], { showSpinner: false });
        }));

        it('should execute one request for multiple groups', fakeAsync(() => {
            dslUserGroupResolverService.resolve({ group: 'testVal' });
            dslUserGroupResolverService.resolve({ group: 'testVal2' });

            tick();

            expect(apiServiceMock.post).toHaveBeenCalledWith('asyncdsl/group', [{ group: 'testVal' }, { group: 'testVal2' }], jasmine.anything());
        }));

        it('should invalidate cache when request is completed', fakeAsync(() => {
            dslUserGroupResolverService.resolve({ group: 'testVal' });
            dslUserGroupResolverService.resolve({ group: 'testVal2' });

            tick();

            apiServiceMock.post.completeWith({
                data: [
                    { group: 'testVal', passed: true },
                    { group: 'testVal2', passed: false },
                ],
            });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['user.IsInGroup.testVal.user', 'user.IsInGroup.testVal2.user']);
        }));

        it('should return cached result after request is completed', fakeAsync(() => {
            dslUserGroupResolverService.resolve({ group: 'testVal' });
            dslUserGroupResolverService.resolve({ group: 'testVal2' });

            tick();

            apiServiceMock.post.completeWith({
                data: [
                    { group: 'testVal', passed: true },
                    { group: 'testVal2', passed: false },
                ],
            });

            apiServiceMock.post.calls.reset();

            expect(dslUserGroupResolverService.resolve({ group: 'testVal' }).passed).toBeTrue();
            expect(dslUserGroupResolverService.resolve({ group: 'testVal2' }).passed).toBeFalse();

            tick();

            expect(apiServiceMock.post).not.toHaveBeenCalled();
        }));

        it('should not request result for the same list and item when request is already in progress', fakeAsync(() => {
            dslUserGroupResolverService.resolve({ group: 'testVal' });

            tick();

            expect(dslUserGroupResolverService.resolve({ group: 'testVal' })).toBe(DSL_NOT_READY);

            expect(apiServiceMock.post.calls.count()).toBe(1);
        }));
    });
});
