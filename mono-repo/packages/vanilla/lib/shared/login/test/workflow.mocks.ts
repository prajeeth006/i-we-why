import { Mock, StubObservable } from 'moxxi';

import { WorkflowService } from '../src/workflow.service';

@Mock({ of: WorkflowService })
export class WorkflowServiceMock {
    @StubObservable() finalize: jasmine.ObservableSpy;
    @StubObservable() workflowData: jasmine.ObservableSpy;
    @StubObservable() finalizeWorkflowWithData: jasmine.ObservableSpy;
    @StubObservable() skip: jasmine.ObservableSpy;
}
