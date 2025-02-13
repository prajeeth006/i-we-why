import { DslRecorderService } from '@frontend/vanilla/core';
import { Mock, Stub } from 'moxxi';

@Mock({ of: DslRecorderService })
export class DslRecorderServiceMock {
    notRegisteredRecordables: string[] = [];
    @Stub() beginRecording: jasmine.Spy;
    @Stub() endRecording: jasmine.Spy;
    @Stub() createRecordable: jasmine.Spy;
}
