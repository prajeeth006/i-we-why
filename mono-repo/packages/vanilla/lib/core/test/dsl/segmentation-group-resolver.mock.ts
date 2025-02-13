import { Mock, Stub } from 'moxxi';

import { SegmentationGroupResolver } from '../../src/dsl/segmentation-group-resolver';

@Mock({ of: SegmentationGroupResolver })
export class SegmentationGroupResolverMock {
    @Stub() isInGroup: jasmine.Spy;
}
