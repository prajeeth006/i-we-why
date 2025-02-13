import { Mock, Stub } from 'moxxi';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import { ToastRefMock } from '../../../core/test/ngx-toastr.mock';

@Mock({ of: ToastrService })
export class ToastrServiceMock {
    @Stub() show: jasmine.Spy;
    toastrConfig = {
        iconClasses: {
            success: 'badge-success',
            info: 'badge-info',
        },
    };

    constructor() {
        this.show.and.returnValue(new ActiveToastMock());
    }
}

export class ActiveToastMock {
    onHidden = new Subject();
    toastRef = new ToastRefMock();
}
