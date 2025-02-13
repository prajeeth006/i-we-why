import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DSL_NOT_READY } from '@frontend/vanilla/core';
import { MockContext } from 'moxxi';

import { DslUserGroupAttributeResolverService } from '../../src/dsl/dsl-user-group-attribute-resolver.service';
import { SharedFeaturesApiServiceMock } from '../../src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../user/user.mock';
import { DslCacheServiceMock } from './dsl-cache.mock';

describe('DslUserGroupAttributeResolverService', () => {
    let dslUserGroupAttributeResolverService: DslUserGroupAttributeResolverService;
    let dslCacheServiceMock: DslCacheServiceMock;
    let apiServiceMock: SharedFeaturesApiServiceMock;

    beforeEach(() => {
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);
        apiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        MockContext.useMock(UserServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, DslUserGroupAttributeResolverService],
        });

        dslUserGroupAttributeResolverService = TestBed.inject(DslUserGroupAttributeResolverService);
    });

    describe('resolve()', () => {
        it('should return not ready and request result from api', fakeAsync(() => {
            const value = dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal', groupAttribute: 'attr' });

            expect(value).toBe(DSL_NOT_READY);

            tick();

            expect(apiServiceMock.post).toHaveBeenCalledWith('asyncdsl/groupattribute', [{ groupName: 'testVal', groupAttribute: 'attr' }], {
                showSpinner: false,
            });
        }));

        it('should execute one request for multiple groups', fakeAsync(() => {
            dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal', groupAttribute: 'attr' });
            dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal1', groupAttribute: 'attr1' });

            tick();

            expect(apiServiceMock.post).toHaveBeenCalledWith(
                'asyncdsl/groupattribute',
                [
                    { groupName: 'testVal', groupAttribute: 'attr' },
                    { groupName: 'testVal1', groupAttribute: 'attr1' },
                ],
                jasmine.anything(),
            );
        }));

        it('should invalidate cache when request is completed', fakeAsync(() => {
            dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal', groupAttribute: 'attr' });
            dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal1', groupAttribute: 'attr1' });

            tick();

            apiServiceMock.post.completeWith({
                data: [
                    { groupName: 'testVal', groupAttribute: 'attr', value: 'value1' },
                    { groupName: 'testVal1', groupAttribute: 'attr1', passed: 'value2' },
                ],
            });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith([
                'user.GetGroupAttribute.testVal.attr.user',
                'user.GetGroupAttribute.testVal1.attr1.user',
            ]);
        }));

        it('should return cached result after request is completed', fakeAsync(() => {
            dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal', groupAttribute: 'attr' });
            dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal1', groupAttribute: 'attr1' });

            tick();

            apiServiceMock.post.completeWith({
                data: [
                    { groupName: 'testVal', groupAttribute: 'attr', value: 'value1' },
                    { groupName: 'testVal1', groupAttribute: 'attr1', value: 'value2' },
                ],
            });

            apiServiceMock.post.calls.reset();

            expect(dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal', groupAttribute: 'attr' }).value).toBe('value1');
            expect(dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal1', groupAttribute: 'attr1' }).value).toBe('value2');

            tick();

            expect(apiServiceMock.post).not.toHaveBeenCalled();
        }));

        it('should not request result for the same list and item when request is already in progress', fakeAsync(() => {
            dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal', groupAttribute: 'attr' });

            tick();

            expect(dslUserGroupAttributeResolverService.resolve({ groupName: 'testVal', groupAttribute: 'attr' })).toBe(DSL_NOT_READY);

            expect(apiServiceMock.post.calls.count()).toBe(1);
        }));
    });
});
