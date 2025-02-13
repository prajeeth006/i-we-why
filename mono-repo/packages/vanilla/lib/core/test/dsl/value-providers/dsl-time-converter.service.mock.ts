import { DslTimeConverterService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: DslTimeConverterService })
export class DslTimeConverterServiceMock {
    @Stub() fromTimeToDsl: jasmine.Spy;
    @Stub() fromTimeSpanToDsl: jasmine.Spy;
    @Stub() fromDslToTime: jasmine.Spy;
    @Stub() fromDslToTimeSpan: jasmine.Spy;
}
