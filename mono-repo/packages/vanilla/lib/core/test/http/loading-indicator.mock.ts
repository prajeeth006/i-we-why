import { Mock, Stub } from 'moxxi';

import { LoadingIndicatorService } from '../../src/loading-indicator/loading-indicator.service';

@Mock({ of: LoadingIndicatorService })
export class LoadingIndicatorServiceMock {
    @Stub() visible: jasmine.Spy;
    @Stub() start: jasmine.Spy;
    @Stub() setDefaultOptions: jasmine.Spy;

    constructor() {
        this.start.and.returnValue(new LoadingIndicatorHandlerMock());
    }
}

export class LoadingIndicatorHandlerMock {
    @Stub() done: jasmine.Spy;
}
