import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockContext } from 'moxxi';

import { DSL_NOT_READY } from '../../src/dsl/dsl-recorder.service';
import { SegmentationGroupResolver } from '../../src/dsl/segmentation-group-resolver';
import { SharedFeaturesApiServiceMock } from '../../src/http/test/shared-features-api.mock';
import { UserServiceMock } from '../user/user.mock';
import { DslCacheServiceMock } from './dsl-cache.mock';

describe('SegmentationGroupResolver', () => {
    let target: SegmentationGroupResolver;
    let sharedFeaturesApiServiceMock: SharedFeaturesApiServiceMock;
    let userServiceMock: UserServiceMock;
    let dslCacheServiceMock: DslCacheServiceMock;

    beforeEach(() => {
        sharedFeaturesApiServiceMock = MockContext.useMock(SharedFeaturesApiServiceMock);
        userServiceMock = MockContext.useMock(UserServiceMock);
        dslCacheServiceMock = MockContext.useMock(DslCacheServiceMock);

        TestBed.configureTestingModule({
            providers: [MockContext.providers, SegmentationGroupResolver],
        });

        target = TestBed.inject(SegmentationGroupResolver);
    });

    describe('isInGroup', () => {
        it('should not call api when user not authenticated', () => {
            userServiceMock.isAuthenticated = false;

            const result = target.isInGroup('group_a');

            expect(result).toBeFalse();
            expect(sharedFeaturesApiServiceMock.get).not.toHaveBeenCalled();
        });

        it('should call api and return value', fakeAsync(() => {
            let result = target.isInGroup('fsafda');

            expect(sharedFeaturesApiServiceMock.get).toHaveBeenCalledWith('segmentationgroups');
            expect(result).toBe(DSL_NOT_READY);

            sharedFeaturesApiServiceMock.get.next({ groups: ['betmgm group', 'entain'] });

            expect(dslCacheServiceMock.invalidate).toHaveBeenCalledWith(['user.segmentationGroups']);
            tick();

            result = target.isInGroup('betmgm group');
            expect(result).toBeTrue();

            result = target.isInGroup('fsafda');
            expect(result).toBeFalse();
        }));
    });
});
