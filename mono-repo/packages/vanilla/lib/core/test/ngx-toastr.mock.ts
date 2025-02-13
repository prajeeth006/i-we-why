import { Mock, Stub, StubObservable } from 'moxxi';
import { ToastPackage, ToastRef } from 'ngx-toastr';

@Mock({ of: ToastRef })
export class ToastRefMock {
    @Stub() manualClose: jasmine.Spy;
    @StubObservable() manualClosed: jasmine.ObservableSpy;
    @StubObservable() timeoutReset: jasmine.ObservableSpy;
    @StubObservable() countDuplicate: jasmine.ObservableSpy;
    @StubObservable() afterActivate: jasmine.ObservableSpy;
}

@Mock({ of: ToastPackage })
export class ToastPackageMock {
    config = {
        easeTime: 300,
    };
    toastRef = new ToastRefMock();
}
